// Harvest paragraph-level concordances from the National Library of Norway (DH-lab API)
// usage: bun harvest.ts <fromYear> <toYear> <query> <out.jsonl>
import { appendFileSync, existsSync, readFileSync } from "fs";

const [from, to, query, out] = [Number(process.argv[2]), Number(process.argv[3]), process.argv[4], process.argv[5]];
if (!from || !to || !query || !out) { console.error("usage: bun harvest.ts <from> <to> <query> <out.jsonl>"); process.exit(2); }
const API = "https://api.nb.no/dhlab";

async function post(path: string, body: unknown, tries = 8): Promise<any> {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(API + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(180_000) });
      if (r.ok) return await r.json();
      console.error(`HTTP ${r.status} ${path} try ${i}`);
    } catch (e) { console.error(`ERR ${path} try ${i}: ${e}`); }
    await Bun.sleep(15000 * (i + 1));
  }
  throw new Error(`failed ${path}`);
}

const done = new Set<number>();
if (existsSync(out)) for (const l of readFileSync(out, "utf8").split("\n")) if (l) { try { done.add(JSON.parse(l).year); } catch {} }

let total = 0;
for (let y = from; y <= to; y++) {
  if (done.has(y)) { console.error(`skip ${y}`); continue; }
  const c = await post("/build_corpus", { doctype: "digavis", fulltext: query, from_year: y, to_year: y + 1, limit: 20000 });
  const keys = Object.keys(c.urn ?? {}).filter(k => Math.floor(Number(c.timestamp[k]) / 10000) === y);
  const docs = keys.map(k => ({ dhlabid: c.dhlabid[k], urn: c.urn[k], title: c.title[k], city: c.city[k], ts: c.timestamp[k] }));
  const byId = new Map(docs.map(d => [d.dhlabid, d]));
  let n = 0;
  for (let i = 0; i < docs.length; i += 150) {
    const ids = docs.slice(i, i + 150).map(d => d.dhlabid);
    const r = await post("/conc", { dhlabids: ids, query, window: 1000, limit: 100000, html_formatting: false });
    for (const k of Object.keys(r.conc ?? {})) {
      const d = byId.get(r.docid[k]);
      appendFileSync(out, JSON.stringify({ year: y, ...d, conc: r.conc[k] }) + "\n");
      n++;
    }
  }
  if (docs.length && n === 0) console.error(`WARN ${y}: ${docs.length} docs but 0 conc rows`);
  total += n;
  console.error(`${y}: docs=${docs.length} conc=${n}`);
}
console.error(`TOTAL conc=${total}`);
