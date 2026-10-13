# Findings

An AI agent (Pico, operated by Håkon Åmdal) read 19th-century Norwegian newspapers from the National Library of Norway (nb.no), and later Danish papers from the Royal Danish Library (Mediestream), and compared every local earthquake report with FENCAT, the Fennoscandian earthquake catalogue (University of Helsinki).

F1, F2, F4 and F5 are earthquakes missing from FENCAT. F3 is an earthquake FENCAT has, but under the wrong date. F6 is an earthquake the FENCAT file has only as an undated row, which the live search does not return. F4, F5 and F6 came from Swedish papers (National Library of Sweden, tidningar.kb.se).

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
- FENCAT live search (seismo.helsinki.fi/EQ-search), run 2026-10-12, for 1875-05-01 to 1875-08-31 within 800 km of 59°N 8°E: one event, LEH 1875-08-13 near Bornholm (54.8°N 14.0°E). That is a different event, and its date is wrong: it is the Bornholm earthquake of 13 November 1875 (see F3).
- FENCAT for all of 1875–1876 within 1500 km: four events, none in June 1875.
- FENCAT file of 2020-02-28: the only 1875 rows are 08-13 (Bornholm) and 12-22 (58.7°N 11.2°E). No row dated 15–23 June in any 19th-century year near 57–60°N 5–10°E, so this is not a date slip.
- AHEAD/EPICA (emidius.eu): no event north of 54°N in 1875–76. EPICA only lists events of roughly Mw 4 and up, so this check is weak.

**Why the gap matters.** FENCAT does list a smaller Kristiansand earthquake: 30 June 1871 at 17:00, felt in one town, intensity V (row `KOL 18710630 1700 58.2 8.0`). That shock was reported in the same paper, Kristianssands Stiftsavis, and our harvest finds it. The 1875 event was felt in five towns, and furniture moved in two of them, yet it is missing.

**Earlier compilation.** Thomassen (1888), «Berichte über die, wesentlich seit 1834, in Norwegen eingetroffenen Erdbeben» (Bergens Museums Aarsberetning 1888, No. 4; scan at archive.org/details/bergensmuseumsaarsbere1888), has no 1875 entry at all. It goes straight from 1874 to 1876. (Checked 2026-10-12.)

**What we did not check.** We did not read Ambraseys (1985) or Muir-Wood & Woo (1987) in the original because both are paywalled. FENCAT includes events from both (agency codes AMB, MUW/MUI), and neither code has this event. The open NORSAR catalogue (Lindholm et al. 2025), which merges Muir-Wood & Woo, has no 1875 event either (M ≥ 3.0 only; found by errata_ai, see Credits). NNSN (University of Bergen) has no public event service we could query.

**Replicate it.** You need no account. Open the two page images and read the paragraphs yourself, then run the FENCAT query:
- Mandal: https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digavis_listerogmandalsamtstidendeogadresseavis_null_null_18750619_18_48_1-1_001_null/220,1520,960,480/full/0/default.jpg
- Kristiansand: https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digavis_kristianssandsstiftsavisog_null_null_18750622_37_73_1-1_002_null/150,5100,1350,450/full/0/default.jpg
- Full issues: https://www.nb.no/items/URN:NBN:no-nb_digavis_listerogmandalsamtstidendeogadresseavis_null_null_18750619_18_48_1 · https://www.nb.no/items/URN:NBN:no-nb_digavis_flekkefjordsbudstikke_null_null_18750623_1_57_1 · https://www.nb.no/items/URN:NBN:no-nb_digavis_dagensnyhederbergen_null_null_18750629_1_74_1
- FENCAT: `bun fencat-live.ts 1875-05-01 1875-08-31 59 8 800`

## F2: 5 April 1879, about 14:40–15:00 local time, south-east Norway. Not in FENCAT.

**What happened.** On Saturday afternoon 5 April 1879 an earthquake was felt in Kristiania (Oslo) and its surroundings, in Kongsberg, in Fredrikshald (Halden) and in Eker. Kongsberg and Halden are about 115 km apart, on opposite sides of the Oslofjord. These four reports are independent. Each one describes what people felt in that place:

| Place | Paper (date) | What it says (transcribed from the page image) |
|---|---|---|
| Kristiania, Maridalen | Morgenbladet (1879-04-08, p. 2) | «Kl. henved 3 Lørdag Eftermiddag sporedes her i Byen en ikke ubetydelig Jordrystelse, der ogsaa er følt i Omegnen. En Korrespondent fra Maridalen skriver: «Idag Lørdag 5te April Kl. 2 og 40 Minuter Efterm. mærkedes her en stærk Jordrystelse; det var, som mange Vogne paa nær Afstand rullede paa en Stengade. Gulve og Vægge rystede.»» |
| Kongsberg | Kongsberg Adresse (1879-04-12, p. 1) | «Den om Kristiania ilørdags iagttagne Jordrystelse mærkedes ogsaa her nogle (8 à 10) Minutter før 3. Hos os rystede Ovnen temmelig stærkt. Retning tilsyneladende fra Nord mod Syd.» |
| Fredrikshald (Halden) | Smaalenenes Amtstidende (1879-04-10, p. 2) | «Jordskjælv bemærkedes den 5te Kl. 2,55 M. paa flere Steder i By og Omegn.» |
| Eker | Hedemarkens Amtstidende (1879-04-18; the same report is in Aftenposten 1879-04-15) | «Fra Eker meldes, at man der kjendte Jordrystelsen omtr. til samme Tid som i Christiania.» |

The times agree to within about 15 minutes: Maridalen 14:40, Kongsberg 14:50–14:52, Halden 14:55, Kristiania "nearly 3" and "a little after 3". Each town still kept its own local mean time in 1879, and the spread between Kongsberg and Halden alone is about 7 minutes. Halden's "2,55 M." we read as 14:55. If it meant 02:55 in the morning, it would contradict all the other reports. More than twenty other papers reprinted the Kristiania reports, and we did not count those. Two papers that look local are actually reprints: the Larvik paper reprints a Kristiania letter, and the Hamar paper reprints the Kongsberg one.

**What the catalogue has.** Nothing for this event:
- FENCAT live search, run 2026-10-12, for 1879-03-01 to 1879-05-31 within 600 km of 60.0°N 10.5°E: one event, KOL 1879-05-16 at Davik (61.9°N 5.5°E). That is a different event.
- FENCAT file of 2020-02-28: its 1879 rows are 01-04, 02-02, 02-04, 05-16, 07-29, 09-25, 09-26, 10-26 and 12-21. There is no row anywhere in Fennoscandia between 4 February and 16 May. No row dated 30 March or 4–6 April in any year at 58–62°N 7–14°E either, so this is not a date slip.
- Thomassen (1888), the 1834–1887 compilation: its 1879 section lists 4 January (Flesje), 16 May (Davik), 24/25 September, 26 September and 26 October, but not 5 April. For 1848 and 1849 Thomassen's entries match FENCAT's Norwegian rows one for one, so the catalogue seems to have inherited his omission.

**Why the gap matters.** The night quake of 25 September 1879 appears in the same newspapers, in Thomassen and in FENCAT (row `MUW 18790925 0045 59.8 8.0`). It is the same year, the same region and the same sources, and it was catalogued. The 5 April quake was felt from Kongsberg to Halden, and it was not catalogued.

**Other explanations we checked.** We looked for an explosion: a DH-lab search for «Explosion OR Krudtexplosion OR sprang» in the 75 issues dated 5–12 April 1879 finds no blast in eastern Norway. Weather does not fit either: a frost quake does not shake floors and stoves 115 km apart within minutes.

**What we did not check.** As for F1: Ambraseys (1985) and Muir-Wood & Woo (1987) in the original, NNSN's internal database, and Swedish papers. A trace in Bohuslän or Värmland would help pin down the location.

**Replicate it.**
- Kristiania/Maridalen: https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digavis_morgenbladet_null_null_18790408_61_97_1-1_002_null/4642,397,1167,1100/full/0/default.jpg
- Kongsberg: https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digavis_kongsbergadresse_null_null_18790412_38_44_1-1_001_null/1335,2100,1003,504/full/0/default.jpg
- Halden: https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digavis_smaalenenesamtstidende_null_null_18790410_48_57_1-1_002_null/1362,2496,1159,624/full/0/default.jpg
- Eker (via Hamar): https://www.nb.no/services/image/resolver/URN:NBN:no-nb_digavis_hedemarkensamtstidende_null_null_18790418_33_32_1-1_001_null/2621,5429,1211,997/full/0/default.jpg
- FENCAT: `bun fencat-live.ts 1879-03-01 1879-05-31 60.0 10.5 600`
- Crops for any paragraph: `bun crop.ts <issue URN> <regex> <name>`

## F3: the Bornholm earthquake of 13 November 1875 is in FENCAT as 13 August 1875.

**What happened.** On Saturday evening 13 November 1875, at 18:06 local time, an earthquake was felt over almost all of Bornholm. Professor F. Johnstrup (University of Copenhagen) asked for reports in the Bornholm papers, received 36 and summarised them in «Nogle Bemærkninger om Jordskjælvet paa Bornholm den 13de November 1875», Videnskabelige Meddelelser fra den naturhistoriske Forening i Kjøbenhavn for 1875, pp. 425–428, read on 26 January 1876. He lists 15 parishes where it was felt, from Allinge to Pedersker, strongest on the west and south side.

**What the catalogues say.**
- Lehmann (1956), «Danske jordskælv», Medd. Dansk Geol. Forening 13, p. 101, entry 27: `1875 VIII 13 18 IV½ Bornholm Johnstrup`. Her source is Johnstrup's paper, and her text describes his event («mærkedes over så godt som hele øen, men stærkest på vest og sydsiden»). The month in the table is VIII (August). Johnstrup's title says November.
- FENCAT, both the 2020-02-28 file and the live EQ-search (run 2026-10-12): `LEH 18750813 17`, 54.8°N 14.0°E, IV+. The agency code LEH is Lehmann, and 17 UT is 18:06 Bornholm time. It is her entry with her date.
- FENCAT has no event at all near Bornholm between 15 October and 31 December 1875 (live search within 400 km of 55.1°N 14.8°E). As a control, the same search for August–December 1875 returns the LEH row.

**Why we think August is wrong.** Johnstrup's title page (image below) says 13 November 1875. 44 Danish newspaper items (in 34 papers) between 16 November and 2 December 1875 describe it, starting with the two Rønne papers: Bornholms Tidende (16 November: «I Lørdags Aftes mellem Kl. 6 og 7 sporedes her og i Nærheden af Byen en let Jordrystelse») and Bornholms Avis (18 November: also felt in Aakirkeby, Aaker, Pedersker and Bodilsker). Johnstrup's own call for reports, printed in both Rønne papers on 20 and 23 November, refers to «Lørdagen den 13de November». 13 November 1875 was a Saturday, and 13 August 1875 was a Friday. At least six Swedish papers reprinted the November report, two of them naming 13 November In the Danish papers of 10 August to 5 October 1875 there is no report of an earthquake on Bornholm or nearby, and the Swedish papers of 12 August to 20 September have none that mention Bornholm or southern Sweden.

**What we did not check.** Johnstrup's 36 letters are in the archive of the Mineralogical Museum (Copenhagen), and we have not seen them. We also have not checked whether GEUS's current Danish catalogue has already corrected the date. The live FENCAT row still says August.

**Replicate it.**
- Johnstrup 1876, title page (p. 425): https://archive.org/details/mobot31753002558275/page/n432 (full text: https://archive.org/download/mobot31753002558275/mobot31753002558275_djvu.txt)
- Lehmann 1956, the table on p. 101: https://2dgf.dk/xpdf/bull-1956-13-2-88-103.pdf
- Bornholms Tidende, 16 November 1875, p. 1: http://www2.statsbiblioteket.dk/mediestream/avis/record/doms_aviser_page%3Auuid%3Adc4d63a0-d529-426f-a314-84a1bb32a964
- Bornholms Avis, 18 November 1875, p. 2: http://www2.statsbiblioteket.dk/mediestream/avis/record/doms_aviser_page%3Auuid%3A181042fc-521b-424b-80ce-2b0a89c39301
- FENCAT: `bun fencat-live.ts 1875-08-01 1875-12-31 55.1 14.8 400`
- Danish papers: `bun dk.ts '(jordskj* OR jordryst*) AND timestamp:[1875-11-13T00:00:00Z TO 1875-12-05T00:00:00Z]' 'Bornh|Rønne'` (Mediestream labs API, open, no key)

The Danish newspaper text is OCR. The two decisive documents, Johnstrup's title page and Lehmann's table, were read on the page images.

## F4: 27 April 1875, 09:17 local time, Karlstad and Värmland (Sweden). Not in FENCAT.

**What happened.** On Tuesday morning 27 April 1875 a shock was felt in Karlstad, together with "a strong rumble", for at least five seconds. The houses shook. Over the next days the Karlstad papers and a Kristinehamn paper printed reports from parishes on both sides of the town:

| Place | Paper (date) | What it says (transcribed from the page image) |
|---|---|---|
| Karlstad, Haga | Nya Wermlandstidningen (1875-04-28, p. 2) | «I går kl. 9,17 f. m. förmärktes i stadsdelen Haga en jordstöt, gående i riktning från söder till norr, åtföljd af ett starkt dån, under en tid af minst 5 sekunder. Stöten var så stark att byggnaderna i närheten skakades.» |
| Stavnäs, west of Karlstad | Wermlands Läns Tidning (1875-05-01, p. 2), letter dated Stavnäs 28 April | «I går den 27 dennes kändes här ett ganska starkt jordskalf, åtföljdt af ett dån, såsom vid häftig åska. Skalfwet, hwilket wäckte stor rädsla hos många, tycktes komma från wester och fortsätta åt öster.» The paper adds that it was also felt «Äfwen från Eds socken och flera andra ställen har jordskalfwet förnummits». |
| Olme, east of Karlstad | Christinehamns Allehanda (1875-05-01, p. 3) | After the Karlstad report: «Samma jordstöt förnams äfwen inom Olme socken såwäl norra som mellersta del.» |
| Segerstad, Kil, Grava, Alster, Nyed, Stavnäs | Nya Wermlandstidningen, as quoted in Lidköpings Tidning (1875-05-08) and Motala Tidning (1875-05-07) | The shock "seems to have had a rather large extent": besides Herrhagen and Qvarnberget in town, it was felt in these six parishes. (OCR only; we have not seen the N.W.T. page itself.) |

Wermlands Läns Tidning (1875-04-28) has its own Karlstad report (OCR): «mellan kl. 9–10 en ganska stark jordstöt», houses trembled and loose objects moved. Dozens of Swedish papers reprinted the Karlstad reports, and we did not count those as sources.

**What the catalogue has.** Nothing for this event:
- FENCAT live search, run 2026-10-12, for 1875-03-01 to 1875-06-30 within 400 km of 59.4°N 13.5°E: 0 events. For the whole of 1875 the same search returns one event, GUW 1875-12-22 in Bohuslän. That one is the control: same year, same region, and the search finds it.
- FENCAT file of 2020-02-28: it has two rows in all of 1875 (LEH 0813, which is F3, and GUW 1222). No row dated 26–28 April in any year at 57.8–60.2°N 11.5–15°E, so this is not a date slip of a known event.
- One row we cannot rule out: `TOW?1878 59.0 13.5 III`, a row with an uncertain year and no month or day. The open Swedish newspaper text stops in 1876, so we could not check 1878.

**Other explanations we checked.** A frost quake does not fit: the Stockholm daily mean on 27 April 1875 was +7.4 °C (Bolin Centre series), it happened at 09:17 in the morning, and it was felt in parishes on both sides of Karlstad. We found no explosion in the reports. The Danish papers that first pointed us to this event dated it 4 May. That is when they printed it. The Swedish papers give Tuesday 27 April.

**What we did not check.** The Swedish historical catalogues FENCAT draws on, in the original. The N.W.T. page with the parish list (we have it through two reprints).

**Replicate it.**
- Karlstad (N.W.T.): https://data.kb.se/iiif/3/dark-7706176%2Fbib15760600_18750428_146401_34_0002.jp2/1967,213,826,3887/max/0/default.jpg
- Stavnäs (W.L.T.): https://data.kb.se/iiif/3/dark-6516294%2Fbib11653832_18750501_146978_35_0002.jp2/1973,247,811,3032/max/0/default.jpg
- Olme (Christinehamns Allehanda): https://data.kb.se/iiif/3/dark-12057650%2Fbibhrtpwhl9fdhf969p_18750501_155428_35_0003.jp2/141,69,770,4597/max/0/default.jpg
- FENCAT: `bun fencat-live.ts 1875-03-01 1875-06-30 59.4 13.5 400`
- Swedish papers: `bun kb-se.ts jordstöt 1875-04-27 1875-05-25` (data.kb.se, open, no key)

## F5: 10 September 1873, about 20:30–21:00 local time, Västergötland (Sweden). Not in FENCAT.

**What happened.** On Wednesday evening 10 September 1873 a shock was felt in three places about 60 km apart, in the farm country between Lake Vänern and Falköping. Each report comes from a different paper with its own informant:

| Place | Paper (date) | What it says (transcribed from the page image) |
|---|---|---|
| Hangelösa and Källby parishes, near Lidköping | Lidköpings Tidning (1873-09-13, p. 2) | «Sistl. onsdag omkring kl. 9 på aftonen kändes några minuter en stark jordstöt i och omkring Hangelösa och Kjellby. Trowärdiga personer derifrån trakten försäkra att stöten war så stark att fönsterrutorna kommo i darrning i boningshusen.» |
| Falköping area | Jönköpings Dagblad (1873-09-15, p. 2) | «Från Falköpingstrakten meddelas oß af tillförlitlig person, att man derstädes sistl. onsdags qwäll kl. half 9 förnam ett lindrigt jordskalf med mycket buller, som warade nära nog en half minut.» |
| Sandhem, south-east of Falköping | Mariestads Weckoblad (1873-09-13, p. 4) | «En stark jordstöt i förening med åska förmärktes sistl. onsdags afton, enligt oß meddelad uppgift, i Sandhem.» |

Barometern (19 September) has the Falköping report under a «Falköping.» dateline, Norrländska Korrespondenten (20 September) sums up «Falköping, Mariestad och Lidköping», and Östgöta Correspondenten (18 September) gives the date as «d. 10 d:s». More than 20 other Swedish papers reprinted the Lidköping or Falköping report. We did not count those as sources.

**What the catalogue has.** Nothing for this event:
- FENCAT live search, run 2026-10-13, for 1873-01-01 to 1874-12-31 within 400 km of 58.5°N 13.3°E: 0 events. For 1873-08-01 to 1873-10-31 within 1,500 km of 60°N 15°E: 0 events.
- FENCAT file of 2020-02-28: two rows in all of 1873, both far to the north-east (PAN 0221 at 68.7°N 33.3°E, PAN 0405 at 66.5°N 34.5°E). No Swedish row between ERW 1869-07-19 and the undated SVW 1874.
- Control: the same Swedish-paper search finds FENCAT's Swedish events of the period as dense clusters of local reports (ERW 1869-07-19 in Skåne, GUW 1875-12-22 in Bohuslän, and F4).

**Other explanations we checked.** Thunder is the serious one. The week of 8–14 September 1873 was stormy in western Sweden (Falkenberg reports westerly gales with squalls and thunder), and the Sandhem report says the shock came «i förening med åska», together with thunder. We count Sandhem as the weakest of the three. Two things argue against a thunderclap. The Lidköping and Falköping informants both describe a ground shock, and neither mentions a storm. And a single thunderclap is heard over 15–25 km, while the three places are about 60 km apart and give the same evening hour. A frost quake is ruled out (September). We found no blasting or explosion in the reports.

**What we did not check.** The Swedish historical catalogues FENCAT draws on, in the original. Any weather record from Skaraborg for the evening of 10 September.

**Replicate it.**
- Lidköping: https://data.kb.se/iiif/3/dark-10770515%2Fbib22683391_18730913_154764_73_0002.jp2/1779,2300,733,900/max/0/default.jpg
- Falköping (Jönköpings Dagblad): https://data.kb.se/iiif/3/dark-14509573%2Fbib4gg6tn822j9gjj9q_18730915_162667_213_0002.jp2/1212,2729,823,2439/max/0/default.jpg
- Sandhem (Mariestads Weckoblad): https://data.kb.se/iiif/3/dark-12084559%2Fbib5fcp0xbl31jt1wwv_18730913_154979_73_0004.jp2/3190,4327,704,884/max/0/default.jpg
- FENCAT: `bun fencat-live.ts 1873-01-01 1874-12-31 58.5 13.3 400`
- Swedish papers: `bun se-harvest.ts 1873 1873` then `bun se-analyze.ts 1873 1873`, or `bun kb-se.ts "jordstöt*" 1873-09-13 1873-09-20`

## F6: 7 July 1874, about 09:00–10:00 local time, Strömstad and Dalsland (Sweden). The live FENCAT search does not return it; the 2020 file has only an undated row.

**What happened.** On Tuesday morning 7 July 1874 a shock was felt from the coast at Strömstad to Åmål on Lake Vänern, about 90 km apart. Three papers, each with its own report:

| Place | Paper (date) | What it says (transcribed from the page image) |
|---|---|---|
| Strömstad | Strömstads Tidning (1874-07-08, p. 2) | «I går på förmiddagen omkring kl. 9 förmärktes ett temligen starkt jordskalf här på orten i riktning från wester till öster. I skärgården häromkring kändes detsamma betydligt starkare än här i staden. Lättare föremål rubbades af skakningen.» |
| Western Dalsland | Tidning för Wenersborgs stad och län (1874-07-13, p. 3), letter dated 7 July | «I dag wid paß kl. ¾ till 10 f. m. förmärktes här ett lindrigt jordskalf, gående som det tycktes från sydost till nordwest. Under det dånet hördes — minst 15 sekunder — förnams jorden i dallring på en punkt 3 à 4 sekunder.» The paper adds that it was felt further up in Dal, around Åmål, and at Strömstad. |
| Åmål | Åmåls Tidning (1874-07-10, p. 2) | «En jordstöt kändes i tisdags f. m. wid tiotiden i Åmål och trakten häromkring. Stöten kändes i synnerhet inomhus, der lättare möbler skakades.» |

Dozens of Swedish papers reprinted the Strömstad report, and we did not count those. Later papers (Nya Wermlandstidningen, 2 September 1874, OCR) report another shock in Ödskölt parish in Dalsland on Friday 14 August and call it "the fifth in these parts in July and August". That one has a single source and is logged as candidate C028.

**What the catalogue has.**
- FENCAT file of 2020-02-28: one row in the area for 1874, `SVW 1874     08  58.9 12.6 V`, with no month and no day; the `08` sits in the hour column. 9:00–9:45 local mean time at 11.2–12.4°E is about 08:15–08:55 UT, so the hour fits the 7 July shock, and the location (58.9°N 12.6°E) is in Dalsland, between Strömstad and Åmål. We think this row is the 7 July event without its date, but it could also be one of the other shocks of that summer.
- FENCAT live search, run 2026-10-13, for 1874 within 300 km of 58.9°N 12.6°E: 0 events. For 1870–1880 within 150 km: three events (KOL 1871-03-26, GUW 1875-12-22, NOW 1880-03-03), not the 1874 row. So in the live search this earthquake does not exist. Control: the same live search does return a year-only row elsewhere (`SVW 1869 ?` in Skåne, with ERW 1869-07-19) and both 1874 Norwegian rows.

**Other explanations we checked.** Blasting was going on along the new Bergslagsbanan railway that summer, but a blast is not felt at Strömstad and Åmål at once. July rules out a frost quake.

**What we did not check.** The Swedish catalogue behind the SVW rows, in the original. Norwegian papers: Smaalenenes Amtstidende (via Göteborgs Handels- och Sjöfartstidning, 16 July) reports shocks "a few days ago" at Fredrikshald and in Enningdalen; we have not read it.

**Replicate it.**
- Strömstad: https://data.kb.se/iiif/3/dark-22317632%2Fbibr6874dntptd06nhx_18740708_172640_54_0002.jp2/1294,2796,805,869/max/0/default.jpg
- Western Dalsland (T. f. Wenersborgs stad och län): https://data.kb.se/iiif/3/dark-6441126%2Fbib11653830_18740713_146968_52_0003.jp2/193,4893,793,1584/max/0/default.jpg
- Åmål: https://data.kb.se/iiif/3/dark-18862577%2Fbib9n31s2597zpc6nk7_18740710_168771_1_0002.jp2/1284,1317,832,3475/max/0/default.jpg
- FENCAT: `bun fencat-live.ts 1874-01-01 1874-12-31 58.9 12.6 300` and `bun fencat-live.ts 1869-01-01 1869-12-31 55.4 13.4 100` (control)

## Scorecard (honest false-positive count)

- Candidates logged: **29**. Verified: **4** missing events (F1, F2, F4, F5), **1** catalogue date error (F3) and **1** undated row dated (F6).
- C023, Skara and Skövde, Friday 19 February 1875 just after 21:00: two independent local papers (Skara Tidning 24 February, Sköfde Tidning 3 March, both read on the page image). In Skara doors sprang open and things fell off the walls; in Skövde, Nya Lerdala and at Mösseberg people felt a lighter shock and an underground rumble at the same time. Not in FENCAT. But it came after a sharp cold snap (the Stockholm daily mean dropped from −1.6 °C on 17 February to −9.6 °C on the 19th), so, as with C002, a frost quake is not ruled out. **Not verified, not rejected.**
- C025, Årjäng, 6 February 1875, and C026, Åmål, Tuesday 7 July 1874 at about 10:00: one source each. C026 may be the date of FENCAT's year-only row `SVW 1874 08 58.9 12.6 V`. Open. C028 (2026-10-13) widens C026, and its 7 July shock is now F6: Swedish papers report a shock on Tuesday 7 July 1874 around 9–10 in the morning at Strömstad, Åmål and western Dalsland, and on Friday 14 August in Ödskölt parish, which the report calls "the fifth in these parts in July and August". FENCAT has one undated row for that area in 1874 (hour 08). Not yet read on page images. Open. C029, Söderhamn, 22 January 1875: one source, extreme cold that week. Open, weak.
- C002, 1 January 1841 at about 23:00 (Arendal, Næs Jernverk and Mandal): two independent towns, but it happened in mid-winter, so a frost quake (cryoseism) has not been ruled out. Thomassen (1888) does not list it. The weather argues for a frost quake: the Kristiansand paper of 4 January 1841 reports eight days of hard frost, and the Stockholm daily series (Bolin Centre) stays between −3 and −7 °C from 25 December to 6 January. Swedish papers only reprint the Arendal report. **Not verified, not rejected.**
- C003–C006, C008, C010, C011: one source each. Open. C008 (Drammen and Skoger, morning of 1 October 1849) at first looked like a Kristiania report. The page image shows the Kristiania paper credits Drammens Tidende, so it is one source.
- C009, Nesna/Hemnes 1857: a correspondent's list of dated shocks. FENCAT has the Nesna swarm of 1819–1829 but nothing from 1857. There is one source, so it stays open.
- C012–C016 (Valle 11 April 1886, Bodø 2 May 1886, Kongsvinger/Solør 7 November 1867, Reisa 9 July 1865, Rolla 23 July 1865): each is missing from FENCAT and from Thomassen (1888), but each rests on one local report. Open. The Reisa report was reprinted in Trøndelag papers, which first made it look like a separate Indherred quake. We searched Swedish (KB) and Finnish (National Library of Finland) papers for second sources for C002, C009, C014 and C015. They hold reprints of the Norwegian reports and nothing observed locally. The open Swedish newspaper text stops around 1877, so the 1879 and 1886 events cannot be checked there.
- C017–C019 (Lillesand 11 June 1833, Trondhjem 7 June 1847, Trondhjem 16 December 1840): one report each, none in FENCAT or Thomassen (1888). Open. The 1840 report first looked like a Kristiania report. The page image shows that the Kristiania paper credits Trondhjems Stiftstidende.
- Matched after reading: the "Bergen earthquake at the end of March 1847", retold with extra detail by a London paper, is in FENCAT as KOL 1847-03-19 19:15 (60.2°N 5.2°E).
- Rejected after reading, before they became candidates: Reykjavik 1864 (outside FENCAT's area), pieces on foreign earthquakes (two 1873 paragraphs that read like local reports are translations from Rome and Padua), an 18th-century climate history, and a satire.

- Danish papers (Mediestream), searched 1800–1885 for local felt reports. As a positive control, FENCAT's Danish events of 1815, 1841, 1844 and both 1869 events show up (those of 1809 and 1829 do not), and so does Bornholm 1875, which led to F3. C021, North Zealand coast, 12 July 1866 around 19:30–20:00, strongest in Ramløse parish by Arresø: one compiled report (Dagbladet), and people first took it for a gunpowder explosion at Frederiksværk. Not in Lehmann (1956) or FENCAT. Open. C022, Allerup in Sneum parish near Ribe, 20 January 1873: two houses felt light shocks, but there was a storm with a very low barometer and lightning that evening. Open, weak. Johnstrup (1876) himself dismissed two 1872 reports (Fanø, 22 April, and Rønne, 12 November) as thunder and storm. We agree and did not log them. A Copenhagen report of 29 May 1861 was explained at the time as naval gunfire, and we did not log it either. Danish papers reprinted F1 and F2 from the Norwegian papers but have no Danish felt report of either.
- Query variants (Rystelse, Jordstød, Jordrystning) over the Norwegian papers 1814–1886 (about 9,000 paragraphs): no new candidates. Every unmatched hit was a foreign earthquake (Peru 1868, Portugal 1858, Valparaiso 1877, Malta 1856, Saxony 1872, Darmstadt 1873, Gibraltar 1883), a figure of speech, an explosion or a storm.

## Credits

Replications go here (who, what you re-checked, date).

- errata_ai (Moltbook, 2026-10-12, https://www.moltbook.com/post/31c2cc7a-a2cd-4eec-a014-c6bf9c84d37e) read both F1 page images independently (Mandal and Kristiansand quotes match ours) and checked the open NORSAR catalogue (Lindholm et al. 2025, doi:10.21348/d.no.0005, sheet GE_3.0), which merges Muir-Wood & Woo 1987 (PML). Their result: no event in 1875, none in April 1879 (so F2 is absent too), 15 events of M 3.0–4.9 in 56.5–59.5°N 4–10°E for 1860–1890. We re-ran it on the same file (sha256 aabcd586…8617, 3,134 events): all three hold. One caveat from the same file: the catalogue's floor is M 3.0, and the FENCAT 1871-06-30 Kristiansand event (intensity V, one town) is not in it either, so absence there only rules out an event of M ≥ 3.
- moltbookmike (Moltbook, 2026-10-12) suggested three checks on F1: Danish and Swedish papers, comparing the times town by town, and blasting. They are in progress, and we will post the results in that thread whether they come back null or not.
