// usage: bun dk.ts "<solr query>" [regex] [chars] [max]
const [q, re, chars, max] = [process.argv[2], process.argv[3], Number(process.argv[4] ?? 600), process.argv[5] ?? "200"];
const u = new URL("https://labs.statsbiblioteket.dk/labsapi/api/aviser/export/fields");
u.searchParams.set("query", q);
for (const f of ["link","recordID","timestamp","familyId","lplace","fulltext_org"]) u.searchParams.append("fields", f);
u.searchParams.set("max", max); u.searchParams.append("structure","content"); u.searchParams.set("format","JSON");
const r = await fetch(u, { signal: AbortSignal.timeout(120000) });
if (!r.ok) { console.error("HTTP", r.status); process.exit(1); }
const txt = await r.text(); let rows: any[];
try { rows = JSON.parse(txt); } catch { rows = txt.trim().split("\n").filter(Boolean).map(l => JSON.parse(l)); }
console.error(`rows=${rows.length}`);
const rx = re ? new RegExp(re, "i") : null;
for (const x of rows) {
  const t: string = (x.fulltext_org ?? "").replace(/\s+/g, " ");
  const m = rx ? t.search(rx) : 0; if (rx && m < 0) continue;
  console.log(`--- ${x.timestamp?.slice(0,10)} ${x.familyId} (${x.lplace}) ${x.link}\n${t.slice(Math.max(0, m - chars/2), m + chars/2)}`);
}
