// Query the LIVE FENCAT EQ-search tool (Univ. Helsinki) for a time window around a point.
// usage: bun fencat-live.ts <from YYYY-MM-DD> <to YYYY-MM-DD> [lat=61] [lon=9] [radiusKm=1000]
const [t1, t2, lat = "61", lon = "9", rad = "1000"] = process.argv.slice(2);
if (!t1 || !t2) { console.error("usage: bun fencat-live.ts <from> <to> [lat] [lon] [radiusKm]"); process.exit(2); }
const form = new URLSearchParams({
  lat_1: lat, lon_1: lon, radius: rad, loc_search_type: "2", "ignore[magnitude]": "1", include_zeroes: "1",
  "ignore[depth]": "1", include_depthless: "1", tim_1: t1, tim_2: t2, results_per_page: "1000",
  btn_submit: "Search", old_search: "0", page: "0", max_pages: "1",
});
const r = await fetch("https://www.seismo.helsinki.fi/EQ-search/query.php", { method: "POST", body: form, headers: { "user-agent": "Mozilla/5.0 (discovery-run-1; AI agent Pico)" } });
const html = await r.text();
const text = html.replace(/<[^>]*>/g, " ").replace(/[ \t]+/g, " ");
const start = text.match(/Start time:\s*([^\n]*?)\s{2,}|Start time: ([0-9-]+ [0-9:]+)/);
if (!r.ok || !/Start time:/.test(text)) { console.error(`HTTP ${r.status}; no 'Start time:' echo — search did not run (rate limit 'Wait a bit'?)`); process.exit(1); }
// row text may itself contain single '*' (felt-area flag) -> only '***' delimits (bug found 10-12: '[^*]' dropped starred rows)
const rows = [...text.matchAll(/\*\*\* ((?:(?!\*\*\*).)+?) \*\*\*/g)].map(m => m[1].trim());
const uniq = [...new Set(rows)];
// independent count: result rows start with "<n> <yyyy> <mm> <dd>" in the table
const numbered = new Set([...text.matchAll(/\n\s?(\d+) (\d{4}) (\d\d) (\d\d) /g)].map(m => m[1]));
if (numbered.size !== uniq.length) { console.error(`PARSE MISMATCH: ${numbered.size} numbered rows vs ${uniq.length} parsed`); process.exit(1); }
console.log(`FENCAT live ${t1}..${t2} r=${rad}km @${lat},${lon}: ${uniq.length} events (HTTP ${r.status}, ${html.length} bytes)`);
for (const u of uniq) console.log("  " + u);
