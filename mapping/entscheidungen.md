# Entscheidungen und Erkenntnisse

Hier landet alles, was beim Mapping entschieden oder herausgefunden wurde und nicht in einer einzelnen
Zeile von `feld-mapping.csv` Platz hat. Neue Einträge oben anfügen.

Vorlage:

```
## E-<Nr>: <Titel>            (Datum, Name)
Status: offen | entschieden | verworfen
Kontext: Worum geht es, welche Bögen/Felder sind betroffen?
Entscheidung: Was wurde beschlossen?
Begründung: Warum – und welche Alternativen wurden verworfen?
```

---

## Gestellte Rückfragen

Fragen, die bereits gestellt wurden und auf Antwort warten. Betroffene Zeilen in `feld-mapping.csv` haben
im Kommentar `[Rückfrage offen]`.

| Gestellt | An | Frage | Betrifft |
|---|---|---|---|
| 03.11.2026 | Projekt | Felder ohne Version (`tumorSize`, `lymphNodesCount`, `metastasesState`) – Altfelder? `firstDiagnosis`, `curativeOperable` – wie abbilden? | `tumorStage` |
| 03.11.2026 | Projekt | Bedeutung von `histology` vs. `diagnosticHistology` („Netzwerkzentrum“): beide in OS.Pathologiebefund, wie unterscheiden? Gilt ebenso für Vorbefunde vs. Befunde der Immunhistochemie. | `histology`, `diagnosticHistology`, `preliminaryFindingsImmunohistochemistry`, `immunohistochemistry`, `preliminaryOtherExaminations`, `otherExamination` |

## E-10: nNGM-spezifische Bögen ohne Onkostar-Gegenstück            (09.11.2026)
Status: teilweise umgesetzt – `NNGM.Anforderung` und `NNGM.Therapieinformation` am 10.11.2026 gebaut, importiert
und getestet (siehe `osc_nngm/README.md`); übrige Kandidaten offen
- `diagnosticsRequest` → Kandidat `NNGM.Anforderung` (Auftragsdaten, Anforderungsdatum als Bezugsdatum für
  „zur Anforderung“, E-7).
- `assessment` (MURIPEDIA-Archivierungscodes, klinische Information: zugelassene zielgerichtete Therapie, Studie,
  Off-Label, Vorstellung im molekularen Tumorboard) und `TherapyInformation` (Therapieinformation, hilfreich,
  umgesetzt, Grund der Nichtumsetzung) → Kandidat gemeinsames `NNGM.Therapieinformation`. „Vorstellung bei
  molekularem Tumorboard“ evtl. aus OS.Tumorkonferenz ableitbar – prüfen, ob dort ein molekulares Tumorboard
  unterscheidbar ist.
- `nngmPortal` (Nutzung des Patientenportals gewünscht) → Kandidat Feld in einem nNGM-Fall- bzw. Patientenformular
  (hängt an der Grundsatzfrage „Abbildung der Visiten“).
- `impalux` (Studienmodul IMPALUX, Kohorte A/B): je Diagnostik-Eintrag Ort der Probenentnahme (ICD-O-3),
  Multiplex-IHC-Panel (HER2, c-MET, PRAME, DLL3, TROP2, MAGE-A4 mit Färbemuster, H-Score, Expressionsanteilen,
  bei HER2 Intensität und Score 0–3+), RNA-Sequenzierung und Multiplex jeweils mit Datum/Materialverfügbarkeit/Grund/
  Bemerkung, HLA-Diagnostik (Datum, Befund). Zwei mögliche Lösungen, Entscheidung offen:
  A) **ganzer Bogen als eigenes Studienformular `NNGM.IMPALUX`** – Studiendaten bleiben zusammen;
  B) **Teilzuordnung:** Ort der Probenentnahme → OS.Molekulargenetik ICD-O-3 Lokalisation (sichtbar nur bei Probe aus
     LK/Metastase/Normalgewebe), Multiplex-Marker → IHC-Unterformular, Protein ERBB2/MET/PRAME/DLL3/TACSTD2/MAGEA4
     (alle im Genkatalog); Messwerte, Studienablauf, HLA und Kohorte im Erweiterungskatalog (E-8).
  `OS.Studie` kennt keine Kohorte; der Katalog `OS.Studien` ist in der Instanz leer.
- `consents` (167 Felder) → Kandidat `NNGM.Einwilligung`: Teilnahmeerklärung, Behandlungsvertrag,
  Einwilligungserklärung 2.2 / 4.0 / 4.1, Broad Consent 1.6d / 1.7.2 (MII), andere lokale Einwilligung – je Dokument
  Unterschrift ja/nein, Datum, Widerrufsdatum, Änderungsgrund (Korrektur / Widerruf) und je Version eigene
  Policy-Regeln (Datenweitergabe, Krankenkassendaten, Biomaterial, Kontakt, Zusatzbefunde …). OS.Einwilligung deckt
  nur LKR-Meldung, Tumordokumentation und PCO-Studie ab.
  Offene Fragen:
  1. **Broad Consent (MII):** Wo wird er am Standort geführt? Wenn in einem Einwilligungsmanagement (z. B. gICS),
     Übernahme von dort prüfen statt Doppelerfassung in Onkostar.
  2. **Versionen:** Jede neue Einwilligungsversion bringt eigene Felder (2.2 → 4.0 → 4.1) – das Formular muss mit
     jeder Version erweitert werden; Aufbau (ein Unterformular je Dokumenttyp/Version) beim Bau festlegen.

## E-9: Rezidiv/Progress und Resistenztestungen (Arbeitsstand)            (09.11.2026)
Status: offen – Fragen noch nicht gestellt
Kontext: Bogen `progressRezidiv` – je Rezidiv/Progress-Ereignis (Datum, ja/nein) Resistenztestungen für 11 Gene
(ALK, BRAF, EGFR, FGFR, KRAS, MET, NTRK1–3, RET, ROS1) mit Datum, durchgeführten Panels/Tests, Exon/HGVS c./p. bzw.
Fusionspartner und den früheren TKI-Therapien. Enthält **keine** Metastasen-Lokalisationen.
Arbeitsstand:
- Ereignis → **OS.Verlauf** (Datum) bzw. abgeleitetes `NNGM.Verlauf` (E-8). Für „Rezidiv/Progress ja/nein“ gibt es
  in OS.Verlauf kein eigenes Feld; die Angabe steckt in der **Gesamtbeurteilung** (`ADT.Gesamtbeurteilung`,
  10 Werte, darunter P = Progression und Y = Rezidiv). Zwei Varianten, Entscheidung offen:
  | | A) Gesamtbeurteilung nutzen | B) eigenes Ja/Nein-Feld |
  |---|---|---|
  | Erfassung | Gesamtbeurteilung (10 Werte) | `rezidivProgress` mit `NNGM.yesNo` im Erweiterungskatalog |
  | Export | P oder Y → yes, sonst no | 1:1 |
  | Progression/Rezidiv unterscheidbar | ja | nein |
  | Doppelerfassung | keine (Gesamtbeurteilung wird für die Registermeldung ohnehin erfasst) | ja, wenn der Verlauf auch fürs Register dokumentiert wird |
  Variante B2: Gesamtbeurteilung im abgeleiteten Formular auf P und Y beschränken (z. B. Kategorienfilter) –
  Unterscheidung bleibt, nur zwei Auswahlwerte; Machbarkeit ohne Änderung am OS-Katalog ungeprüft.
- Resistenztestung → **OS.Molekulargenetik** (Befunddatum, Panel/Analysemethode) + je Gen ein Unterformular
  **OS.Molekulargenetische Untersuchung** (Gen, Exon, cDNA c., Protein p., fusioniertes Gen). Alle 11 Gene sind im
  Katalog `OS.Molekulargenetik`; nNGM „FGFR“ ist dort aber nur als FGFR1/2/3 vorhanden.
- Panels/Tests: **unvollständig** – `OS.MolDiag.Panels` kennt 3 Panels, nNGM rund 15 plus FISH-Tests; nNGM-Liste als
  Katalog im Erweiterungskatalog vorgemerkt (E-8).
Ideen / Vorschläge:
- **Zuordnung Resistenztestung ↔ Ereignis:** über das Datum ableiten (letztes Rezidiv/Progress-Ereignis vor der
  Testung) oder im abgeleiteten `NNGM.Molekulargenetik` ein Formularverweis auf den OS.Verlauf (E-8).
Offene Fragen:
1. **Frühere TKI-Therapien** je Resistenztestung: nNGM liefert sie als Namen aus einer eigenen Liste (129 Werte,
   auch Kombinationen wie „Carboplatin/Pemetrexed/Pembrolizumab“), nicht als ATC-Codes. Aus den dokumentierten
   OS.Systemische Therapie-Einträgen ableiten (Übersetzung ATC-Substanzen → nNGM-Name nötig, hängt am veralteten
   Substanzkatalog, E-4) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung)?
2. **FGFR:** Welches FGFR-Gen meint nNGM (FGFR1, FGFR2 oder FGFR3)?
3. **Assay (Freitext)** bei den Amplifikationstests in `resistanceTesting`: Bemerkung der molekulargenetischen
   Untersuchung oder eigenes Feld im Erweiterungskatalog (E-8)?

4. **NGS-Sequenzer** (`lungPanel`, Freitext): Onkostar-Katalog `OS.MolDiag.Sequenziergerät` ist in der Instanz leer
   (Standortpflege) – Katalog pflegen oder Freitext im Erweiterungskatalog? (ungelöst)
5. **nNGM-Panelliste** (`ngsDnaPanel`): Werteliste steht weder im Schema noch in der Excel-Datei → bei nNGM anfragen
   (gehört zur Grundsatzfrage „nNGM-Terminologien“); `OS.MolDiag.Panels` kennt nur 3 Panels → unvollständig.

**Bogen `lungPanel`** (je Befund): Panel-Ebene → OS.Molekulargenetik (Befunddatum, Panel, Bemerkung,
Referenzgenom); je Gen eine OS.Molekulargenetische Untersuchung mit denselben Variantenfeldern wie die KIT-Variante
in `resistanceTesting`. Ergebnis P/N aus „HGVS ausgefüllt“ ableiten. Ohne Gegenstück: Analyse möglich + Grund,
vollständig auswertbar, Freitexte „Anderes“.
`consequence` („Biologische Interpretation“) → Pathogenitätsklasse (`OS.MolSeqPathogenitätsklasse`), **vorläufig**:
beide beschreiben die 5-stufige ACMG/AMP-Klassifikation (nNGM als LOINC-Antwortcodes, Onkostar als Klassen 1–5 mit
den englischen ACMG-Begriffen) – pathogen → 5, wahrscheinlich pathogen → 4, unsichere Signifikanz → 3,
wahrscheinlich gutartig → 2, gutartig → 1. Über die Bedeutung abgeleitet, keine offizielle Übersetzungstabelle.
Unsicherheiten, über die später entschieden werden muss (fachliche Prüfung durch die Molekularpathologie):
1. **Keimbahn oder somatisch:** Das 5-Klassen-System ist für Keimbahnvarianten gedacht; somatische Tumorvarianten
   werden fachlich meist nach AMP/ASCO/CAP in Tier I–IV (therapeutische Relevanz) bewertet. nNGM und Onkostar nutzen
   trotzdem die 5 Klassen.
2. **Bedeutung des Felds:** nNGM nennt es „Biologische Interpretation“, nicht ausdrücklich ACMG-Klassifikation –
   die LOINC-Codes sprechen dafür, ausdrücklich definiert ist es nicht.
3. **„Anderes“:** ohne Gegenstück (Freitext im Erweiterungskatalog, E-8).

**Bogen `ngsFusion`** (je RNA-Panel-Befund): wie `lungPanel`, je Gen eine Untersuchung mit Ergebnis F (Fusion),
Art der Fusion = RNA und dem Onkostar-Abschnitt „RNA fusion 5'/3' Fusion Partner“ (HGNC-Symbol, Transcript ID,
Exon ID, Anzahl Reads). Ergebnis positiv/negativ/nicht auswertbar → F/N/UX. Panel-Version (`ngsRnaPanel`)
unvollständig wie bei `ngsDnaPanel` (Frage 5).
- **Annahme 5'/3':** nNGM unterscheidet „untersuchtes Gen“ und „Fusionspartner“, Onkostar 5'- und 3'-Partner. Die
  Seite wird aus `fusionPartnerType` abgeleitet: „5' Fusionspartner Exon“ → Partner 5', untersuchtes Gen 3' (z. B.
  EML4-ALK: EML4 5', ALK 3'), umgekehrt entsprechend. Aus den Feldnamen geschlossen, nicht ausdrücklich definiert.
6. **MET Exon-14-Skipping** (`metPhenotype`, ungelöst): Spleißvariante, keine Fusion. Onkostar hat bei MET das Feld
   „MET Level“ mit `E-14` („Exon 14-skipping“); offen, welches Ergebnis dazu gesetzt wird (P = Variante oder
   S = Sonstiges).

**Bogen `liquidBiopsy`** (je Befund aus Blut): OS.Molekulargenetik mit Entnahmemethode Liquid-Biopsie, Probe aus
Blut, Nukleinsäure cfDNA; je Primärmutation bzw. Resistenztestung eine Untersuchung (Gen, Datum, Exon, c./p.,
Ergebnis positiv/negativ/nicht auswertbar → P/N/UX). Gen bei Primärmutationen Freitext → Gen-Code (Übersetzung
nötig). „Primärmutation/Resistenztestung vorhanden“ abgeleitet aus den Einträgen. Hersteller (Freitext) wie Sequenzer
ungelöst (Katalog `OS.MolDiag.KitHersteller` leer).
- **Eingangsnummer je Eintrag (Problematik):** nNGM erlaubt je Primärmutation/Resistenztestung eine eigene
  Eingangsnummer; in Onkostar gehört die Eingangsnummer zum OS.Molekulargenetik-Eintrag (Einsendung), nicht zur
  einzelnen Untersuchung. Vorläufig: gleiche Nummer = ein OS.Molekulargenetik mit mehreren Untersuchungen,
  verschiedene Nummern = mehrere OS.Molekulargenetik-Einträge. Damit zerfällt ein nNGM-Befund ggf. in mehrere
  Onkostar-Einträge, die beim Export wieder zusammengeführt werden müssen.
7. **Primärmutation oder Resistenztestung** (ungelöst): Onkostar kennt keine Kennzeichnung der Untersuchung. Vorerst
   Feld im Erweiterungskatalog von `NNGM.Molekulargenetik` (E-8); Ableitung (z. B. „Untersuchung nach einem
   dokumentierten Progress = Resistenz“) wäre unsicher.

**Bogen `fastTrack`** (je Material): 12 Schnelltests (ALK, BRAF Exon 15, EGFR Exon 19/20/21, KRAS Exon 2,
MET Exon 14, NTRK1–3, RET, ROS1) → OS.Molekulargenetik + je Test eine Untersuchung (Gen, Exon, Datum, Ergebnis,
c./p.). Fusionstests: Fusion/keine/nicht auswertbar → F/N/UX; „Analyse möglich = nein“ → Ergebnis UX. Vorläufig
eingetragen, mit Bemerkungen:
- **Analysemethoden (unvollständig):** Onkostar ist gröber – qPCR, RT-PCR, Fragmentlängen- und
  Schmelzkurvenanalyse werden alle zu P (PCR/Realtime-PCR/MLPA); Pyrosequenzierung und Sanger → S + Art der
  Sequenzierung, Immunhistochemie → I, Andere → A. Beim Export ist P nicht eindeutig zurückzuübersetzen.
- **„keine aktivierende Mutation“** umfasst Wildtyp (N) und nicht aktivierende Mutation (P + Aktivierend = N). Export
  beides → „keine aktivierende Mutation“; bei der Erfassung muss eines gewählt werden.
- **„Aktivierend“ nur bei EGFR:** Das Feld ist bei BRAF/KRAS ausgeblendet. Annahme dort: Mutation (P) = aktivierend
  (fachlich meist, nicht immer). Option E-8: im abgeleiteten Formular auch für BRAF/KRAS einblenden.
- MET Exon 14: Mutation → P, Zusammenhang mit MET Level E-14 offen (Frage 6).

**Bogen `ishFish`** (je Befund, CISH- und FISH-Liste): OS.Molekulargenetik mit Analysemethode „(in-situ)
Hybridisierung“ + Art der Hybridisierung (CISH/FISH), je Test ein Eintrag im Unterformular
OS.Molekulargenetische Hybridisierung. Dieses hat **nur Gen, Ergebnis und fusioniertes Gen**. Amplifikationstests
(EGFR, ERBB2, KRAS, MET): positiv → CNV, negativ → N, nicht auswertbar → UX.
- **Ohne Gegenstück (ungelöst, rund 60 Felder):** Kit, Zellzahl, Polysomie, Signalzahlen Gen/CEN, Quotient, Mittelwert
  je Zelle, Prozent Zellen high/medium/low, Amplifikationsstufe. Vorschlag (E-8): abgeleitetes
  Hybridisierungs-Unterformular mit Erweiterungskatalog. Die Signalfelder heißen bei EGFR/ERBB2/KRAS ebenfalls
  „…MET…“ – offenbar aus dem MET-Block kopiert, gemeint ist das untersuchte Gen.
- **Datum je Test:** Das Unterformular hat kein Datum, nur die Einsendung – bei verschiedenen Testdaten Verlust.
8. **Break-Apart positiv** (ALK, RET, ROS1, NTRK1–3): Ergebnis F („Fusion (Translokation Inversion Insertion)“) oder
   T („Translokation“)? Eine Break-Apart-Sonde zeigt den Bruch im Gen, nicht den Fusionspartner – T wäre genauer,
   F ist geläufiger.
9. **KRAS hohe Polysomie** (≥ 40 % bzw. 10–40 % Zellen): kein Gegenstück, ungelöst.
10. **CISH und FISH im selben Befund:** Ein OS.Molekulargenetik-Eintrag hat nur eine „Art der Hybridisierung“; die
    Hybridisierungs-Einträge darunter tragen keine eigene Art. Optionen:
    a) zwei OS.Molekulargenetik-Einträge (CISH / FISH) je Befund – wie bei den Eingangsnummern der Liquid Biopsy;
    b) Erweiterungsfeld „Art (CISH/FISH)“ und Datum je Test im abgeleiteten Hybridisierungs-Unterformular (E-8) –
       löst auch den Datumsverlust;
    c) Sammelformular je Befund/Material mit mehreren OS.Molekulargenetik-Blöcken als Unterformularen – bräuchte
       verschachtelte Unterformulare (OS.Molekulargenetik hat selbst Unterformulare); in der Instanz bindet kein
       Formular ein Formular mit eigenen Unterformularen ein (0 von 78 Unterformular-Feldern) → erst testen.

**Bögen `immunohistochemistry` / `preliminaryFindingsImmunohistochemistry`** (Befunde / Vorbefunde, fast gleich):
OS.Molekulargenetik mit Analysemethode Immunhistochemie, je Marker ein Eintrag im Unterformular
OS.Molekulargenetische Immunhistochemie (Protein, Ergebnis; bei PD-L1 TPS %, TC-Score, IC %, IC-Score, CPS). Alle
Marker im Genkatalog: ALK, BRAF, CK7, MET, NAPSA, P40, PDL1 (Code PDL1 nötig für die Score-Felder), ROS1, TTF1,
MIB1 → MKI67, neuroendokrin CD56/Chromogranin/Synaptophysin → NCAM1/CHGA/SYP. Ergebnis positiv/negativ/nicht
auswertbar → P/N/UX. PD-L1: TPS/IC exakt direkt, Bereiche über TC-/IC-Score (OS.MolIC), CPS direkt.
- Ungelöst: „fraglich“ (ALK, MET, ROS1) ohne Gegenstück; Datum je Marker, Antikörper, MET-Klassifikation 0–3+,
  MET-Expression, „nicht bestimmt/nicht auswertbar“ je Score → Vorschlag (E-8): abgeleitetes IHC-Unterformular mit
  Erweiterungskatalog.
- **MIB1/Ki-67:** exakter Wert und Bereich bevorzugt als Feld im Erweiterungskatalog (E-8). Alternative:
  OS.Pathologiebefund → Ki-67 (%) – dann stünde Ki-67 in einem anderen Formular als die übrigen IHC-Marker.
11. **pan-TRK (NTRK1to3):** kein gemeinsamer Code im Genkatalog – ungelöst; mögliche Umsetzung: NTRK1 mit Notiz.
- Vorbefunde: Befunddatum, Befundnummer (→ Einsendenummer), Netzwerkstandort; Unterscheidung Vorbefund/Befund hängt
  an der gestellten Rückfrage zu `histology`/`diagnosticHistology`.

**Bögen `otherExamination` / `preliminaryOtherExaminations`** (identisch, Befunde / Vorbefunde): OS.Molekulargenetik
mit Analysemethode „Andere“, je Untersuchung ein Eintrag im Unterformular „Sonstige- oder PCR-Analyse“ (Gen,
Ergebnis). Gen Freitext → Code; Ergebnis positiv/negativ/nicht auswertbar → P/N/UX, wobei „positiv“ auch eine Fusion
(F) oder Amplifikation (CNV) sein kann. Ungelöst mit Option E-8: Bezeichnung der Untersuchung („Andere Methode(n)“
gilt nur je Einsendung) und Beschreibung der Alteration (Bemerkung ist bei Neuerfassung ausgeblendet); Assay wie
Frage 3. Vorbefund/Befund hängt an der gestellten Rückfrage.

**Bogen `resistanceTesting`** (je Tumormaterial): Amplifikationstests ALK, BRAF, EGFR, HER2 (= ERBB2), KRAS, MET und
eine KIT-Exon-17-Variante → OS.Molekulargenetik je Material (passt zu E-3 Weg A) + je Gen eine
OS.Molekulargenetische Untersuchung. Amplifikation: positiv → Ergebnis CNV + High- oder Low-Level-Amplifikation
(beide → `positive`; umgekehrte Richtung offen), negativ → N, nicht auswertbar → UX. Hinweis: Für MET gibt es
zusätzlich das Feld „MET Level“ (`OS.MolGenMET_Level`: low/intermediate/high level gain, Exon 14-skipping) – eine
Alternative zu Ergebnis CNV für die MET-Amplifikation. KIT-Variante: NM-Nummer, Exon,
c./p., Allelfrequenz (nNGM 0–1 → Onkostar % × 100), Coverage, Chromosom (chrM fehlt), Positionen, Allele,
Interpretation, Referenzgenom (GRCh37/38 → HG19/38). Variantendetails nur sichtbar bei „Dokumentation = Erweitert“
und Ergebnis = P. Ohne Gegenstück: „vollständig auswertbar“, Assay (Frage 3).
**Systemtherapie, Progresse innerhalb der Linie** (`systemicTherapy/…/progressList`): nicht in `progressRezidiv`
enthalten. Vermutung (nicht bestätigt, ungelöst): OS.Verlauf mit Gesamtbeurteilung P + Unterformular
OS.FernmetastaseVerlauf (ICD-O-3), Zuordnung zur Linie über das Datum.

## E-8: OS-Formulare als Basis, nNGM-Formulare „erben“ davon            (05.11.2026, Rückmeldung Projektteam)
Status: entschieden – Vererbung über verknüpfte Formulare; Herstellerfragen am 11.11.2026 beantwortet (siehe unten)
Kontext: Sollen für jeden Bogen komplett eigene nNGM-Formulare entstehen oder bestehende OS-Formulare genutzt werden?
Rückmeldung: Wenn möglich OS-Formulare **als Basis** verwenden. OS-Formulare werden nicht verändert; die Idee ist,
von ihnen **zu erben** und den Rest anzupassen.
Technische Möglichkeiten in Onkostar (echte Vererbung gibt es nicht; `data_form.parent_data_form_id` ist bei keinem
Formular gesetzt):
1. **Gemeinsamer Datenkatalog + Erweiterungskatalog:** Ein Formular kann mehrere Datenkataloge anzeigen (Vorbild:
   die Fragebögen EPIC-26, IPSS, IIEF5 … teilen sich `Fragebogen-Basis`). Z. B. `NNGM.Systemische Therapie` mit dem
   Datenkatalog `Systemtherapie` (dieselbe Tabelle wie OS.Systemische Therapie) und `NNGMSystemtherapie` nur mit
   den fehlenden nNGM-Feldern.
2. **Verknüpfte Formulare:** `EPIC-26-POST` ist mit `EPIC-26` verknüpft (`verknuepft = 1`, `df_verknuepft`),
   gleiche Datenkataloge, 6 Felder mehr. Was die Verknüpfung bewirkt, ist noch unklar.
Folge für das Mapping: A/B bleiben im OS-Basiskatalog (Werteübersetzung = Exportregel), C kommt in den
nNGM-Erweiterungskatalog mit nNGM-Codes (E-0), rein nNGM-spezifische Bögen (z. B. `diagnosticsRequest`) bekommen
ein eigenes Formular ohne Basis.
**Test Variante 1 (05.11.2026, lokale Instanz):** `osc_nngm/NNGM.Systemische Therapie.osc` (erzeugt mit
`mapping/tools/osc-ableitung.mjs`) – Kopie von OS.Systemische Therapie mit Datenkatalogen `Systemtherapie` +
`NNGMSystemtherapie` (3 Testfelder: Liniennummer, Off-Label-Use, Erhaltungstherapie).
- Import der **Minimaldatei** (nur neue Objekte, OS-Objekte nur per Name referenziert) ohne „Merkmalskataloge
  überschreiben“ funktioniert: Formular 749, Datenkatalog 835, Katalog `NNGM.yesNoUnknown`, Tabelle
  `dk_nngmsystemtherapie`. OS.Systemische Therapie und Datenkatalog `Systemtherapie` unverändert (Revision 98/36).
- Testeintrag (Patient 3, Prozedur 19): Basiswerte in **`dk_systemtherapie`**, nNGM-Werte in
  **`dk_nngmsystemtherapie`**, beide mit derselben `id` = `prozedur.id`. Unterformular OS.Substanz (Prozedur 20)
  hängt am nNGM-Formular, Erkrankungszuordnung für beide, Skript „beim Speichern“ (Datum = Beginn) und
  automatisch befüllte Felder (ADT Therapieart) funktionieren, Plausibilitätsregeln sind übernommen.
- **Einschränkung:** Formularverweise anderer Formulare zeigen fest auf das OS-Formular – z. B.
  OS.Strahlentherapie „Systemtherapie 1/2“ → OS.Systemische Therapie (sichtbar bei Therapiekonzept „Kombinierte
  Therapie“ + Radiochemo-/Radioimmuntherapie). **Bestätigt (05.11.2026):** Die nNGM-Systemtherapie wird dort nicht
  angeboten, eine OS.Systemische Therapie beim selben Patienten schon. → Für Onkostar ist ein Eintrag des
  abgeleiteten Formulars **keine** „Systemische Therapie“, obwohl die Daten in derselben Tabelle liegen.
  Dasselbe ist für Registermeldung und OnkoZert-Kennzahlen zu befürchten (nicht geprüft).
**Test Variante 2 – Verknüpfung (05.11.2026):** In der Formularverwaltung bei NNGM.Systemische Therapie unter
Optionen „Verknüpfen = Ja“, „Verknüpftes Formular = OS.Systemische Therapie“.
- „Automatisch zuordnen“ bricht mit einer **NullPointerException** ab (`AbstractDataFormService.automatischZuordnen`,
  Zeile 333; vermutlich wegen der Zusatzfelder ohne Gegenstück). **Speichern** der Optionen funktioniert trotzdem:
  `data_form.verknuepft = 1`, `df_verknuepft` = GUID von OS.Systemische Therapie. Auf Feldebene wird nichts
  zugeordnet (`data_form_entry.verknuepft` überall 0 – wie bei EPIC-26-POST).
- **Ergebnis:** Der Formularverweis „Systemtherapie 1“ in OS.Strahlentherapie bietet jetzt auch den nNGM-Eintrag an
  und speichert ihn (`dk_strahlentherapie.systemtherapie1 = 19`). → Mit der Verknüpfung behandelt Onkostar das
  abgeleitete Formular bei Formularverweisen wie das OS-Formular.
- **Verknüpfung = Vererbung:** Beim Speichern stellt Onkostar Zusammenfassungen, Kalender-/E-Mail-Vorlage und alle
  Formularskripte des OS-Formulars als geerbten Block (`INHERIT START … INHERIT END`) voran (Export `export-27`).
  Eine zusätzliche Kopie dieser Inhalte führt zu doppelter Anzeige und doppelt ausgeführten Skripten.
- **Per OSC setzbar:** `<VerknuepftGUID>` (GUID des OS-Formulars) + geerbte Inhalte nur im INHERIT-Block. Erneuter
  Import (05.11.2026) setzt die Verknüpfung, Zusammenfassung und Skripte stehen nur noch einmal da, Verweis aus
  OS.Strahlentherapie bleibt bestehen, OS-Formular unverändert. `mapping/tools/osc-ableitung.mjs` erzeugt das so.
- Noch offen: ob die Verknüpfung auch für Registermeldung, OnkoZert-Kennzahlen und Auswertungen gilt; ob
  Änderungen am OS-Formular (Hersteller-Update) über „Zuordnen und aktualisieren“ ins verknüpfte Formular kommen
  (scheitert derzeit an der NullPointerException).
Ausweg, falls Variante 2 dort nicht trägt: **Ergänzungsformular** – Erfassung weiter in OS.Systemische Therapie,
nNGM-Zusatzfelder in einem kleinen eigenen Formular (nur Datenkatalog `NNGMSystemtherapie`) mit Formularverweis auf
den OS-Eintrag.
**Entscheidung (05.11.2026):** Die Vererbung über ein **verknüpftes, abgeleitetes Formular** (OS-Datenkatalog als
Basis + nNGM-Erweiterungskatalog, `VerknuepftGUID`) ist der Weg für alle Bögen mit OS-Gegenstück. Bögen ohne
OS-Gegenstück (z. B. `diagnosticsRequest`) bekommen eigene nNGM-Formulare. `NNGM.Strahlentherapie` (eigenständig,
Weg 1) wurde am 10.11.2026 gelöscht und wird bei Bedarf als abgeleitetes Formular neu erstellt.
Prüfpunkt Formularregeln/Skripte: erledigt (werden über den INHERIT-Block geerbt und ausgeführt).

### Fragen an den Hersteller (gestellt bzw. vorbereitet, Testbericht vom 05.11.2026)
1. **Registermeldung/Kennzahlen:** Zählen Einträge verknüpfter Formulare bei oBDS-Meldung, OnkoZert-Kennzahlen
   und Auswertungen wie Einträge des OS-Formulars?
2. **Updates:** Wie kommen Hersteller-Änderungen am OS-Formular ins verknüpfte Formular („Zuordnen und
   aktualisieren“)? Warum bricht „Automatisch zuordnen“ mit einer NullPointerException ab?
3. **GUIDs:** Sind die GUIDs der OS-Standardformulare in allen Installationen gleich?

### Antworten des Herstellers (11.11.2026)
1. **Registermeldung/Kennzahlen:** „Es sollte funktionieren.“ Einträge verknüpfter Formulare werden wie Einträge des
   OS-Formulars behandelt. → Frage 1 = **ja** (Einschränkung „sollte“: bei der ersten echten oBDS-Meldung bzw.
   Kennzahlenauswertung mit einem nNGM-Eintrag gezielt prüfen).
2. **Updates:** Änderungen am Originalformular werden **automatisch** in verknüpfte Formulare eingespielt; Onkostar
   erkennt verknüpfte Formulare. → Kein manuelles Nachziehen bei Onkostar-Updates. (Zur NullPointerException bei
   „Automatisch zuordnen“ gab es keine eigene Aussage; Verknüpfung per OSC-Import funktioniert ohne diesen Schritt.)
3. **GUIDs:** Die GUIDs der OS-Standardformulare sind in allen Installationen **gleich**. → Eine OSC-Datei mit
   `VerknuepftGUID` ist an allen Standorten unverändert importierbar.
Damit gilt unten der Fall „Frage 1 = ja“; die Fälle für Frage 2/3 = nein entfallen.

### Auswirkungen auf bisherige Mappings – was je nach Antwort anzupassen ist
Bis zur Antwort blieben die Status unverändert; betroffene Zeilen in `feld-mapping.csv` tragen im Kommentar
„Option E-8: …“. **Seit 11.11.2026 beantwortet (Frage 1 = ja) – die Punkte unter „Wenn Frage 1 = ja“ sind
umzusetzen.**

**Unabhängig von der Antwort (gilt schon jetzt):**
- A/B-Zuordnungen auf OS-Felder bleiben gültig – die Basisdaten liegen auch beim abgeleiteten Formular im
  OS-Datenkatalog, die Werteübersetzungen bleiben Exportregeln. `os_formular` nennt weiter das OS-Formular.
- Neue Bögen: C-Felder bekommen direkt das Ziel „Erweiterungskatalog des abgeleiteten Formulars“ (Status vorläufig,
  Vermerk E-8).

**Wenn Frage 1 = ja (verknüpfte Formulare zählen wie OS-Formulare):**
1. C-Felder der Basisbögen (rund 30 in Systemtherapie, Operation, Strahlentherapie, Stadium, Histologie,
   Krankenversicherung) von „ungelöst“ auf „vorläufig, Ziel Erweiterungskatalog NNGM.<Formular>“ setzen.
   Ausnahme: Wachstumsmuster (bewusst zurückgestellt).
2. Ausgeblendete OS-Felder im abgeleiteten Formular einblenden (eigene Filter, OS-Formular bleibt unverändert) und
   die Zeilen neu bewerten: Seite der Operation (Filter `false`), Lymphonodektomie (nur CH), oBDS-Zielgebiet der
   Strahlentherapie (nur bei LK-Bestrahlung), Lokalisation/Histologie/Grading im Pathologiebefund (Präparat =
   Biopsie bzw. Tumornachweis), Tumorzellgehalt (nur bei bestimmten Analysemethoden).
3. Strukturfragen mit Erweiterungsfeldern lösen: Liniennummer (E-4, getestet), Einzeldosis pro Tag (E-6),
   Tumormaterial (E-3): Weg C ohne Änderung an OS.Pathologiebefund – Verweis im abgeleiteten
   `NNGM.Pathologiebefund`; oder Weg B mit eigenem `NNGM.Tumormaterial` und Verweisen aus den abgeleiteten
   Befundformularen.
4. Je Bogen mit OS-Gegenstück ein abgeleitetes Formular über `mapping/tools/osc-ableitung.mjs` erzeugen
   (Konfiguration je Bogen: Basisformular, Erweiterungskatalog, Felder aus `feld-mapping.csv`).

**Wenn Frage 1 = nein:**
- Ausweg Ergänzungsformular (siehe oben) für alle Basisbögen: Erfassung im OS-Formular, nNGM-Felder in einem
  eigenen Formular mit Formularverweis auf den OS-Eintrag. Die C-Felder bekommen dann dieses Ziel; ausgeblendete
  OS-Felder (Punkt 2) bleiben ungelöst, weil das OS-Formular nicht verändert wird.

**Wenn Frage 2 = Updates kommen nicht automatisch an:**
- Bei jedem Onkostar-Update die abgeleiteten Formulare aus dem neuen OS-Export neu erzeugen und importieren
  (Werkzeug ist dafür ausgelegt); in der Update-Checkliste festhalten.

**Wenn Frage 3 = GUIDs unterscheiden sich je Installation:**
- `VerknuepftGUID` je Standort aus dessen Export übernehmen (Werkzeug liest die GUID bereits aus dem Export des
  Basisformulars) – OSC-Dateien je Standort erzeugen statt eine gemeinsame Datei.

## E-0: nNGM-Codes oder oBDS-Codes?            (04.11.2026, Rückmeldung eines Kollegen)
Status: entschieden (vorläufig, Abstimmung mit den Projektpartnern später)
Kontext: Frage „Sollen die nNGM-Formulare eigene Kataloge mit den nNGM-Codes (z. B. `curative`) haben oder die
oBDS-Codes der OS-Standardkataloge (z. B. `K`)?“ Zwei mögliche Wege:
1. **Erfassung in nNGM-Ausprägungen** – eigene Felder/Kataloge mit nNGM-Codes.
2. **Mapping im Hintergrund** – erfasst wird in den vorhandenen OS-Feldern (oBDS-Codes, OPS …), vor der
   Übermittlung wird in die nNGM-Ausprägungen übersetzt.
Rückmeldung: Die Projektpartner wollen vermutlich eigene Ausprägungen und würden eher Weg 2 bevorzugen, weil
vorhandene Daten wiederverwendet werden können. Fürs Erste sollen die **nNGM-Ausprägungen unabhängig von der
oBDS-Spezifikation** genutzt werden; die Umsetzung kann später mit den Partnern angepasst werden.
Folgerung für dieses Mapping:
- Wo ein OS-Standardfeld passt (Kategorie A/B), ist das Mapping die **Vorlage für Weg 2**: `werte-mapping.csv`
  beschreibt die Übersetzung oBDS/OS → nNGM beim Export.
- Wo es kein Gegenstück gibt (Kategorie C), bekommen neue nNGM-Felder **eigene Kataloge mit den nNGM-Codes**
  (wie bei `NNGM.Strahlentherapie`).
- Abgeleitete Werte (Kategorie D, z. B. Resektionsart aus OPS-Codes) sind ebenfalls Weg 2. Alternative wäre ein
  eigenes nNGM-Feld mit nNGM-Codes (Weg 1) – bei jeder solchen Ableitung festhalten.

**Neue Rückmeldung (11.11.2026):** Die Übersetzung in die nNGM-Codes **in das Mapping auslagern** – Empfehlung:
**Mapping beim Export** (analog zum Vorgehen bei DNPM), damit bei Änderungen des nNGM-Modells nicht die Formulare
angepasst werden müssen. → Weg 2 gilt damit grundsätzlich, auch für die nNGM-Formulare und Erweiterungskataloge.
Folgerungen (entschieden 11.11.2026):
- Wo ein OS-Katalog die Werte abdeckt (z. B. ja/nein → `OS.JaNein`, ja/nein/unbekannt → `OS.JaNeinUnbekannt`),
  diesen statt eines `NNGM.*`-Katalogs verwenden; die Übersetzung steht in `werte-mapping.csv`.
- Für Wertelisten ohne OS-Gegenstück bleiben eigene Kataloge nötig – **mit den nNGM-Codes** (Entscheidung
  11.11.2026).
- **Umgesetzt (11.11.2026):** Der Generator (`osc-lib.mjs`, `OS_KATALOGE`) nutzt für ja/nein `OS.JaNein` (1/0) und
  für ja/nein/unbekannt `OS.JaNeinUnbekannt` (1/0/9); Filter mit nNGM-Codes werden automatisch übersetzt. Betrifft
  12 Felder in `NNGM.Therapieinformation`, `NNGM.Anforderung` und `NNGM.Systemische Therapie`; Übersetzungen in
  `werte-mapping.csv`.

## E-11: Formular-Konventionen in Onkostar            (11.11.2026, Rückmeldung)
Status: entschieden
- **Datum:** Jedes (Haupt-)Formular braucht in Onkostar ein Datumsfeld (Prozedurdatum). Hat der nNGM-Bogen keins,
  wird ein **Onkostar-eigenes Datumsfeld** ergänzt, das **beim Export weggelassen** wird (umgesetzt bei
  `NNGM.Therapieinformation`). **Unterformulare** brauchen kein Datum (z. B. `NNGM.Anforderung.Behandler`; die
  Import-Warnung „steht für die Tumordokumentation nicht zur Verfügung“ ist dort unkritisch).
- **Eigene Menükategorien** (z. B. „nNGM“, „nNGM Therapien“) werden direkt in der Datenbank angelegt:
  `INSERT INTO data_form_menu_category (name, position, column) VALUES ('nNGM', '3', '1')`. In der OSC-Datei verweist
  das Formular per Name darauf (`<MenuCategory><name>nNGM</name>…`). **Lokal angelegt am 11.11.2026** (ID 10,
  Position 3, Spalte 1); alle nNGM-Formulare stehen in dieser Kategorie.

## E-7: Stammdaten, Vitalstatus, Raucherstatus, ECOG, Krankenversicherung (Arbeitsstand)            (05.11.2026)
Status: offen – Fragen noch nicht gestellt
Kontext: Bögen `patient`, `vitalStatus`, `smokerStatus`, `ecog`, `healthCoverage`, `nngm-case`.
Arbeitsstand: Geburtsdatum und Geschlecht aus den Patientenstammdaten; Vitalstatus aus OS.Abschluss bzw.
Stammdaten (je Vitalstatus-Beobachtung ein OS.Abschluss, L/F/V → L/A/T); Raucherstatus aus OS.Anamnese
(G/E/N/U, „Nichtraucher seit“ aus „Mit dem Rauchen aufgehört am“ abgeleitet); ECOG aus
`ADT.LeistungszustandECOG` (LOINC → 0–5).
Offene Fragen:
1. **Quelle für den Vitalstatus:** Onkostar führt ihn doppelt – in den Patientenstammdaten (`letzte_information`,
   `sterbedatum`, `quelleVitalstatus`) und im Formular OS.Abschluss (Status, Letzter Kontakt, Sterbedatum, Quelle).
   Welche Quelle ist maßgeblich? (Werden Sterbedatum/letzter Kontakt über Patientenverwaltung, HL7/KIS gepflegt?)
2. **Zeitpunkt „zur Anforderung“:** nNGM fragt Raucherstatus und ECOG zum Zeitpunkt der Anforderung. ECOG steht in
   OS.Verlauf, OS.Diagnose, OS.Untersuchung und den Therapieformularen, der Raucherstatus in OS.Anamnese. Welcher
   Wert wird gemeldet (z. B. letzter dokumentierter Wert vor dem Anforderungsdatum, aus allen Formularen)?
   Hinweis: Ein Anforderungsdatum gibt es in Onkostar derzeit nicht – es käme erst mit einem eigenen Formular für
   den Bogen `diagnosticsRequest` (Kandidat `NNGM.Anforderung`, E-8).
Erkenntnisse:
- **Informationsquelle (Kontakt/Tod):** Onkostar hat nur ein Quellenfeld. Eindeutig gleich sind nur KIS und
  Krebsregister. „Niedergelassener Arzt“ ↔ „Kontakt Behandler“, „Zeitung“ ↔ „Internet (Todesanzeigen)“,
  „Tumordokumentation“ ↔ „Dokumentar“ sind nur vermutet und deshalb ungelöst; Arztbrief, Kontakt Krankenkasse,
  Kontakt Angehörige, Andere hausinterne Datenbanken haben kein Gegenstück → Status unvollständig.
- **Krankenkasse (ungelöst):** Onkostar speichert die IK-Nummer (`patient.krankenkassennummer` → Tabelle
  `krankenkasse`, 3700 Einträge je Geschäftsstelle), nNGM erwartet einen Kassennamen aus einer Liste von 191.
  68 Namen exakt, 50 als Namensanfang gefunden – eine Übersetzungstabelle IK → nNGM-Name wäre nötig.
  PKV-Tarifform: kein Feld.
- **nNGM-Fall-ID:** hängt an der Grundsatzfrage „Abbildung der Visiten“ (Kandidat `erkrankung.id`).

## E-6: Strahlentherapie → OS.Strahlentherapie (Arbeitsstand)            (04.11.2026)
Status: offen – Fragen noch nicht gestellt
Kontext: Bogen `radioTherapy`. Je Strahlentherapie ein OS.Strahlentherapie mit Status = durchgeführt, Details im
wiederholbaren Unterformular OS.StrahlentherapieEinzel (je Zielgebiet ein Eintrag mit eigener Dosis). Direkt bzw.
mit Werteübersetzung: Beginn/Ende, Intention (K/P/O/S identisch), Stellung zur OP, Seite, Gesamtdosis, Boost
(J/SIB/SEQ/KON/N identisch), Boostdosis, Ende-Grund (Beendigungsstatus + Abbruchgrund + Unterbrechung), Bemerkung.
**NNGM.Strahlentherapie** (eigenständig, E-0 Weg 1) wurde nach E-8 am 10.11.2026 gelöscht; bei Bedarf als abgeleitetes,
verknüpftes Formular von OS.Strahlentherapie neu erstellen (Datenkatalog und Testdaten bestehen weiter).
Offene Fragen:
1. **Zielgebiet:** Onkostar hat zwei Felder in OS.StrahlentherapieEinzel:
   - „Zielgebiet“ (Hauptfeld, Katalog `CDA.Zielgebiet Strahlentherapie`, 138 Werte) mit **anderer Codesystematik**
     (1.1 = Hirnschädel, bei oBDS/nNGM 1.1 = Ganzhirn). Eine Übersetzung CDA → oBDS ist in der Datenbank nicht
     hinterlegt – wie Onkostar das für die oBDS-Meldung macht, ist unbekannt (Hersteller/Kollegen fragen).
   - „Zielgebiet LK“ (Mehrfachauswahl, `oBDS.Zielgebiete`): **98 von 99 nNGM-Codes identisch** (nNGM-Code vor dem
     `_`, z. B. `4.10_upperAbdomen` → `4.10`; es fehlt `unknown`), aber nur sichtbar bei „Radiatio
     Lymphknotenregion = ja“ und „Identische Meldung von LK-Bestrahlungen“.
   Welches Feld, und wird eine Übersetzung CDA → nNGM gebraucht?
2. **Mehrere Einzelbestrahlungen:** nNGM hat je Strahlentherapie mehrere Zielgebiete, aber nur eine Einzeldosis,
   eine Seite und einen Boost. Onkostar hat diese Werte je Einzelbestrahlung. Welcher Wert wird gemeldet, wenn
   sie sich unterscheiden?
3. **Einzeldosis (`singleDose`, ungelöst):** nNGM fragt die **Dosis pro Tag**, Onkostar speichert die **Dosis pro
   Fraktion**. Gleich ist das nur bei einer Fraktion pro Tag (Anhaltspunkt: „Konventionelle Fraktionierung“ = ja in
   OS.Strahlentherapie). Bei Hyperfraktionierung (z. B. 2 × 1,5 Gy am Tag = 3 Gy/Tag) ist die Tagesdosis nicht
   ableitbar – die Zahl der Fraktionen pro Tag wird nicht erfasst.
Ungelöst ohne Gegenstück: Freitext „Sonstiges“ zur Intention, Netzwerkstandort.

## E-5: Operation → OS.Operative Therapie (Arbeitsstand)            (04.11.2026)
Status: offen – OPS-Ableitung ist eine Vermutung und muss fachlich geprüft werden
Kontext: Bogen `operationTherapy`. Je Operation ein OS.Operative Therapie mit Status = durchgeführt (sonst sind
Intention, OPS und Komplikationen ausgeblendet). Direkt bzw. mit Werteübersetzung: OP-Datum, Intention
(oBDS-Codes), R-Klassifikation (gleiche Codes, andere Schreibweise), Bemerkung.
**Vermutung (nicht geprüft):** Resektionsart, Lymphadenektomie und Lokalisation lassen sich aus den OPS-Codes
im Unterformular OS.OPS ableiten (Code-Liste in `werte-mapping.csv`, abgeleitet aus dem OPS-Katalog 2024):
5-322 Keilresektion/atypisch, 5-323 Segment, 5-324/5-325 Lobektomie/Bilobektomie, 5-327/5-328 Pneumektomie,
Lymphadenektomie bei „mit radikaler Lymphadenektomie“ oder 5-401/5-404, Lokalisation über das OPS-Kapitel.
Metastasenresektion über das Feld „Metastasenresektion“. → **Prüfung durch Kodierung/Chirurgie nötig**,
außerdem jährlicher Abgleich mit neuen OPS-Versionen. Alternative (E-0, Weg 1): eigene nNGM-Felder mit nNGM-Codes.
Offene Fragen:
1. **Seite:** Die Werte passen 1:1 auf „Seite“ (`ADT.Seitenlokalisation`), das Feld ist in OS.Operative Therapie
   aber immer ausgeblendet (Filter `false`). Feld trotzdem nutzen, Seite der Erkrankung übernehmen oder anders?
Ungelöst ohne Gegenstück: `outcomeDeath` (Ausgang mit Todesfolge), Freitexte „Sonstiges“/„Andere“,
Netzwerkstandort.

## E-4: Systemische Therapie → OS.Systemische Therapie (Arbeitsstand)            (04.11.2026)
Status: offen – Frage zur Therapielinie noch nicht gestellt
Kontext: Bogen `systemicTherapy` hat drei Ebenen: Therapielinie (Intention, Stellung zur OP, ECOG, Studie,
bestes Ansprechen, Progresse) → Therapieschemata (Wirkstoffe, Beginn/Ende, Zyklen, Ende-Grund). Onkostar kennt
keine Linien-Ebene; `OS.Systemische Therapie` ist eine Therapie mit Substanzen als Unterformular.
Arbeitsstand: **ein OS.Systemische Therapie-Eintrag je Therapieschema**. Linienangaben (Intention, Stellung zur OP,
ECOG, Ergebnis) stehen bei jedem Schema der Linie und werden beim Export je Linie zusammengefasst; Linienbeginn/-ende
werden aus den Schemata abgeleitet. Die meisten Werte sind oBDS-Codes und passen direkt (Ergebnis 10/10 identisch);
der nNGM-Ende-Grund wird auf Beendigungsstatus + Abbruchgrund + Dosisreduktion + Substanzwechsel verteilt.
Offene Frage:
1. **Therapielinie:** Woran erkennt man, welche Schemata zu einer Linie gehören, und wo steht die Liniennummer –
   Zusatzfeld, Ableitung aus der zeitlichen Reihenfolge (fehleranfällig bei überlappenden/pausierten Therapien)
   oder eigenes Formular für die Linie? Davon hängen Linien-ID, Liniennummer, Linienbeginn/-ende ab.

**Substanzkatalog (`therapyName`, Status unvollständig):** nNGM liefert je Schema eine Liste von **ATC-Codes**;
Ziel ist das Unterformular OS.Substanz mit Katalog `OS.Substanzen` (einziger Standardkatalog mit ATC-Codes).
Der Katalog ist von 2013 (273 Werte): Es fehlen zentrale Lungenkrebs-Substanzen (Osimertinib, Pembrolizumab,
Nivolumab, Atezolizumab, Durvalumab, Alectinib, Lorlatinib, Brigatinib, Sotorasib, Selpercatinib, Amivantamab …),
und vorhandene Wirkstoffe haben noch die ATC-Codes vor der Umstellung 2022 (z. B. Erlotinib `L01XE03`, heute
`L01EB02`). Die OnkoZert-Kataloge `OZ.LZ.TKI`, `OZ.LZ.AntikörperImmun`, `OZ.LZ.SubtanzenChemo` (2023, 43 Werte)
haben die neuen Codes, gehören aber zu den OnkoZert-Formularen. → Klären, ob `OS.Substanzen` aktualisiert
(neue Version mit aktuellem ATC) oder alte → neue Codes über ein Werte-Mapping übersetzt werden.

Ungelöst, ohne Gegenstück in OS.Systemische Therapie: therapiefreie Zeit / Best Supportive Care, Therapieempfehlung
(liegt in OS.Tumorkonferenz, kein Verweis), Studie (OS.Studie ohne Register/Studien-ID/Therapiebezug), Off-Label-Use,
Erhaltungstherapie, Datum und Methode (RECIST) des besten Ansprechens. Progresse je Linie zurückgestellt bis zum Bogen
`progressRezidiv` (Kandidat OS.Verlauf + OS.FernmetastaseVerlauf).

## E-3: Tumormaterial → OS.Molekulargenetik (Arbeitsstand)            (04.11.2026)
Status: offen – Fragen noch nicht gestellt
Kontext: Bogen `tumorMaterial`. Auf ihn verweisen **13 Bögen** (`biopsyID`, in impalux `tumorMaterial`): beide
Histologien, Immunhistochemie (auch vorläufige), Lungenpanel, NGS-Fusion, ISH/FISH, Liquid Biopsy,
Resistenztestung, Fast Track, sonstige Untersuchungen, impalux. Onkostar hat kein eigenes Formular für eine Probe.
Arbeitsstand: Felder auf `OS.Molekulargenetik` (ein Eintrag = eine Einsendung, Untersuchungen als Unterformulare):
`biopsieID` → Einsendenummer, `extractionDate` → Entnahmedatum, `tumorCellContent` → Tumorzellgehalt,
`materialType` → Probenmaterial. Alle **vorläufig**; `extractionContext` und `pathologistName` **ungelöst**.
Offene Fragen:
1. **Wie entsteht der Verweis auf das Material?**
   - **A** Material = OS.Molekulargenetik. Molekulare Befunde sind dessen Unterformulare (Verweis =
     `hauptprozedur_id`), Pathologiebefunde werden beim Export über Einsendenummer (+ Entnahmedatum)
     zugeordnet. Keine neuen Formulare, aber nur so gut wie die Erfassung der Nummern.
   - **B** Eigenes Formular `NNGM.Tumormaterial`, alle Befundformulare bekommen einen Formularverweis darauf.
     Eindeutig, aber neues Formular plus Verweisfelder in OS-Standardformularen.
   - **C** Wie A, zusätzlich Formularverweis von OS.Pathologiebefund auf OS.Molekulargenetik. Eindeutig, aber
     Änderung am OS-Standardformular.
   B/C hängen an der Grundsatzfrage „OS-Formulare erweitern oder eigene nNGM-Formulare“. Ob A trägt, zeigt sich
   bei den molekularen Bögen.
2. **materialType:** nNGM kennt nur Gewebe (C12801) und Blut (C12434). Wie werden Aszites, Pleuraerguss,
   Liquor, Urin und Sonstiges aus `OS.Probenmaterial` exportiert – als Gewebe, gar nicht, oder Frage an nNGM?
3. **extractionContext** (ambulant/stationär/unbekannt): kein Feld in Onkostar. Prüfen, ob es sich aus
   Fall-/Aufenthaltsdaten am Entnahmedatum ableiten lässt.

## E-2: Histologie → OS.Pathologiebefund            (03.11.2026)
Status: vorläufig ([Rückfrage offen] zur Bedeutung der beiden Bögen)
Kontext: Bögen `histology` und `diagnosticHistology`, fast gleich aufgebaut.
Entscheidung: Je Listeneintrag ein OS.Pathologiebefund mit `Tumornachweis = ja` (sonst sind Histologie und
Grading im Formular ausgeblendet).
- `classification` → ICD-O3 Histologie (auch in `tumorDiagnosis`): Status **unvollständig** – Codes identisch,
  31 von 32 nNGM-Werten vorhanden, `C3812` (CUP, NCI-Code) fehlt. Das Schema nennt das Feld „Freitext“, gemeint
  ist aber ein Code aus der nNGM-Terminologie `icd03morphology`. Onkostar speichert ebenfalls nur den Code, der
  angezeigte Text kommt aus dem Katalog.
- `grading` → `ADT.Grading`, `G1`–`G4` → `1`–`4`, `GX` → `X`. **`G0` („Grading nicht vorgesehen“) → `T`
  („Trifft nicht zu“)**, weil `0` in `ADT.Grading`/oBDS „Malignes Melanom der Konjunktiva“ bedeutet und nur für
  dieses Grading-System gilt.
- `localization` → Entnahmestelle der Biopsie / ICD-O-3 Lokalisation, **vorläufig**: Die Werteliste (Lunge plus
  typische Metastasenorte, anders als die reine Lungenliste der Diagnose) spricht für den Entnahmeort, definiert
  ist das nirgends. Im Formular nur sichtbar bei Präparat = Biopsie.
- Wachstumsmuster Adenokarzinom: kein Gegenstück, **ungelöst** und vorerst zurückgestellt.
- `biopsyID` (Verweis auf Tumormaterial): ungelöst bis zur Entscheidung zum Bogen `tumorMaterial` (E-3).

## E-1: Tumorstadium → OS.Stadium, definitiver TNM            (03.11.2026)
Status: entschieden (Einzelfelder teils vorläufig/ungelöst, siehe `feld-mapping.csv`)
Kontext: Bogen `tumorStage`. OS.Stadium hat einen klinischen (`cTNM…`) und einen definitiven TNM-Block (`dTNM…`).
Beide sind nur sichtbar bei Erkrankungen der Kategorie „Solide“ (C34 gehört dazu) und im Bearbeitungsmodus,
der definitive Block zusätzlich erst nach „Definitive Beurteilung des Stadiums“.
Entscheidung: Je nNGM-Stadium-Eintrag ein OS.Stadium-Eintrag, TNM im **definitiven Block** mit
`definitiverTNM = ja`. TNM-Codes ohne Kategoriebuchstaben (T1a → 1a), Auflage nach `usedUiccVersion`.
Metastasen-Lokalisationen vorläufig in OS.FernmetastaseDiagnose/-Verlauf (OS.Lokalisation in OS.Stadium ist
nur für nicht-solide Tumoren gefiltert).
Begründung: nNGM liefert das Präfix c/p/u je Kategorie einzeln (gemischt, z. B. pT2 cN1 cM0) – das kann nur der
definitive Block abbilden; der klinische Block setzt c voraus.
Offen (im Projekt notiert): Felder ohne Version (`tumorSize`, `lymphNodesCount`, `metastasesState`, vorläufig wie V8),
`firstDiagnosis`, `curativeOperable`; Lücken T1mi, MX (Auflage 7), `cy`, TNM 9.

## Offene Fragen

- **Maßgeblich ist `nngm_schema/schema.xml`** (XSD des nNGM-eCRF-Importformats, Version 1.39.1.1139) – laut
  Rückfrage die genaueste Quelle. Es beschreibt genau das Format, in das ein Export aus Onkostar passen muss.
  Unterschiede zur Excel-Datei (Stand 03.09.2025):
  - 29 Bögen statt 45: **DigiNet-Bögen fehlen** (nicht Teil dieser Import-Schnittstelle); neu ist `impalux`.
  - Neue Felder, v. a. TNM-Auflage 9 (`stageDiagnosisV9`, `stageDiagnosisUnknown`, `tumorSizeV9` …) und
    FISH EGFR; `classification` ist Freitext (ICD-O-3-Morphologie) statt Auswahl.
  - Jeder Listeneintrag hat ein Pflichtfeld **`id`** („zum Referenzieren und Reidentifizieren in zukünftigen
    Importen“) → beim Export die Onkostar-`prozedur.id` des Eintrags verwenden.
  - Felder ohne `minOccurs="0"` sind im XSD Pflicht – im Bogen Diagnosen z. B. alle vier Stadium-Felder
    gleichzeitig, obwohl je nach UICC-Version nur eines zutrifft. **Beim nNGM klären**, wie nicht zutreffende
    Felder geliefert werden sollen.
  - Datumsfelder erlauben je nach Typ `JJJJ-MM-TT`, `JJJJ-MM` und `JJJJ` → passt zu Onkostars `_acc`
    (`exact`, `unk_d`, `unk_m`).

  **Umgesetzt:** `feld-mapping.csv` basiert seit 03.11.2026 auf dem Schema (`nngm-schema.mjs`), ergänzt um
  Labels/Hinweise aus der Excel-Datei. Alle bisherigen Entscheidungen wurden übernommen. Weggefallen sind 265
  Excel-Zeilen (v. a. DigiNet, ohne Entscheidungen).
  - Laut Schema sind auch **alle** Datenfelder Pflicht – nicht nur die Stadium-Felder. Die Frage an das nNGM
    betrifft also den ganzen Datensatz.
  - Einige Excel-„Autocomplete“-Felder sind laut Schema **Mehrfachauswahl** (z. B. Zielgebiet und Ende der
    Bestrahlung in der Strahlentherapie) – betrifft das bereits gebaute Formular NNGM.Strahlentherapie.
- **TNM-Auflage 9** ist in Onkostar 2.14.4 nicht hinterlegt (`OS.UICC-Stadium` endet mit Auflage 8 ab 2017).
  Die Auflage wird in Onkostar über die Katalogversion des Stadiums gespeichert, nicht als eigenes Feld.

- **Bestehende OS-Formulare erweitern oder eigene nNGM-Formulare anlegen?**
  Betrifft alle Bögen. Ein Mischweg wäre: Basisdaten (Diagnose, Histologie, Stadium, Therapien) in den
  OS-Standardformularen, nNGM-spezifische Bögen (Einwilligungen, Fast Track, Resistenztestung,
  Molekularpathologie-Details) als eigene Formulare.
- **DigiNet-Visiten**: Gehören sie zum Umfang oder erst einmal nur der nNGM-Fall?
- **Abbildung der Visiten**: Wie wird eine nNGM-Visite (nNGM-Fall, DigiNet Baseline, …) in Onkostar dargestellt –
  als eigenes Hauptformular mit Unterformularen je Bogen? Davon hängt auch die **nNGM-Fall-ID**
  (`nngm-case-id`) ab – Kandidat wäre die Erkrankung (`erkrankung.id`).
- **Netzwerkpartner** (`NngmNetworkPartner`, `NngmNetworkLocation`, `NngmNetworkPathologist`):
  Stammdaten in Onkostar (Organisationseinheiten/Kontakte) oder eigener Merkmalskatalog?
- **nNGM-Terminologien** (`collection: gene`, `ngsDnaPanel`, …) und **FHIR-ValueSets**
  (`http://uk-koeln.de/fhir/ValueSet/nNGM/...`): Woher kommen die vollständigen Wertelisten,
  und wie werden sie als Merkmalskataloge gepflegt?
- **Auffälligkeiten im nNGM-Schema** (an nNGM melden bzw. beim Export beachten):
  - `preliminaryFindingsImmunohistochemistry`: Napsin A nutzt die **NTRK-Antikörperliste** (`ntrkAntibody`) statt
    einer Napsin-A-Liste – vermutlich Kopierfehler.
  - Beide IHC-Bögen: Feldname **`anitbody`** statt `antibody` – Schreibfehler, beim Export aber genau so zu schreiben.
  - `ishFish`: Signalfelder heißen bei EGFR, ERBB2 und KRAS ebenfalls `…SignalCountMET…`, `…METToCEN…`,
    `…MeanMETPerCell` – offenbar aus dem MET-Block kopiert; gemeint ist das jeweils untersuchte Gen.

## Erkenntnisse

### nNGM-Datensatz (Excel)

- Aufbau: Visits → Instrument Relations → Instruments → Data Fields → Data Dictionary.
- Die Spalte `ML` in *Instrument Relations* markiert Instrumente, die mit der Mainzelliste zu tun haben –
  für das Mapping nicht relevant.
- In *Data Fields* stehen Instrumente nur mit ihrem Label, und Labels sind nicht eindeutig
  (z. B. zweimal „Histologie“, dreimal „ECOG“). Jedes Instrument bildet aber genau einen zusammenhängenden
  Block in derselben Reihenfolge wie im Blatt *Instruments*; darüber erfolgt die Zuordnung.
- Feldnamen sind nur innerhalb ihrer Gruppe eindeutig (z. B. `date`/`result` je Marker in der IHC).
  Eindeutiger Schlüssel ist daher `Instrument/Pfad/Feld` (`nngm_schluessel`).
- Manche Wertelisten heißen im *Data Dictionary* wie eine FHIR-ValueSet-URL; Codes sind teils LOINC
  (z. B. ECOG `LA9622-7`), während Onkostar eigene Codes nutzt (`0`–`5`) → Werte-Mapping nötig (Kategorie B).

### Speicherung von Formulardaten (geprüft am Testpatienten, Patient-ID 2)

Ein Testpatient mit Diagnose, BestOfTumor, Pathologiebefund, Molekulargenetik (mit Unterformularen
Sequenzierung und IHC), Systemischer Therapie (mit Nebenwirkung und Substanz) und Psychoonkologie-Screening.

- **Wiederholbare Listen → Unterformulare**: Jeder Eintrag ist eine eigene Prozedur mit
  `hauptprozedur_id` (Hauptformular) und `data_form_entry_id` (welches Unterformular-Feld). Damit lassen
  sich nNGM-Listen (Histologien, Therapielinien, IHC-Marker) abbilden, auch verschachtelt
  (Therapie → Substanz).
- **Erkrankungsbezug**: Alle Prozeduren hängen über `erkrankung_prozedur` an der Erkrankung, auch
  Unterformulare. Ein nNGM-Fall könnte darüber einer Erkrankung zugeordnet werden.
- **Teildaten**: `_acc` ist `varchar(10)`. Beobachtet:
  - `exact` – vollständiges Datum
  - `unk_d` – Tag unbekannt, gespeichert als 15. des Monats (`2013-06` → `2013-06-15`)
  - `unk_m` – Monat unbekannt (nur Jahr), gespeichert als Jahresmitte (`2020` → `2020-07-15`)
  - „Jahr unbekannt“ – im Formular wählbar, verlangt aber trotzdem die Eingabe eines Jahres. Das gespeicherte
    Datum ist dann ein Platzhalter und darf nicht als echtes Datum ausgewertet werden.
    Code vermutlich `unk_y` – noch nicht beobachtet.
  - `est_d` – Tag geschätzt, `est_m` – Monat geschätzt (Auswahl „geschätzt Tag/Monat/Jahr“ im Formular,
    nur bei Feldern mit `data_catalogue_entry.is_date_estimate_allowed`). Das Datum wird so gespeichert,
    wie es eingegeben wurde (beobachtet: `2008-07-13 est_d`, `2015-10-15 est_m`).
    Für „Jahr geschätzt“ ist der Code vermutlich `est_y` – noch nicht beobachtet.

  **Offene Frage:** nNGM kennt nur „Tag/Monat unbekannt“, aber keine Schätzung. Beim Export muss entschieden
  werden, ob ein geschätztes Datum als exakt übertragen oder auf die sichere Genauigkeit gekürzt wird
  (z. B. `est_d` → nur Monat/Jahr). Bei „Jahr unbekannt“ darf das Datum gar nicht übertragen werden –
  im nNGM-Format bleibt das Feld leer bzw. wird als unbekannt markiert, soweit das Feld das zulässt.

  nNGM-`MedicalDate` mit „needs day/month: no“ bzw. „can day/month be unknown“ lässt sich damit abbilden.
  Beim Export ins nNGM-Format muss `_acc` ausgewertet werden, sonst wird aus „2020“ fälschlich „15.07.2020“.
  Gilt auch für das Prozedurdatum (`prozedur.beginnzeitpunkt_acc`).
- **„Diagnose zuweisen“ ≠ Formularverweis**: Die Zuordnung eines Formulars zu einer Diagnose landet in
  `erkrankung_prozedur`. Formularverweise sind eigene Felder vom Typ `formReference` (z. B. in OS.Stadium
  „pTNM übernehmen“ → OS.Pathologiebefund, in OS.Systemische Therapie „Kombinierte Strahlentherapie“).
- `_acc` wird teils auch ohne Datum gesetzt (`entnahmedatum_acc = exact`, `entnahmedatum` leer),
  ebenso `_propcat_version` ohne Wert. Beim Auslesen immer die Wertspalte selbst prüfen.
- **Mehrfachauswahl**: bestätigt in `dk_molekulargenetik_merkmale` (`analysemethoden` = `S`, `I`) und
  `dk_systemtherapie_merkmale` (`therapiearten` = `A`, `I`).
- **Ja/Nein-Felder**: Katalog-Felder speichern den Katalog-Code (`OS.JaNein`: `1`/`0`), boolean-Felder
  direkt `0`/`1` ohne `_propcat_version`. Ausnahme: `dk_molekulargenuntersuchung.neuanlage = Ja`, obwohl
  `OS.JaNein` nur `1`/`0` kennt – vermutlich von einem Formularskript gesetzt. Nicht jeder gespeicherte Wert
  ist also ein gültiger Katalog-Code.
  → nNGM `yesNo` (`yes`/`no`) → `1`/`0`; bei Feldern mit Formularskript den tatsächlichen Wert prüfen.
- **Organisationseinheit**: `durchfuehrendeoe` + `durchfuehrendeoe_fachabteilung` (IDs).
- **Formularverweise** (`formReference`): Die Spalte (`int`) enthält direkt die `prozedur.id` des
  referenzierten Eintrags, abgesichert per Fremdschlüssel auf `prozedur.id`. Geprüft:
  `dk_stadium.pathobefundtnm = 3` (→ OS.Pathologiebefund), `dk_strahlentherapie.systemtherapie1 = 7`
  (→ OS.Systemische Therapie). Kein `_propcat_version`, keine Zwischentabelle.
  → nNGM-`ListEntryReference` (z. B. Histologie → Biopsie) lässt sich als `formReference` auf den Eintrag
  des referenzierten Formulars abbilden – vorausgesetzt, der referenzierte Listeneintrag ist selbst eine
  Prozedur (also ein Unterformular-Eintrag).
- Formularverweise sind in den OS-Formularen oft nur unter Bedingungen sichtbar (Filter in
  `data_form_entry_filter`), „Kombinierte Strahlentherapie“ in OS.Systemische Therapie sogar nie (`false`).

### Onkostar-Datenbank

- Datenkatalog `X` → Tabelle `dk_x`, Feld `Y` → Spalte `y`; `dk_x.id` ist Fremdschlüssel auf `prozedur.id`.
- Mehrfachauswahl-Felder liegen in `dk_x_merkmale` (`eintrag_id` → `dk_x.id`, `feldname`, `feldwert`).
- Die Spalte `data_catalogue_entry.property_catalogue_version_entry_id` verweist trotz ihres Namens auf
  `property_catalogue.id`.
- 284 Datenkatalog-Felder haben keine Spalte in der DB (u. a. Adjumed-Kataloge ohne Tabelle) –
  siehe `onkostar-bestand/datenkatalog-felder.csv`, Spalte `spalte_vorhanden`.
- `configs/server.cnf` wird von MariaDB ignoriert („World-writable config file … is ignored“), weil die
  Datei unter Windows mit zu offenen Rechten eingebunden wird. Einstellungen daraus greifen derzeit nicht.
