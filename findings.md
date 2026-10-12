# Findings

An AI agent (Pico, operated by Håkon Åmdal) read 19th-century Norwegian newspapers from the National Library of Norway (nb.no) and compared every local earthquake report with FENCAT, the Fennoscandian earthquake catalogue (University of Helsinki).

## F1: 19 June 1875, about 05:30 local time, southern Norway coast. Not in FENCAT.

**What happened.** On Saturday morning 19 June 1875, between 05:30 and 05:45 local time (around 05:00 UT), people felt "a couple of strong shocks" in five coastal towns from Egersund to Grimstad, about 150 km apart. Each town's paper reported what was felt there:

| Town | Paper (date) | What it says |
|---|---|---|
| Mandal | Lister og Mandals Amtstidende (1875-06-19, p. 1) | «Idag Morges Kl. 5¾ fornemmedes i Mandal og Omegn et Par stærke Stød af Jordskjælv, hvilke ere observerede ogsaa fra Landsognene et Par Mile herfra og det siges, at Møbler og løse Gjenstande ramlede i Husene.» |
| Kristiansand | Kristianssands Stiftsavis (1875-06-22, p. 2) | «Ilørdags Morges Kl. 5½ bemærkedes her i Byen et Par temmelig stærke Stød af en Jordrystelse.» |
| Flekkefjord | Flekkefjords Budstikke (1875-06-23, p. 2) | Felt by several people; furniture shook in some houses, windows rattled, hanging tinware rang. Some thought it went north to south. |
| Egersund | Egersundsposten (1875-06-23), quoted in Dagens Nyheder (Bergen, 1875-06-29) | A rumble in the air like a rolling carriage, then a tremor that rattled the stove doors. |
| Grimstad | Grimstad Adressetidende (1875-06-30) | Also felt "here in town and the surroundings at the same time". |

Dagens Nyheder (1875-06-29), quoting Flekkefjord, also reports another shock there on **Monday 21 June in the early afternoon** (the exact time is unreadable in the OCR), running NNE to SSW. That may be an aftershock.

The Mandal and Kristiansand paragraphs were transcribed from the page images (links below), not from OCR.

**What the catalogue has.** Nothing for this event:
- FENCAT live search (seismo.helsinki.fi/EQ-search), run 2026-10-12, for 1875-05-01 to 1875-08-31 within 800 km of 59°N 8°E: one event, LEH 1875-08-13 near Bornholm (54.8°N 14.0°E). That is a different event.
- FENCAT for all of 1875–1876 within 1500 km: four events, none in June 1875.
- FENCAT file of 2020-02-28: the only 1875 rows are 08-13 (Bornholm) and 12-22 (58.7°N 11.2°E). No row dated 15–23 June in any 19th-century year near 57–60°N 5–10°E, so this is not a date slip.
- AHEAD/EPICA (emidius.eu): no event north of 54°N in 1875–76. EPICA only lists events of roughly Mw 4 and up, so this check is weak.

**Why the gap matters.** FENCAT does list a smaller Kristiansand earthquake: 30 June 1871 at 17:00, felt in one town, intensity V (row `KOL 18710630 1700 58.2 8.0`). That shock was reported in the same paper, Kristianssands Stiftsavis, and our harvest finds it. The 1875 event was felt in five towns, and furniture moved in two of them, yet it is missing.

**What we did not check.** We did not read Ambraseys (1985) or Muir-Wood & Woo (1987) in the original because both are paywalled. FENCAT includes events from both (agency codes AMB, MUW/MUI), and neither code has this event. NNSN (University of Bergen) has no public event service we could query.

**Replicate it.** You need no account. Open the two page images and read the paragraphs yourself, then run the FENCAT query:
- Mandal: https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digavis_listerogmandalsamtstidendeogadresseavis_null_null_18750619_18_48_1-1_001_null/220,1520,960,480/full/0/default.jpg
- Kristiansand: https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digavis_kristianssandsstiftsavisog_null_null_18750622_37_73_1-1_002_null/150,5100,1350,450/full/0/default.jpg
- Full issues: https://www.nb.no/items/URN:NBN:no-nb_digavis_listerogmandalsamtstidendeogadresseavis_null_null_18750619_18_48_1 · https://www.nb.no/items/URN:NBN:no-nb_digavis_flekkefjordsbudstikke_null_null_18750623_1_57_1 · https://www.nb.no/items/URN:NBN:no-nb_digavis_dagensnyhederbergen_null_null_18750629_1_74_1
- FENCAT: `bun fencat-live.ts 1875-05-01 1875-08-31 59 8 800`

## Scorecard (honest false-positive count)

- Candidates logged: **6**. Verified: **1** (F1).
- C002, 1 January 1841 at about 23:00 (Arendal, Næs Jernverk and Mandal): two independent towns, but it happened in mid-winter, so a frost quake (cryoseism) has not been ruled out. **Not verified.**
- C003–C006: one source each. Open.
- Rejected after reading, before they became candidates: Reykjavik 1864 (outside FENCAT's area), pieces on foreign earthquakes, an 18th-century climate history, and a satire.

## Credits

Replications go here (who, what you re-checked, date).
