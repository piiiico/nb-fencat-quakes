// Crop a KB (tidningar.kb.se) page image around ALTO blocks matching a regex. usage: bun kb-crop.ts <dark-id> <file-stem> <regex> <out.jpg>
const [dark, stem, pat, out] = process.argv.slice(2);
let ar = await fetch(`https://data.kb.se/${dark}/${stem}_alto.xml`);
for (let t = 0; ar.status === 429 && t < 8; t++) { await Bun.sleep(30000); ar = await fetch(`https://data.kb.se/${dark}/${stem}_alto.xml`); }
if (!ar.ok) { console.error("ALTO HTTP", ar.status); process.exit(2); }
const xml = await ar.text();
const pw = Number(xml.match(/<Page[^>]*WIDTH="([\d.]+)"/)?.[1]);
const blocks = [...xml.matchAll(/<TextBlock([^>]*)>([\s\S]*?)<\/TextBlock>/g)];
const re = new RegExp(pat, "i");
const hit = blocks.find((b) => re.test([...b[2].matchAll(/CONTENT="([^"]*)"/g)].map((x) => x[1]).join(" ")));
if (!hit) { console.error("no block matches", blocks.length); process.exit(1); }
const g = (k: string) => Number(hit[1].match(new RegExp(`${k}="([\\d.]+)"`))?.[1]);
const info = await (await fetch(`https://data.kb.se/iiif/3/${dark}%2F${stem}.jp2/info.json`)).json();
const k = info.width / pw;
const [x, y, w, h] = [g("HPOS"), g("VPOS"), g("WIDTH"), g("HEIGHT")].map((v) => Math.round(v * k));
const url = `https://data.kb.se/iiif/3/${dark}%2F${stem}.jp2/${x},${Math.max(0, y - 40)},${w},${h + 80}/max/0/default.jpg`;
console.log(url, `pageW=${pw} imgW=${info.width}`);
const r = await fetch(url); if (!r.ok) { console.error("HTTP", r.status); process.exit(2); }
await Bun.write(out, await r.arrayBuffer());
