// Swedish newspapers (KB, tidningar.kb.se) via data.kb.se search + page ALTO.
// usage: bun kb-se.ts "<word>" <from YYYY-MM-DD> <to> [regexForContext] [chars=600]
// Prints, per hit page: date | title | ALTO context around regex (default = the word stem).
// Floor: exits 2 on HTTP error; prints "ALTO-MISS" (never silent) when the page text lacks the regex.
const [q, from, to, rx, nStr = "600"] = process.argv.slice(2);
const N = +nStr;
const re = new RegExp(rx ?? q.slice(0, 7), "gi");
const u = new URL("https://data.kb.se/search");
for (const [k, v] of Object.entries({ q, from, to, searchGranularity: "part", limit: "100" })) u.searchParams.set(k, v);
const r = await fetch(u, { headers: { Accept: "application/json" } });
if (!r.ok) { console.error("HTTP", r.status); process.exit(2); }
const j: any = await r.json();
console.log(`total ${j.total} (q=${q} ${from}..${to})`);
for (const h of j.hits ?? []) {
  const img: string = h.imageServiceId ?? "";
  const m = img.match(/iiif\/3\/(dark-\d+)%2F(.+)\.jp2$/);
  let ctx = "";
  if (m) {
    const ar = await fetch(`https://data.kb.se/${m[1]}/${m[2]}_alto.xml`);
    if (ar.ok) {
      const xml = await ar.text();
      const words = [...xml.matchAll(/<String[^>]*CONTENT="([^"]*)"/g)].map((x) => x[1]);
      const text = words.join(" ").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&apos;/g, "'");
      const out: string[] = [];
      for (const mm of text.matchAll(re)) out.push(text.slice(Math.max(0, mm.index! - N / 2), mm.index! + N / 2));
      ctx = out.length ? out.join("\n   ¦ ") : "ALTO-MISS: " + (h.snippets ?? []).join(" ¦ ");
    } else ctx = `ALTO HTTP ${ar.status}: ` + (h.snippets ?? []).join(" ¦ ");
  } else ctx = "NO-IMAGE-ID: " + (h.snippets ?? []).join(" ¦ ");
  console.log(`\n## ${h.datePublished} | ${h.title} | ${img.replace("/iiif/3/", "/iiif/3/")}\n   ${ctx}`);
}
