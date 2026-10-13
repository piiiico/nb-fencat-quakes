// SE snippet harvest (no ALTO -> no 429): data.kb.se search, paginated by offset, per word per year.
// usage: bun se-harvest.ts <fromYear> <toYear(incl)> [words comma-sep]
// out: data/se/<word>_<year>.jsonl (one row per hit: date,title,place,id,img,snippets). Resumes: skips files present.
// Floor: exits 1 if a page returns fewer hits than total implies (truncated), or HTTP error after retries.
import { existsSync, mkdirSync, writeFileSync } from "fs";
const [fy, ty, ws = "jordskalf*,jordstöt*,jordbäfning*,jordskakning*"] = process.argv.slice(2);
mkdirSync(`${import.meta.dir}/data/se`, { recursive: true });
const get = async (u: URL) => {
  for (let i = 0; i < 8; i++) {
    const r = await fetch(u, { headers: { Accept: "application/json" } });
    if (r.ok) return r.json();
    console.error("HTTP", r.status, "retry"); await Bun.sleep(30000);
  }
  throw new Error("HTTP fail " + u);
};
for (let y = +fy; y <= +ty; y++) for (const w of ws.split(",")) {
  const f = `${import.meta.dir}/data/se/${w.replace("*", "")}_${y}.jsonl`;
  if (existsSync(f)) continue;
  const rows: any[] = []; let total = 0;
  for (let off = 0; ; off += 100) {
    const u = new URL("https://data.kb.se/search");
    for (const [k, v] of Object.entries({ q: w, from: `${y}-01-01`, to: `${y}-12-31`, searchGranularity: "part", limit: "100", offset: String(off) })) u.searchParams.set(k, v);
    const j: any = await get(u);
    total = j.total;
    for (const h of j.hits ?? []) rows.push({ date: h.datePublished, title: h.title, place: h.isIssueOfEdition?.manufacture?.place?.label ?? null, id: h["@id"], img: h.imageServiceId, snippets: h.snippets ?? [] });
    if (!j.hits?.length || rows.length >= total) break;
  }
  if (rows.length < total) { console.error(`TRUNCATED ${w} ${y}: ${rows.length}/${total}`); process.exit(1); }
  writeFileSync(f, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
  console.log(`${w} ${y}: ${rows.length}/${total}`);
}
