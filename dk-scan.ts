// Danish newspapers (Mediestream labsapi): per-year felt-report scan, local filter, FENCAT D/N/S match.
// usage: bun dk-scan.ts <from> <to> > out.txt   (raw rows cached in data/dk/<year>.json)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
const [from, to] = [Number(process.argv[2]), Number(process.argv[3])];
const dir = `${import.meta.dir}/data/dk`; mkdirSync(dir, { recursive: true });
const FOREIGN = /(Itali|Neapel|Sicili|Calabri|Græken|Tyrk|Smyrna|Konstantinop|Amerika|Chili|Peru|Mexico|Japan|China|Indien|Persien|Spani|Portugal|Lissabon|Schweiz|Frankrig|Tydskland|Østerrig|Ungarn|Wien|Agram|Vesuv|Etna|Java|Manila|Ecuador|Venezuela|Caracas|Californi|Algier|Ægypt|Syrien|Lima|Valparaiso|Messina|Rom\b|Nizza|Island|Rusland|England|Skotland|Asien|Afrika|Zante|Malta|Grækenland|Savoie|Rhinen|Coblenz|Köln|Darmstadt|Baden|Schlesien|Sachsen|Bøhmen|Norge|Christiania|Kristiania|Sverig|Stockholm|Göteborg|Gothenborg|Paris|London|Cuba|Haiti|Chios|Kreta|Philippin|Granada|Neu|Krakau|Ostindien)/i;
const LOCAL = /(fornam|bemærke|bemærkede|sporede|spores|følte|mærkede|iagttog)/i;
const HERE = /(her i Byen|her paa Egnen|her i Egnen|Omegn|her i Sognet|her paa Øen|her i Kjøbstaden|igaar|i Gaar|inat|i Nat|i Løverdags|i Søndags|i Mandags|i Tirsdags|i Onsdags|i Torsdags|i Fredags)/i;
// FENCAT
const ev: { y: number; m: number; d: number; line: string }[] = [];
for (const l of readFileSync(`${import.meta.dir}/data/FENCAT-2020-02-28.txt`, "utf8").split("\n")) {
  const y = +l.slice(4, 8); if (!y) continue; const ll = l.slice(16).match(/\s(-?\d+\.\d+)\s+(-?\d+\.\d+)/); if (!ll) continue;
  if (+ll[1] < 53 || +ll[1] > 60 || +ll[2] < 4 || +ll[2] > 16) continue;
  ev.push({ y, m: +l.slice(8, 10) || 0, d: +l.slice(10, 12) || 0, line: l.trimEnd() });
}
if (ev.length < 50) { console.error("FENCAT floor"); process.exit(1); }
const day = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / 864e5;
let parsed = 0;
for (let y = from; y <= to; y++) {
  const f = `${dir}/${y}.json`; let rows: any[];
  if (existsSync(f)) rows = JSON.parse(readFileSync(f, "utf8"));
  else {
    const u = new URL("https://labs.statsbiblioteket.dk/labsapi/api/aviser/export/fields");
    u.searchParams.set("query", `(jordskj* OR jordryst* OR jordstød* OR jordstod*) AND py:${y}`);
    for (const x of ["recordID", "timestamp", "familyId", "lplace", "fulltext_org"]) u.searchParams.append("fields", x);
    u.searchParams.set("max", "10000"); u.searchParams.append("structure", "content"); u.searchParams.set("format", "JSON");
    let ok = false;
    for (let i = 0; i < 4 && !ok; i++) { try { const r = await fetch(u, { signal: AbortSignal.timeout(300000) }); if (r.ok) { rows = await r.json(); ok = true; } else console.error(y, "HTTP", r.status); } catch (e) { console.error(y, "ERR", e); } if (!ok) await Bun.sleep(10000); }
    if (!ok) { console.error(`FAIL ${y}`); continue; }
    writeFileSync(f, JSON.stringify(rows));
  }
  parsed += rows!.length; let k = 0;
  for (const x of rows!) {
    const t: string = (x.fulltext_org ?? "").replace(/\s+/g, " ");
    const i = t.search(/jord\s?-?\s?(skj|stj|ryst|rpst|stød|stod|skæl|skal)/i); if (i < 0) continue;
    const w = t.slice(Math.max(0, i - 350), i + 350);
    if (FOREIGN.test(w) || !LOCAL.test(w) || !HERE.test(w)) continue;
    const ts = x.timestamp.slice(0, 10); const [yy, mm, dd] = ts.split("-").map(Number); const P = day(yy, mm, dd);
    const m = ev.filter(e => e.y === yy || e.y === yy - 1).filter(e => !e.m || !e.d ? e.y === yy : day(e.y, e.m, e.d) <= P + 1 && day(e.y, e.m, e.d) >= P - 60);
    console.log(`${ts} ${x.familyId} (${x.lplace}) ${m.length ? "FENCAT:" + m.map(e => e.line.slice(0, 24)).join(";") : "NOFENCAT"} | ${w}`); k++;
  }
  console.error(`${y}: rows=${rows!.length} kept=${k}`);
}
console.error(`parsed=${parsed}`); if (parsed === 0) process.exit(1);
