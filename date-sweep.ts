// Regional date-error sweep (RUN.md DO-MORE (b)): for each dated FENCAT row, count newspaper reports that name a
// place within R km of the epicentre in the row's window (E-2..E+45 d), and find the densest regional cluster
// elsewhere within ±400 d. Row with 0 in-window and a dense cluster elsewhere = date-error candidate.
// usage: bun date-sweep.ts [fromYear=1800] [toYear=1886] [R=200]
// Sources: NO data/h_*.jsonl (DH-lab conc), SE data/se/*.jsonl (KB snippets, 1863-1876), DK data/dk/YYYY.json (full segments).
// Gazetteer: Wikidata settlements NO/SE/DK (data/wd-gazetteer.json, built from tmp/dr1/wd_*) + REGIONS below.
// Floors: exits 1 if FENCAT <20,000 rows, gazetteer <5,000 names, or <1,000 located reports.
// Controls (must hold or exit 1): LEH 18750813 flags, MUI 18410403 does not.
import { readFileSync, readdirSync, existsSync } from "fs";
const [FROM, TO, R] = [Number(process.argv[2] ?? 1800), Number(process.argv[3] ?? 1886), Number(process.argv[4] ?? 200)];
const dir = import.meta.dir;
const day = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / 864e5;
const km = (a: number[], b: number[]) => { const r = Math.PI / 180, x = (b[1] - a[1]) * r * Math.cos((a[0] + b[0]) / 2 * r), y = (b[0] - a[0]) * r; return 6371 * Math.hypot(x, y); };

// --- gazetteer ---
const REGIONS: Record<string, number[]> = { Bornholm: [55.12, 14.92], Hedemarken: [60.8, 11.2], Helgeland: [65.8, 12.8], Dalarne: [61.0, 14.5], Dalarna: [61.0, 14.5], Wermland: [59.8, 13.0], Värmland: [59.8, 13.0], Skåne: [55.9, 13.5], Bohuslän: [58.3, 11.6], Dalsland: [58.9, 12.3], Jemtland: [63.2, 14.5], Jämtland: [63.2, 14.5], Helsingland: [61.6, 16.3], Smaalenene: [59.4, 11.2], Jarlsberg: [59.3, 10.2], Telemarken: [59.4, 8.5], Valdres: [61.0, 9.2], Gudbrandsdalen: [61.6, 9.6], Østerdalen: [61.6, 11.0], Solør: [60.5, 12.2], Romsdalen: [62.5, 7.7], Nordland: [67.0, 14.5], Finmarken: [70.0, 25.0], Jylland: [56.2, 9.3], Sjælland: [55.5, 11.8], Fyen: [55.3, 10.4], Gotland: [57.5, 18.5], Öland: [56.7, 16.6] };
const STOP = new Set(["Lima", "Rom", "Roma", "Island", "Salvador", "Paris", "London", "Berlin", "Wien", "Venedig", "Amerika", "Kina", "Japan", "Indien", "Peru", "Mexico", "Nord", "Syd", "Øst", "Vest", "Kirken", "Byen", "Gaard", "Haven", "Berg", "Holm", "Strand", "Dalen", "Skog", "Lund", "Viken", "Sand", "Mark", "Huse", "Mann", "Sund", "Hede", "Born", "Store", "Lille", "Stora", "Lilla", "Norra", "Södra", "Nedre", "Øvre", "Kong", "Konge"]);
const gzFile = `${dir}/data/wd-gazetteer.json`;
let gz: Record<string, number[]>;
if (existsSync(gzFile)) gz = JSON.parse(readFileSync(gzFile, "utf8"));
else {
  const pts: Record<string, number[][]> = {};
  for (const f of readdirSync("/workspace/tmp/dr1").filter(f => f.startsWith("wd_Q"))) for (const l of readFileSync(`/workspace/tmp/dr1/${f}`, "utf8").split("\n").slice(1)) {
    const m = l.match(/,(.+),Point\((-?[\d.]+) (-?[\d.]+)\)/); if (!m) continue; (pts[m[1].replace(/^"|"$/g, "")] ??= []).push([+m[3], +m[2]]);
  }
  gz = {};
  for (const [n, ps] of Object.entries(pts)) { if (n.length < 4 || STOP.has(n) || !/^\p{Lu}/u.test(n) || /\d/.test(n)) continue; if (ps.some(p => km(p, ps[0]) > 60)) continue; gz[n] = ps[0]; }
  await Bun.write(gzFile, JSON.stringify(gz));
}
// Common-noun guard: 1870s Norwegian/Danish capitalise nouns (Veien, Stad, Minde, Landet...). Drop gazetteer names that are
// dictionary words (LibreOffice nb_NO + da_DK hunspell stems, /workspace/tmp/dict), except KEEP.
const KEEP = new Set(["Molde", "Grue", "Lund", "Moss", "Bergen", "Rønne", "Mora", "Orsa", "Osen", "Vang", "Nesna", "Nesne", "Lom", "Hol", "Ål", "Sel", "Vik", "Bø", "Fet"]);
const dict = new Set<string>();
for (const f of ["nb_NO.dic", "da_DK.dic"]) for (const l of readFileSync(`${dir}/data/${f}`, "utf8").split("\n")) dict.add(l.split("/")[0].toLowerCase());
if (dict.size < 100000) { console.error(`dictionary floor: ${dict.size}`); process.exit(1); }
for (const n of Object.keys(gz)) if (dict.has(n.toLowerCase()) && !KEEP.has(n)) delete gz[n];
Object.assign(gz, REGIONS);
const names = Object.keys(gz);
if (names.length < 5000) { console.error(`gazetteer floor: ${names.length} < 5000`); process.exit(1); }
const gzSet = new Map(names.map(n => [n, gz[n]]));
const findPlaces = (t: string) => { const w = t.match(/[\p{L}-]+/gu) ?? []; const s = new Set<string>();
  for (let i = 0; i < w.length; i++) { if (!/^\p{Lu}/u.test(w[i])) continue; if (gzSet.has(w[i])) s.add(w[i]); const b = w[i] + " " + (w[i + 1] ?? ""); if (gzSet.has(b)) s.add(b); }
  return [...s]; };
// --- reports ---
type Rep = { d: number; src: string; paper: string; places: string[]; txt: string; pts?: number[][] };
const reps: Rep[] = [];
const FOREIGN = new RegExp("(Itali|Neapel|Sicili|Calabri|Kalabri|Græken|Grækel|Tyrk|Smyrna|Konstantinop|Constantinop|Amerika|Chili|Chile|Peru|Mexico|Japan|China|Kina|Indien|Persien|Spani|Portugal|Lissabon|Schweiz|Frankrig|Tyskland|Østerrig|Ungarn|Wien|Agram|Ischia|Vesuv|Etna|Java|Manila|Ecuador|Venezuela|Caracas|Francisco|Californi|Charleston|Algier|Ægypt|Syrien|Jerusalem|Lima|Valparaiso|Messina|Rom\\b|Nizza|Mentone|Riviera|Krim|Kaukas|Sebastopol|Island|Rusland|England|Skotland|Asien|Afrika|Australi|Zante|Chios|Kreta|Candia|Philippin|Antill|Haiti|Jamaica|Panama|Colombia|Granada|Bolivia|Argentin|Brasili|Kairo|Grenada|Wales|Irland|Holland|Belgi|Paris|London|Lissab|Venedig|Genua|Florents|Toscana|Piemont|Ligur|Abruzz|Tyrol|Bøhmen|Serbi|Bulgari|Rumæni|Albani|Armeni|Kaschmir|Calcutta|Bombay|Yokohama|Tokio|Formosa|Sumatra|Celebes|Molukk|Martinique|Guatemala|Salvador|Nicaragua|Costa|Cuba|Portorico|Porto|Kalifornien|Alaska|Canada|Newyork|New-York|Boston|Missouri|Mississippi|Utah|Nevada|Arizona|Texas|Tyskland|Frankrike|Österrike|Ungern|Grekland|Turkiet|Schweiz|Spanien|Ryssland|Kalifornien|Westfal|Würtemberg|Wurtemberg|Wiirtemberg|Rhen|Ostindien|Algeri|Egypt|Persi)", "i");
const QW = /jord(skj|skæ|skel|ryst|stød|skalf|stöt|bäfn|bæv|skak)/i;
const add = (d: number, src: string, paper: string, txt: string) => {
  if (FOREIGN.test(txt)) return; const places = findPlaces(txt); if (places.length) reps.push({ d, src, paper, places, txt });
};
const cover: Record<string, Set<number>> = { NO: new Set(), SE: new Set(), DK: new Set() };
for (const f of readdirSync(`${dir}/data`).filter(f => /^h_.*\.jsonl$/.test(f))) for (const l of readFileSync(`${dir}/data/${f}`, "utf8").split("\n")) {
  if (!l) continue; let r: any; try { r = JSON.parse(l); } catch { continue; }
  const ts = r.ts; const y = Math.floor(ts / 1e4); cover.NO.add(y); add(day(y, Math.floor(ts / 100) % 100, ts % 100), "NO", r.title ?? r.urn, r.conc ?? "");
}
for (const f of readdirSync(`${dir}/data/se`)) for (const l of readFileSync(`${dir}/data/se/${f}`, "utf8").split("\n")) {
  if (!l) continue; const r = JSON.parse(l); const [y, m, d] = r.date.split("-").map(Number); cover.SE.add(y);
  add(day(y, m, d), "SE", r.title.replace(/ \d{4}-.*/, ""), r.snippets.join(" ").replace(/<\/?em>/g, ""));
}
for (const f of readdirSync(`${dir}/data/dk`)) {
  const rows = JSON.parse(readFileSync(`${dir}/data/dk/${f}`, "utf8"));
  for (const r of rows) {
    const [y, m, d] = r.timestamp.slice(0, 10).split("-").map(Number); cover.DK.add(y);
    const t = (r.fulltext_org ?? "").replace(/\s+/g, " "); let i = t.search(QW); if (i < 0) continue;
    add(day(y, m, d), "DK", r.familyId, t.slice(Math.max(0, i - 400), i + 400));
  }
}
if (reps.length < 1000) { console.error(`report floor: ${reps.length} located reports < 1000`); process.exit(1); }

// --- FENCAT ---
const rows: { line: string; E: number; lat: number; lon: number; y: number; rad: number }[] = [];
const felt = (l: string) => Number(l.trimEnd().match(/(\d+)[A-Z]$/)?.[1] ?? 0); // FENCAT felt radius km, last column
let parsed = 0;
for (const line of readFileSync(`${dir}/data/FENCAT-2020-02-28.txt`, "utf8").split("\n")) {
  const y = Number(line.slice(4, 8)); if (!y || line.length < 40) continue; parsed++;
  const m = Number(line.slice(8, 10)), d = Number(line.slice(10, 12)); const ll = line.slice(16).match(/\s(-?\d+\.\d+)\s+(-?\d+\.\d+)/);
  if (!m || !d || !ll || y < FROM || y > TO) continue; const [lat, lon] = [+ll[1], +ll[2]];
  if (lat < 54 || lat > 75 || lon < -8 || lon > 32) continue; // wide: offshore rows (MUI 18800804 at 3.9E) must explain coastal reports
  rows.push({ line: line.trimEnd(), E: day(y, m, d), lat, lon, y, rad: felt(line) });
}
if (parsed < 20000) { console.error(`FENCAT floor: ${parsed} < 20000`); process.exit(1); }

for (const p of reps) p.pts = p.places.map(n => gz[n]);
const near = (r: { lat: number; lon: number }) => reps.filter(p => p.pts!.some(q => Math.abs(q[0] - r.lat) < 2.5 && km(q, [r.lat, r.lon]) <= R));
const papers = (xs: Rep[]) => new Set(xs.map(x => x.src + ":" + x.paper)).size;
const out: any[] = [];
for (const r of rows) {
  const srcs = Object.entries(cover).filter(([, s]) => s.has(r.y)).map(([k]) => k); if (!srcs.length) continue;
  const loc = near(r).filter(p => srcs.includes(p.src));
  const others = rows.filter(o => o !== r && km([o.lat, o.lon], [r.lat, r.lon]) <= R + Math.max(R, o.rad)).map(o => o.E);
  const explained = (d: number) => others.some(E => d >= E - 2 && d <= E + 60);
  const inW = loc.filter(p => p.d >= r.E - 2 && p.d <= r.E + 45);
  let best = { n: 0, d: 0 };
  for (const p of loc) { if (Math.abs(p.d - r.E) > 400 || (p.d >= r.E - 2 && p.d <= r.E + 45) || explained(p.d)) continue;
    const n = papers(loc.filter(q => q.d >= p.d && q.d <= p.d + 30 && !(q.d >= r.E - 2 && q.d <= r.E + 45) && !explained(q.d))); if (n > best.n) best = { n, d: p.d }; }
  out.push({ r, srcs, inW: papers(inW), best, flag: best.n >= 5 && papers(inW) * 5 <= best.n, sample: loc.filter(q => q.d >= best.d && q.d <= best.d + 30).slice(0, 2).map(q => q.places.join("/") + ": " + q.txt.slice(0, 160)) });
}
const iso = (d: number) => new Date(d * 864e5).toISOString().slice(0, 10);
const show = (o: any) => `${o.flag ? "FLAG" : "    "} ${o.r.line.slice(0, 40).padEnd(40)} src=${o.srcs.join("+")} inWindow=${o.inW} bestElsewhere=${o.best.n}${o.best.n ? "@" + iso(o.best.d) : ""}`;
const ctl = (code: string) => out.find(o => o.r.line.startsWith(code));
const leh = ctl("LEH 18750813"), mui = ctl("MUI 18410403");
console.log(`rows=${out.length} reports=${reps.length} gazetteer=${names.length} R=${R}km`);
console.log("CONTROL", leh ? show(leh) : "LEH 18750813 not in range"); console.log("CONTROL", mui ? show(mui) : "MUI 18410403 not in range");
for (const o of out.filter(o => o.flag)) { console.log(show(o)); if (process.env.SAMPLE) for (const x of o.sample) console.log("      ", x); }
const bad = (leh && !leh.flag) || (mui && mui.flag);
if (bad) { console.error("CONTROL FAILED"); process.exit(1); }
