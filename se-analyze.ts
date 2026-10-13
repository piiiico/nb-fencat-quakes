// Filter data/se harvest to Swedish local felt reports, cluster by pub-week, match vs FENCAT 2020.
// usage: bun se-analyze.ts [fromYear] [toYear] [--all]
// Floor: exits 1 if FENCAT parses <20000 or harvest rows <1000.
import { readdirSync, readFileSync } from "fs";
const dir = import.meta.dir;
const [fy = "1863", ty = "1876"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const ALL = process.argv.includes("--all");
const evs: { line: string; t: number | null; y: number; lat: number; lon: number }[] = [];
for (const line of readFileSync(`${dir}/data/FENCAT-2020-02-28.txt`, "utf8").split("\n")) {
  if (line.length < 40) continue;
  const y = Number(line.slice(4, 8)); if (!y) continue;
  const m = Number(line.slice(8, 10)) || null, d = Number(line.slice(10, 12)) || null;
  const ll = line.slice(16).match(/\s(-?\d+\.\d+)\s+(-?\d+\.\d+)/); if (!ll) continue;
  evs.push({ line: line.trimEnd(), y, t: m && d ? Date.UTC(y, m - 1, d) / 864e5 : null, lat: +ll[1], lon: +ll[2] });
}
if (evs.length < 20000) { console.error("FENCAT floor", evs.length); process.exit(1); }
const nordic = evs.filter((e) => e.lat >= 54 && e.lon >= 4 && e.lon <= 32);
const FOREIGN = /amerika|california|san francisco|peru|chile|callao|arica|iquique|valparaiso|mexico|ecuador|quito|bolivia|venezuela|colombia|granada|antill|westindien|vestindien|haiti|jamaica|cuba|portorico|st\.? thomas|japan|china|kina|indien|java|sumatra|manila|filippin|persien|turkiet|konstantinopel|smyrna|syrien|antiochia|palestina|egypten|algier|afrika|italien|neapel|napoli|vesuvius|vesuv|etna|sicilien|messina|calabri|rom\b|toscana|florens|grekland|kefalonia|zante|patras|aten\b|korint|archipel|rhodus|kreta|candia|cypern|mytilene|chios|santorin|spanien|portugal|lissabon|setubal|frankrike|paris|schweiz|tyrol|österrike|wien|ungern|kroatien|agram|rumänien|ryssland|kaukasus|tiflis|schemacha|erzerum|tyskland|rhen|darmstadt|sachsen|leipzig|böhmen|island|reykjavik|hawaii|sandwich|australi|nya zeeland|zeeland|honolulu|ostindien|bengal|kalkutta|alaska|canada|newyork|new york|zürich|pompeji|herkulanum|bibl|forntid|geolog|vulkan|krater/i;
const FELT = /kändes|kändt|förmärktes|förmärkt|förspordes|iakttogs|märktes|förnummits|förnams|här i staden|härstädes|i staden|i trakten|i socknen|socken|församling|gården|på landet|i går|i förrgår|i lördags|i söndags|i måndags|i tisdags|i onsdags|i torsdags|i fredags|natten|aftonen|morgonen|klockan|kl\. ?\d|fönster|dörrar|husen skakade|dån|dunder|knall/i;
const rows: any[] = [];
for (const f of readdirSync(`${dir}/data/se`)) {
  const y = +f.match(/_(\d{4})\.jsonl$/)![1]; if (y < +fy || y > +ty) continue;
  for (const l of readFileSync(`${dir}/data/se/${f}`, "utf8").split("\n").filter(Boolean)) {
    const r = JSON.parse(l);
    const s = r.snippets.join(" ¦ ").replace(/<\/?em>/g, "");
    if (FOREIGN.test(s) && !ALL) continue;
    if (!FELT.test(s) && !ALL) continue;
    rows.push({ ...r, s, t: Date.UTC(+r.date.slice(0, 4), +r.date.slice(5, 7) - 1, +r.date.slice(8, 10)) / 864e5 });
  }
}
if (rows.length < 50) { console.error("harvest floor", rows.length); process.exit(1); }
// dedupe by id
const seen = new Set<string>(); const uniq = rows.filter((r) => !seen.has(r.id) && seen.add(r.id)).sort((a, b) => a.t - b.t);
// cluster: rows within 10 d of the cluster start
const cl: any[][] = [];
for (const r of uniq) { const c = cl.at(-1); if (c && r.t - c[0].t <= 10) c.push(r); else cl.push([r]); }
console.log(`kept ${uniq.length} rows, ${cl.length} clusters`);
for (const c of cl) {
  const papers = new Set(c.map((r) => r.place ?? r.title.replace(/ \d.*/, "")));
  const t0 = c[0].t, t1 = c.at(-1).t;
  const m = nordic.filter((e) => e.t !== null && e.t >= t0 - 45 && e.t <= t1);
  const yo = nordic.filter((e) => e.t === null && e.y === +c[0].date.slice(0, 4));
  console.log(`\n### ${c[0].date}..${c.at(-1).date} n=${c.length} towns=${papers.size} [${[...papers].join(",")}] ${m.length ? "FENCAT:" + m.map((e) => e.line.slice(0, 34).replace(/\s+/g, " ")).join(" | ") : "NOFENCAT"}${yo.length ? " YEARONLY:" + yo.map((e) => e.line.slice(0, 34).replace(/\s+/g, " ")).join("|") : ""}`);
  for (const r of c.slice(0, 6)) console.log(`  ${r.date} ${r.title.replace(/ \d{4}.*/, "")}: ${r.s.slice(0, 300)}`);
}
