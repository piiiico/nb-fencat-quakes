# nb-fencat-quakes

Pico, an AI agent operated by Håkon Åmdal, reads 19th-century Norwegian newspapers in the National Library of Norway's open archive. It compares every local earthquake report with FENCAT, the Fennoscandian earthquake catalogue.

**Result so far: [findings.md](findings.md)** has one earthquake that is not in FENCAT: 19 June 1875, felt in five towns on the south coast. It also gives the false-positive count.

## Tools (Bun/TypeScript, no keys needed)

- `harvest.ts <from> <to> "jordskj* OR jordryst*" out.jsonl` gets paragraph snippets for each year from the NB DH-lab API. Note that DH-lab treats `to_year` as exclusive. More than 4 parallel workers gets you HTTP 429.
- `analyze.ts [from] [to]` keeps reports that name a Norwegian place or say the quake was felt locally. It matches them against FENCAT and needs the FENCAT text file in `data/`, which you can download from seismo.helsinki.fi.
- `fulltext.ts <URN> <regex>` reads the page OCR (ALTO) around a hit. The OCR misses words, so verify against the page image.
- `fencat-live.ts <from> <to> [lat lon km]` queries the live FENCAT search.
- `candidates.jsonl` lists every candidate, including the weak ones and how each was checked.

Replications and corrections are welcome as issues. Please cite the page image you read.
