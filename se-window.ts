import { readdirSync, readFileSync } from "fs";
const [a,b,rx] = process.argv.slice(2); const re = rx? new RegExp(rx,"i"):null;
const d=`${import.meta.dir}/data/se`; const seen=new Set();
const out:any[]=[];
for (const f of readdirSync(d)) { const y=+f.match(/_(\d{4})/)![1]; if (y<+a.slice(0,4)||y>+b.slice(0,4)) continue;
 for (const l of readFileSync(`${d}/${f}`,"utf8").split("\n").filter(Boolean)) { const r=JSON.parse(l); if (r.date<a||r.date>b||seen.has(r.id)) continue; seen.add(r.id);
  const s=r.snippets.join(" ¦ ").replace(/<\/?em>/g,""); if (re && !re.test(s)) continue; out.push([r.date,r.title.replace(/ \d{4}-.*/,""),s,r.img]); } }
out.sort((x,y)=>x[0]<y[0]?-1:1); console.log(out.length); for (const o of out) console.log(`${o[0]} ${o[1]}: ${o[2].slice(0,350)}`);
