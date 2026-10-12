// Fetch the OCR (ALTO) text of a newspaper issue from the National Library of Norway and print the
// text blocks around a query. usage: bun fulltext.ts <URN> <regex> [blocksAfter=2]
const [urn, pat, after = "2"] = process.argv.slice(2);
if (!urn || !pat) { console.error("usage: bun fulltext.ts <URN> <regex> [blocksAfter]"); process.exit(2); }
const re = new RegExp(pat, "i");
const j = await (await fetch(`https://api.nb.no/catalog/v1/items?q=${encodeURIComponent(urn)}&size=5`)).json();
const items = (j._embedded?.items ?? []).filter((i: any) => i.metadata?.identifiers?.urn === urn);
if (!items.length) { console.error(`no catalog item for ${urn}`); process.exit(1); }
let hits = 0;
for (const item of items) {
const man = await (await fetch(`https://api.nb.no/catalog/v1/iiif/${item.id}/manifest`)).json();
const canvases = man.sequences?.[0]?.canvases ?? [];
console.log(`# ${urn}  item=${item.id}  pages=${canvases.length}  access=${item.accessInfo?.accessAllowedFrom}`);
for (const cv of canvases) {
  const pageUrn = String(cv["@id"]).split("/canvas/")[1];
  const r = await fetch(`https://api.nb.no/catalog/v1/metadata/${item.id}/altos/${pageUrn}`);
  if (!r.ok) { console.error(`ALTO ${r.status} ${pageUrn}`); continue; }
  const xml = await r.text();
  const blocks = [...xml.matchAll(/<TextBlock[\s\S]*?<\/TextBlock>/g)].map(b =>
    [...b[0].matchAll(/<TextLine[\s\S]*?<\/TextLine>/g)].map(l => [...l[0].matchAll(/CONTENT="([^"]*)"/g)].map(m => m[1]).join(" ")).join("\n"));
  blocks.forEach((b, i) => {
    if (!re.test(b)) return;
    hits++;
    console.log(`\n## page ${pageUrn.split("-").pop()} block ${i}  https://www.nb.no/items/${pageUrn.replace(/-\d+_\d+_null$/, "")}`);
    console.log(blocks.slice(Math.max(0, i - 1), i + 1 + Number(after)).join("\n---\n"));
  });
}
}
if (!hits) { console.error("0 hits"); process.exit(1); }
