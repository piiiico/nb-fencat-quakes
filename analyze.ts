// Filter harvested concordances to Norwegian local earthquake reports and match each against FENCAT.
// usage: bun analyze.ts [fromYear] [toYear]  -> prints unmatched + matched summary; writes data/kept.jsonl
import { readFileSync, readdirSync, writeFileSync } from "fs";

const FROM = Number(process.argv[2] ?? 1800), TO = Number(process.argv[3] ?? 1899);
const dir = import.meta.dir;

// --- FENCAT ---
type Ev = { line: string; y: number; m: number | null; d: number | null; lat: number; lon: number; c: string };
const evs: Ev[] = [];
for (const line of readFileSync(`${dir}/data/FENCAT-2020-02-28.txt`, "utf8").split("\n")) {
  if (line.length < 40) continue;
  const y = Number(line.slice(4, 8)); if (!y) continue;
  const m = Number(line.slice(8, 10)) || null, d = Number(line.slice(10, 12)) || null;
  const ll = line.slice(16).match(/\s(-?\d+\.\d+)\s+(-?\d+\.\d+)/); if (!ll) continue;
  evs.push({ line: line.trimEnd(), y, m, d, lat: +ll[1], lon: +ll[2], c: line.trimEnd().slice(-1) });
}
if (evs.length < 20000) { console.error(`FENCAT parse floor: ${evs.length} < 20000`); process.exit(1); }
const dayNum = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / 864e5;
const scand = evs.filter(e => e.lat >= 56 && e.lon <= 35 && e.lon >= 2);

function fencatNear(ts: number, back = 60): Ev[] {
  const y = Math.floor(ts / 10000), m = Math.floor(ts / 100) % 100, d = ts % 100;
  const P = dayNum(y, m, d);
  return scand.filter(e => {
    if (e.m && e.d) { const E = dayNum(e.y, e.m, e.d); return E <= P + 1 && E >= P - back; }
    if (e.m) { const E0 = dayNum(e.y, e.m, 1), E1 = dayNum(e.y, e.m, 28); return E0 <= P + 1 && E1 >= P - back; }
    return e.y === y || e.y === y - 1 && m <= 3;
  });
}

// --- filters ---
const gaz: string[] = JSON.parse(readFileSync(`${dir}/gazetteer.json`, "utf8")).map((s: string) => s.replace(/[()]/g, "")).filter((s: string) => s.length >= 4);
const variants = new Set<string>();
for (const g of gaz) { variants.add(g); variants.add(g.replace(/å/g, "aa").replace(/Å/g, "Aa")); if (g.startsWith("K")) variants.add("C" + g.slice(1)); }
const gazRe = new RegExp(`(?<![\\p{L}])(${[...variants].map(v => v.replace(/[.*+?^${}|[\]\\]/g, "\\$&")).join("|")})(?![\\p{L}])`, "u");
const FOREIGN = /(Itali|Neapel|Sicili|Calabri|Kalabri|Græken|Grækel|Tyrk|Smyrna|Konstantinop|Constantinop|Amerika|Chili|Chile|Peru|Mexico|Japan|China|Kina|Indien|Persien|Spani|Portugal|Lissabon|Schweiz|Frankrig|Tyskland|Østerrig|Ungarn|Wien|Agram|Ischia|Vesuv|Etna|Java|Manila|Ecuador|Venezuela|Caracas|Francisco|Californi|Charleston|Algier|Ægypt|Syrien|Jerusalem|Lima|Valparaiso|Messina|Rom\b|Nizza|Mentone|Riviera|Krim|Kaukas|Sebastopol|Island|Rusland|England|Skotland|Asien|Afrika|Australi|Zante|Chios|Kreta|Candia|Philippin|Antill|Haiti|Jamaica|Panama|Colombia|Granada|Bolivia|Argentin|Brasili|Kairo|Grenada|Wales|Irland|Holland|Belgi|Paris|London|Lissab|Venedig|Genua|Florents|Toscana|Piemont|Ligur|Abruzz|Tyrol|Bøhmen|Serbi|Bulgari|Rumæni|Albani|Armeni|Kaschmir|Calcutta|Bombay|Yokohama|Tokio|Formosa|Sumatra|Celebes|Molukk|Martinique|Guatemala|Salvador|Nicaragua|Costa|Cuba|Portorico|Porto|Kalifornien|Alaska|Canada|Newyork|New-York|Boston|Missouri|Mississippi|Utah|Nevada|Arizona|Texas)/i;
const FELT = /(fornum|fornem|bemærk|mærke|merke|følt|følte|ført|iagttag|rystelse|Rystelse|Bulder|Drøn|Dur\b)/i;
const LOCAL = /(\bher\b|\bher i\b|Byen|Bygden|Egnen|Omegn|Prestegjeld|Præstegjeld|Sogn|Fjord|igaar|i Gaar|inat|i Nat|forleden|Forleden)/;

const rows: any[] = [];
for (const f of readdirSync(`${dir}/data`).filter(f => /^h_.*\.jsonl$/.test(f))) {
  for (const l of readFileSync(`${dir}/data/${f}`, "utf8").split("\n")) { if (!l) continue; try { rows.push(JSON.parse(l)); } catch { console.error("bad row " + f); } }
}
if (rows.length === 0) { console.error("0 rows parsed"); process.exit(1); }
const inRange = rows.filter(r => r.year >= FROM && r.year <= TO);
const kept: any[] = [];
for (const r of inRange) {
  const t: string = r.conc ?? "";
  if (FOREIGN.test(t)) continue;
  const g = t.match(gazRe);
  const score = (g ? 2 : 0) + (FELT.test(t) ? 1 : 0) + (LOCAL.test(t) ? 1 : 0);
  if (score < 2) continue;
  const near = fencatNear(r.ts);
  kept.push({ ...r, place: g?.[1] ?? null, score, fencat: near.map(e => e.line) });
}
writeFileSync(`${dir}/data/kept.jsonl`, kept.map(k => JSON.stringify(k)).join("\n") + "\n");
// lon 2-35 so Finnmark events match (Vadsø 1873-02-21 = PAN 68.7N 33.3E), but matching has no distance test:
// a row whose ONLY matches lie east of 20E stays in the unmatched list, tagged EASTONLY, so the reader judges distance.
const east = (l: string) => { const m = l.slice(16).match(/\s(-?\d+\.\d+)\s+(-?\d+\.\d+)/); return m ? +m[2] > 20 : false; };
const un = kept.filter(k => k.fencat.length === 0 || k.fencat.every(east));
console.error(`rows=${inRange.length} kept=${kept.length} unmatched=${un.length} (years ${FROM}-${TO})`);
const show = process.argv.includes("--matched") ? kept : un;
for (const k of show.sort((a, b) => a.ts - b.ts)) console.log(`${k.ts} ${k.title} s${k.score} [${k.place ?? "-"}] ${!k.fencat.length ? "NOFENCAT" : k.fencat.every(east) ? "EASTONLY:" + k.fencat.map((l: string) => l.slice(0, 40).replace(/\s+/g, " ")).join(";") : "FENCAT:" + k.fencat.length} | ${k.conc.slice(0, 260)}`);
