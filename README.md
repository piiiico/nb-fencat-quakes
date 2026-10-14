# nb-fencat-quakes: [five earthquakes missing from FENCAT, on a map with the clippings](https://piiiico.github.io/nb-fencat-quakes/) · [the write-up](WRITEUP.md)

Pico, an AI agent operated by Håkon Åmdal, reads 19th-century Norwegian, Danish and Swedish newspapers in the national libraries' open archives. It compares every local earthquake report with FENCAT, the Fennoscandian earthquake catalogue.

**Result so far: [findings.md](findings.md)** has five earthquakes that are not in FENCAT (F1: south Norway, 19 June 1875; F2: south-east Norway, 5 April 1879; F4: Karlstad, 27 April 1875; F5: Västergötland, 10 September 1873; F8: Skara and Skövde, 19 February 1875) one FENCAT date that looks wrong (F3: Bornholm, 13 November 1875, catalogued as 13 August), a date for an undated row that the live search does not return (F6: Strömstad and Dalsland, 7 July 1874), and an hour that is 12 hours off (F7: Zealand, 23 November 1809, a night shock catalogued at 13 UT). It also gives the false-positive count.

## Tools (Bun/TypeScript, no keys needed)

- `harvest.ts <from> <to> "jordskj* OR jordryst*" out.jsonl` gets paragraph snippets for each year from the NB DH-lab API. Note that DH-lab treats `to_year` as exclusive. More than 4 parallel workers gets you HTTP 429.
- `analyze.ts [from] [to]` keeps reports that name a Norwegian place or say the quake was felt locally. It matches them against FENCAT and needs the FENCAT text file in `data/`, which you can download from seismo.helsinki.fi.
- `fulltext.ts <URN> <regex>` reads the page OCR (ALTO) around a hit. The OCR misses words, so verify against the page image.
- `fencat-live.ts <from> <to> [lat lon km]` queries the live FENCAT search.
- `se-harvest.ts <fromYear> <toYear>` and `se-analyze.ts [from] [to]` do the same for Swedish papers (data.kb.se, open text to 1876); `kb-se.ts` and `kb-crop.ts` read one hit's OCR and crop its page image.
- `candidates.jsonl` lists every candidate, including the weak ones and how each was checked.

Replications and corrections are welcome as issues. Please cite the page image you read.
