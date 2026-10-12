// Crop the page-image region of the ALTO text block(s) matching a regex. usage: bun crop.ts <URN> <regex> <outPrefix>
// Prints the IIIF crop URL(s) (public, citable) and saves JPGs to /workspace/tmp.
const [urn, pat, out = "crop"] = process.argv.slice(2);
const re = new RegExp(pat, "i");
const j = await (await fetch(`https://api.nb.no/catalog/v1/items?q=${encodeURIComponent(urn)}&size=5`)).json();
const item = (j._embedded?.items ?? []).find((i: any) => i.metadata?.identifiers?.urn === urn);
if (!item) { console.error("no item"); process.exit(1); }
const man = await (await fetch(`https://api.nb.no/catalog/v1/iiif/${item.id}/manifest`)).json();
let n = 0;
for (const cv of man.sequences[0].canvases) {
  const pageUrn = String(cv["@id"]).split("/canvas/")[1];
  const xml = await (await fetch(`https://api.nb.no/catalog/v1/metadata/${item.id}/altos/${pageUrn}`)).text();
  const pw = Number(xml.match(/<Page[^>]*WIDTH="([\d.]+)"/)?.[1]);
  const info = await (await fetch(`https://www.nb.no/services/image/resolver/${pageUrn}/info.json`)).json();
  const k = info.width / pw;
  for (const b of xml.matchAll(/<TextBlock([^>]*)>([\s\S]*?)<\/TextBlock>/g)) {
    const txt = [...b[2].matchAll(/CONTENT="([^"]*)"/g)].map(m => m[1]).join(" ");
    if (!re.test(txt)) continue;
    const g = (a: string) => Number(b[1].match(new RegExp(`${a}="([\\d.]+)"`))?.[1]);
    const x = Math.max(0, Math.round(g("HPOS") * k) - 30), y = Math.max(0, Math.round(g("VPOS") * k) - 30);
    const w = Math.round(g("WIDTH") * k) + 60; let h = Math.round(g("HEIGHT") * k) + 60, yy = y;
    if (h > 1600) { // tall block: crop around the first matching line
      const ln = [...b[2].matchAll(/<TextLine([^>]*)>([\s\S]*?)<\/TextLine>/g)].find(l => re.test([...l[2].matchAll(/CONTENT="([^"]*)"/g)].map(m => m[1]).join(" ")));
      if (ln) { const v = Number(ln[1].match(/VPOS="([\d.]+)"/)?.[1]) * k; yy = Math.max(0, Math.round(v) - 350); h = 1100; }
    }
    const url = `https://www.nb.no/services/image/resolver/${pageUrn}/${x},${yy},${w},${h}/full/0/default.jpg`;
    const r = await fetch(url); const f = `/workspace/tmp/${out}-${++n}.jpg`;
    await Bun.write(f, await r.arrayBuffer());
    console.log(`${r.status} ${f}\n${url}\n${txt.slice(0, 160)}`);
  }
}
if (!n) { console.error("0 blocks"); process.exit(1); }
