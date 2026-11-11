# nNGM → Onkostar: Mapping

Zentrales Mapping-Dokument: wie jedes Feld des nNGM-Datensatzes in Onkostar abgebildet wird, was entschieden ist
und was noch offen ist.

> **Erzeugt** am 2026-11-11 mit `node mapping/tools/mapping-dokument.mjs` aus `feld-mapping.csv`,
> `werte-mapping.csv` und `entscheidungen.md`. Nicht von Hand bearbeiten – Änderungen in den Quelldateien
> vornehmen (Feldentscheidungen per `node mapping/tools/entscheidung.mjs`) und das Dokument neu erzeugen.

Grundlage: nNGM-eCRF-Importschema `nngm_schema/schema.xml` (Version 1.39.1.1139), Onkostar 2.14.4.

## Inhalt

- [Gesamtstand](#gesamtstand)
- [Legende](#legende)
- [Generelle Informationen und Fragen](#generelle-informationen-und-fragen)
- [Stammdaten, Vitalstatus und Fall](#stammdaten-vitalstatus-und-fall)
  - [nNGM Fall spezifische Daten (`nngm-case`)](#nngm-fall-spezifische-daten-nngm-case)
  - [patient (`patient`)](#patient-patient)
  - [Krankenkasse (`healthCoverage`)](#krankenkasse-healthcoverage)
  - [Vitalstatus (`vitalStatus`)](#vitalstatus-vitalstatus)
  - [Raucherstatus (`smokerStatus`)](#raucherstatus-smokerstatus)
  - [ECOG (`ecog`)](#ecog-ecog)
- [Diagnose, Stadium und Histologie](#diagnose-stadium-und-histologie)
  - [Diagnosen (`tumorDiagnosis`)](#diagnosen-tumordiagnosis)
  - [Tumorstadium (`tumorStage`)](#tumorstadium-tumorstage)
  - [Histologie (`histology`)](#histologie-histology)
  - [Histologie (`diagnosticHistology`)](#histologie-diagnostichistology)
- [Tumormaterial](#tumormaterial)
  - [Tumormaterial (`tumorMaterial`)](#tumormaterial-tumormaterial)
- [Therapien](#therapien)
  - [Systemische Therapie (`systemicTherapy`)](#systemische-therapie-systemictherapy)
  - [Operation (`operationTherapy`)](#operation-operationtherapy)
  - [Strahlentherapie (`radioTherapy`)](#strahlentherapie-radiotherapy)
- [Verlauf und Molekularpathologie](#verlauf-und-molekularpathologie)
  - [Rezidiv/Progress + Resistenztestung (`progressRezidiv`)](#rezidivprogress--resistenztestung-progressrezidiv)
  - [NGS DNA Panel (`lungPanel`)](#ngs-dna-panel-lungpanel)
  - [NGS RNA Panel (`ngsFusion`)](#ngs-rna-panel-ngsfusion)
  - [Fast Track (`fastTrack`)](#fast-track-fasttrack)
  - [Liquid Biopsy (`liquidBiopsy`)](#liquid-biopsy-liquidbiopsy)
  - [Resistenztestung (`resistanceTesting`)](#resistenztestung-resistancetesting)
  - [ISH/FISH (`ishFish`)](#ishfish-ishfish)
  - [Immunhistochemie (`immunohistochemistry`)](#immunhistochemie-immunohistochemistry)
  - [Immunhistochemie (`preliminaryFindingsImmunohistochemistry`)](#immunhistochemie-preliminaryfindingsimmunohistochemistry)
  - [Sonstige Untersuchungen (`otherExamination`)](#sonstige-untersuchungen-otherexamination)
  - [Nicht-standard nNGM Untersuchungen (`preliminaryOtherExaminations`)](#nicht-standard-nngm-untersuchungen-preliminaryotherexaminations)
- [nNGM-spezifische Bögen](#nngm-spezifische-bögen)
  - [Eckdaten der Anforderung (`diagnosticsRequest`)](#eckdaten-der-anforderung-diagnosticsrequest)
  - [MURIPEDIA Therapie Information (`assessment`)](#muripedia-therapie-information-assessment)
  - [Therapieinformation (`TherapyInformation`)](#therapieinformation-therapyinformation)
  - [Patientenportal (`nngmPortal`)](#patientenportal-nngmportal)
  - [IMPALUX (`impalux`)](#impalux-impalux)
  - [Zustimmungen nNGM (`consents`)](#zustimmungen-nngm-consents)

## Gesamtstand

| Status | Felder | Anteil |
|---|---:|---:|
| bestätigt | 24 | 2 % |
| vorläufig | 619 | 52 % |
| unvollständig | 31 | 3 % |
| ungelöst | 523 | 44 % |
| offen | 0 | 0 % |
| **gesamt** | **1197** | |

| Bogen | Felder | bestätigt | vorläufig | unvollständig | ungelöst | offen | Entscheidung |
|---|---:|---:|---:|---:|---:|---:|---|
| [nNGM Fall spezifische Daten](#nngm-fall-spezifische-daten-nngm-case) | 1 |  |  |  | 1 |  | E-7 |
| [patient](#patient-patient) | 2 |  | 2 |  |  |  | E-7 |
| [Krankenkasse](#krankenkasse-healthcoverage) | 2 |  |  |  | 2 |  | E-7 |
| [Vitalstatus](#vitalstatus-vitalstatus) | 11 | 1 | 8 | 2 |  |  | E-7 |
| [Raucherstatus](#raucherstatus-smokerstatus) | 4 |  | 4 |  |  |  | E-7 |
| [ECOG](#ecog-ecog) | 2 |  | 2 |  |  |  | E-7 |
| [Diagnosen](#diagnosen-tumordiagnosis) | 12 | 3 | 5 | 1 | 3 |  | E-1, E-2 |
| [Tumorstadium](#tumorstadium-tumorstage) | 34 | 14 | 11 |  | 9 |  | E-1, E-2 |
| [Histologie](#histologie-histology) | 17 | 1 | 6 | 1 | 9 |  | E-1, E-2 |
| [Histologie](#histologie-diagnostichistology) | 19 | 1 | 8 | 1 | 9 |  | E-1, E-2 |
| [Tumormaterial](#tumormaterial-tumormaterial) | 9 | 1 | 6 |  | 2 |  | E-3 |
| [Systemische Therapie](#systemische-therapie-systemictherapy) | 50 | 1 | 39 | 1 | 9 |  | E-4, E-5, E-6 |
| [Operation](#operation-operationtherapy) | 20 | 1 | 17 |  | 2 |  | E-4, E-5, E-6 |
| [Strahlentherapie](#strahlentherapie-radiotherapy) | 24 | 1 | 20 |  | 3 |  | E-4, E-5, E-6 |
| [Rezidiv/Progress + Resistenztestung](#rezidivprogress--resistenztestung-progressrezidiv) | 130 |  | 64 | 11 | 55 |  | E-9 |
| [NGS DNA Panel](#ngs-dna-panel-lungpanel) | 37 |  | 28 | 1 | 8 |  | E-9 |
| [NGS RNA Panel](#ngs-rna-panel-ngsfusion) | 35 |  | 26 | 1 | 8 |  | E-9 |
| [Fast Track](#fast-track-fasttrack) | 108 |  | 92 | 12 | 4 |  | E-9 |
| [Liquid Biopsy](#liquid-biopsy-liquidbiopsy) | 32 |  | 27 |  | 5 |  | E-9 |
| [Resistenztestung](#resistenztestung-resistancetesting) | 58 |  | 49 |  | 9 |  | E-9 |
| [ISH/FISH](#ishfish-ishfish) | 126 |  | 52 |  | 74 |  | E-9 |
| [Immunhistochemie](#immunhistochemie-immunohistochemistry) | 85 |  | 50 |  | 35 |  | E-9 |
| [Immunhistochemie](#immunhistochemie-preliminaryfindingsimmunohistochemistry) | 85 |  | 50 |  | 35 |  | E-9 |
| [Sonstige Untersuchungen](#sonstige-untersuchungen-otherexamination) | 13 |  | 9 |  | 4 |  | E-9 |
| [Nicht-standard nNGM Untersuchungen](#nicht-standard-nngm-untersuchungen-preliminaryotherexaminations) | 13 |  | 9 |  | 4 |  | E-9 |
| [Eckdaten der Anforderung](#eckdaten-der-anforderung-diagnosticsrequest) | 23 |  | 20 |  | 3 |  | E-10 |
| [MURIPEDIA Therapie Information](#muripedia-therapie-information-assessment) | 11 |  | 11 |  |  |  | E-10 |
| [Therapieinformation](#therapieinformation-therapyinformation) | 4 |  | 4 |  |  |  | E-10 |
| [Patientenportal](#patientenportal-nngmportal) | 1 |  |  |  | 1 |  | E-10 |
| [IMPALUX](#impalux-impalux) | 62 |  |  |  | 62 |  | E-10 |
| [Zustimmungen nNGM](#zustimmungen-nngm-consents) | 167 |  |  |  | 167 |  | E-10 |

## Legende

**Status**

| Status | Bedeutung |
|---|---|
| bestätigt | Zuordnung stimmt |
| vorläufig | stimmt vermutlich, Restfrage im Kommentar |
| unvollständig | Ziel stimmt, deckt aber nicht alle nNGM-Werte ab |
| ungelöst | Lösung muss noch gefunden werden |
| offen | noch nicht besprochen |

**Kategorie**

| Kategorie | Bedeutung |
|---|---|
| A | Vorhandenes Onkostar-Feld passt direkt |
| B | Vorhandenes Feld passt, Werte müssen übersetzt werden (siehe Werteübersetzungen) |
| C | Kein passendes Feld → neues Feld (nNGM-Erweiterungskatalog, E-8) bzw. eigenes nNGM-Formular (E-10) |
| D | Abgeleitet bzw. Plugin-Logik (berechnet, aus anderen Feldern ermittelt, Netzwerkpartner) |
| X | Wird nicht übernommen |
| Struktur | Liste/Gruppe – Abschnitt bzw. Formulareintrag, keine eigene Datenspalte |

Markierungen in den Bemerkungen: **[Rückfrage offen]** = Frage ist gestellt, Antwort steht aus;
**VERMUTUNG** / **ANNAHME** = muss fachlich geprüft werden; **Option E-8** = mögliche Lösung über ein abgeleitetes
Formular mit Erweiterungskatalog.

## Generelle Informationen und Fragen

### Vorgehen in Kürze

- Jedes nNGM-Feld bekommt in `feld-mapping.csv` Kategorie, Onkostar-Ziel (Formular, Datenkatalog, Feld,
  Merkmalskatalog), Status und Bemerkung. Werteübersetzungen stehen in `werte-mapping.csv`.
- **Richtung:** Das Mapping beschreibt den Weg Onkostar → nNGM (Export ins nNGM-Importformat).
- **Erfassung:** OS-Standardformulare als Basis, nNGM-Formulare erben davon (E-8); nNGM-Ausprägungen für neue Felder
  (E-0); nNGM-spezifische Bögen als eigene Formulare (E-10).
- Werkzeuge und Datenmodell: siehe `mapping/README.md`, OSC-Format: `osc_exports/OSC-FORMAT.md`.

### Grundsatzentscheidungen

#### E-8: OS-Formulare als Basis, nNGM-Formulare „erben“ davon (05.11.2026, Rückmeldung Projektteam)

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

##### Fragen an den Hersteller (gestellt bzw. vorbereitet, Testbericht vom 05.11.2026)
1. **Registermeldung/Kennzahlen:** Zählen Einträge verknüpfter Formulare bei oBDS-Meldung, OnkoZert-Kennzahlen
   und Auswertungen wie Einträge des OS-Formulars?
2. **Updates:** Wie kommen Hersteller-Änderungen am OS-Formular ins verknüpfte Formular („Zuordnen und
   aktualisieren“)? Warum bricht „Automatisch zuordnen“ mit einer NullPointerException ab?
3. **GUIDs:** Sind die GUIDs der OS-Standardformulare in allen Installationen gleich?

##### Antworten des Herstellers (11.11.2026)
1. **Registermeldung/Kennzahlen:** „Es sollte funktionieren.“ Einträge verknüpfter Formulare werden wie Einträge des
   OS-Formulars behandelt. → Frage 1 = **ja** (Einschränkung „sollte“: bei der ersten echten oBDS-Meldung bzw.
   Kennzahlenauswertung mit einem nNGM-Eintrag gezielt prüfen).
2. **Updates:** Änderungen am Originalformular werden **automatisch** in verknüpfte Formulare eingespielt; Onkostar
   erkennt verknüpfte Formulare. → Kein manuelles Nachziehen bei Onkostar-Updates. (Zur NullPointerException bei
   „Automatisch zuordnen“ gab es keine eigene Aussage; Verknüpfung per OSC-Import funktioniert ohne diesen Schritt.)
3. **GUIDs:** Die GUIDs der OS-Standardformulare sind in allen Installationen **gleich**. → Eine OSC-Datei mit
   `VerknuepftGUID` ist an allen Standorten unverändert importierbar.
Damit gilt unten der Fall „Frage 1 = ja“; die Fälle für Frage 2/3 = nein entfallen.

##### Auswirkungen auf bisherige Mappings – was je nach Antwort anzupassen ist
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

#### E-0: nNGM-Codes oder oBDS-Codes? (04.11.2026, Rückmeldung eines Kollegen)

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

#### E-11: Formular-Konventionen in Onkostar (11.11.2026, Rückmeldung)

Status: entschieden
- **Datum:** Jedes (Haupt-)Formular braucht in Onkostar ein Datumsfeld (Prozedurdatum). Hat der nNGM-Bogen keins,
  wird ein **Onkostar-eigenes Datumsfeld** ergänzt, das **beim Export weggelassen** wird (umgesetzt bei
  `NNGM.Therapieinformation`). **Unterformulare** brauchen kein Datum (z. B. `NNGM.Anforderung.Behandler`; die
  Import-Warnung „steht für die Tumordokumentation nicht zur Verfügung“ ist dort unkritisch).
- **Eigene Menükategorien** (z. B. „nNGM“, „nNGM Therapien“) werden direkt in der Datenbank angelegt:
  `INSERT INTO data_form_menu_category (name, position, column) VALUES ('nNGM', '3', '1')`. In der OSC-Datei verweist
  das Formular per Name darauf (`<MenuCategory><name>nNGM</name>…`). **Lokal angelegt am 11.11.2026** (ID 10,
  Position 3, Spalte 1); alle nNGM-Formulare stehen in dieser Kategorie.

### Gestellte Rückfragen

Fragen, die bereits gestellt wurden und auf Antwort warten. Betroffene Zeilen in `feld-mapping.csv` haben
im Kommentar `[Rückfrage offen]`.

| Gestellt | An | Frage | Betrifft |
|---|---|---|---|
| 03.11.2026 | Projekt | Felder ohne Version (`tumorSize`, `lymphNodesCount`, `metastasesState`) – Altfelder? `firstDiagnosis`, `curativeOperable` – wie abbilden? | `tumorStage` |
| 03.11.2026 | Projekt | Bedeutung von `histology` vs. `diagnosticHistology` („Netzwerkzentrum“): beide in OS.Pathologiebefund, wie unterscheiden? Gilt ebenso für Vorbefunde vs. Befunde der Immunhistochemie. | `histology`, `diagnosticHistology`, `preliminaryFindingsImmunohistochemistry`, `immunohistochemistry`, `preliminaryOtherExaminations`, `otherExamination` |

### Allgemeine offene Fragen

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

## Stammdaten, Vitalstatus und Fall

<details>
<summary><b>E-7</b> – Stammdaten, Vitalstatus, Raucherstatus, ECOG, Krankenversicherung (Arbeitsstand) (05.11.2026)</summary>

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

</details>

### nNGM Fall spezifische Daten (`nngm-case`)

1 Felder – 1 ungelöst. Entscheidungen: E-7.

#### Ungelöst (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `nngm-case-id` | ID des nNGM-Falls | EntryId |  |  | hängt an der Grundsatzfrage „Abbildung der Visiten“ (Kandidat: erkrankung.id) |

### patient (`patient`)

2 Felder – 2 vorläufig. Entscheidungen: E-7.

#### Vorläufig (2)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `birthdate` | Geburtsdatum | Date | A | (Patientenstammdaten) → geburtsdatum | nNGM verlangt vollständiges Datum, Onkostar erlaubt Teildaten (geburtsdatum_acc) |
| `gender` | Geschlecht | Enumeration | B | (Patientenstammdaten) → geschlecht (System.Geschlecht) | w/m/d/u eindeutig; x („Sonstiges / Intersexuell“) → other?; nNGM X (Unbestimmt) ohne Gegenstück |

#### Werteübersetzungen

**`gender`** – Geschlecht

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| female | Weiblich | System.Geschlecht |  | w | Weiblich | vorläufig |  |
| male | Männlich | System.Geschlecht |  | m | Männlich | vorläufig |  |
| D | Divers | System.Geschlecht |  | d | Divers | vorläufig |  |
| unknown | Unbekannt | System.Geschlecht |  | u | Unbekannt | vorläufig |  |
| other | Sonstige | System.Geschlecht |  | x | Sonstiges / Intersexuell | vorläufig | Bedeutung nicht ganz gleich |
| X | Unbestimmt | System.Geschlecht |  |  |  | ungelöst | kein Gegenstück |

### Krankenkasse (`healthCoverage`)

2 Felder – 2 ungelöst. Entscheidungen: E-7.

#### Ungelöst (2)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `name` | Krankenkasse | Enumeration | B | (Patientenstammdaten) → krankenkassennummer (IK) → krankenkasse.bezeichnung | Onkostar speichert IK-Nummer (3700 Einträge je Geschäftsstelle), nNGM erwartet Namen aus 191er-Liste (68 exakt, 50 als Namensanfang gefunden) → Übersetzungstabelle IK → nNGM-Name nötig |
| `pkvTarifform` | PKV-Tarifform | Enumeration | C |  | kein Feld (OZ.LZ.Versicherungsform kennt nur gesetzlich/privat) |

### Vitalstatus (`vitalStatus`)

11 Felder – 1 bestätigt, 8 vorläufig, 2 unvollständig. Entscheidungen: E-7.

#### Bestätigt (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `observationList/observation/id` | ID des Listeneintrags | EntryId | A | → prozedur.id |  |

#### Vorläufig (6)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `lastContactDate` | Datum letzter Kontakt | MedicalDate | A | OS.Abschluss → LetzterKontakt bzw. patient.letzte_information | Quelle offen: Stammdaten oder OS.Abschluss (E-7 Frage 1) |
| `lostToFollowUp` | lost to follow up | Enumeration | D | OS.Abschluss → Status = F (OS.Vitalstatus) | Quelle offen: Stammdaten oder OS.Abschluss (E-7 Frage 1) |
| `deceased` | Ist Verstorben | Enumeration | D | OS.Abschluss → Sterbedatum vorhanden bzw. Status = V | Quelle offen: Stammdaten oder OS.Abschluss (E-7 Frage 1) |
| `deceasedDate` | Todesdatum | MedicalDate | A | OS.Abschluss → Sterbedatum bzw. patient.sterbedatum | Quelle offen: Stammdaten oder OS.Abschluss (E-7 Frage 1) |
| `observationList/observation/date` | Erhebungsdatum | MedicalDate | A | OS.Abschluss → Datum (Prozedurdatum) |  |
| `observationList/observation/vitalState` | Vitalstatus | Enumeration | B | OS.Abschluss → Status (OS.Vitalstatus) | L → L, F → A, V → T |

#### Unvollständig (2)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `lastContactInformationSource` | Informationsquelle zum letzten Kontakt | Enumeration | B | OS.Abschluss → Quelle bzw. patient.quelleVitalstatus (OS.QuelleVitalstatus) | Quelle offen: Stammdaten oder OS.Abschluss (E-7 Frage 1); nur KIS und Krebsregister eindeutig, Rest siehe werte-mapping.csv; Onkostar hat nur ein Quellenfeld für Kontakt und Tod |
| `deathInformationSource` | Informationsquelle zum Tod | Enumeration | B | OS.Abschluss → Quelle bzw. patient.quelleVitalstatus (OS.QuelleVitalstatus) | Quelle offen: Stammdaten oder OS.Abschluss (E-7 Frage 1); nur KIS und Krebsregister eindeutig, Rest siehe werte-mapping.csv |

<details>
<summary>Strukturelemente (2: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `observationList` | Beobachtungen Vitalstatus | List | Struktur | OS.Abschluss | je Beobachtung ein OS.Abschluss |
| `observationList/observation` | Beobachtung Vitalstatus | ListEntry (mehrfach) | Struktur | OS.Abschluss |  |

</details>

#### Werteübersetzungen

**`lastContactInformationSource`** – Informationsquelle zum letzten Kontakt

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| Krankenhausinformationssystem | Krankenhausinformationssystem | OS.QuelleVitalstatus |  | kis | KIS | vorläufig | eindeutig |
| Krebsregister | Krebsregister | OS.QuelleVitalstatus |  | kreg | Krebsregister | vorläufig | eindeutig |
| Kontakt Behandler | Kontakt Behandler | OS.QuelleVitalstatus |  | n? | Niedergelassener Arzt | ungelöst | nur Text des Onkostar-Codes bekannt, inhaltliche Gleichheit nicht bestätigt |
| Dokumentar | Dokumentar | OS.QuelleVitalstatus |  | tudok? | Tumordokumentation | ungelöst | nur Text des Onkostar-Codes bekannt, inhaltliche Gleichheit nicht bestätigt |
| Arztbrief | Arztbrief | OS.QuelleVitalstatus |  |  |  | ungelöst | kein Gegenstück |
| Kontakt Krankenkasse | Kontakt Krankenkasse | OS.QuelleVitalstatus |  |  |  | ungelöst | kein Gegenstück |
| Kontakt Angehörige | Kontakt Angehörige | OS.QuelleVitalstatus |  |  |  | ungelöst | kein Gegenstück |
| Andere hausinterne Datenbanken | Andere hausinterne Datenbanken | OS.QuelleVitalstatus |  |  |  | ungelöst | kein Gegenstück |
|  |  | OS.QuelleVitalstatus |  | a, k, m, r, tb, s, u, HL7 | Autopsie, Krankenhaus, Meldeamt, Reha, Todesbescheinigung, Sonstiges, Unbekannt, HL7 | ungelöst | kein nNGM-Wert |

**`deathInformationSource`** – Informationsquelle zum Tod

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| Krankenhausinformationssystem | Krankenhausinformationssystem | OS.QuelleVitalstatus |  | kis | KIS | vorläufig | eindeutig |
| Krebsregister | Krebsregister | OS.QuelleVitalstatus |  | kreg | Krebsregister | vorläufig | eindeutig |
| Kontakt Behandler | Kontakt Behandler | OS.QuelleVitalstatus |  | n? | Niedergelassener Arzt | ungelöst | nur Text des Onkostar-Codes bekannt, inhaltliche Gleichheit nicht bestätigt |
| Dokumentar | Dokumentar | OS.QuelleVitalstatus |  | tudok? | Tumordokumentation | ungelöst | nur Text des Onkostar-Codes bekannt, inhaltliche Gleichheit nicht bestätigt |
| Arztbrief | Arztbrief | OS.QuelleVitalstatus |  |  |  | ungelöst | kein Gegenstück |
| Kontakt Krankenkasse | Kontakt Krankenkasse | OS.QuelleVitalstatus |  |  |  | ungelöst | kein Gegenstück |
| Kontakt Angehörige | Kontakt Angehörige | OS.QuelleVitalstatus |  |  |  | ungelöst | kein Gegenstück |
| Andere hausinterne Datenbanken | Andere hausinterne Datenbanken | OS.QuelleVitalstatus |  |  |  | ungelöst | kein Gegenstück |
| Internet (Todesanzeigen) | Internet (Todesanzeigen) | OS.QuelleVitalstatus |  | z? | Zeitung | ungelöst | nur Text des Onkostar-Codes bekannt, inhaltliche Gleichheit nicht bestätigt |
|  |  | OS.QuelleVitalstatus |  | a, k, m, r, tb, s, u, HL7 | Autopsie, Krankenhaus, Meldeamt, Reha, Todesbescheinigung, Sonstiges, Unbekannt, HL7 | ungelöst | kein nNGM-Wert |

**`observationList/observation/vitalState`** – Vitalstatus

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| L | lebt | OS.Vitalstatus |  | L | am Leben | vorläufig |  |
| A | lost to follow-up | OS.Vitalstatus |  | F | Lost-to-follow-up | vorläufig |  |
| T | verstorben | OS.Vitalstatus |  | V | Verstorben | vorläufig |  |

### Raucherstatus (`smokerStatus`)

4 Felder – 4 vorläufig. Entscheidungen: E-7.

#### Vorläufig (3)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `smokerStatusGroup/smokingState` | Raucherstatus | Enumeration | B | OS.Anamnese → Raucher (OS.Raucher) | Raucher → G, Ex → E, Nie → N, unknown → U; P (Passivraucher) ohne nNGM-Wert; Zeitpunkt „zur Anforderung“: welcher Wert/welches Formular? (E-7 Frage 2) |
| `smokerStatusGroup/nonSmokerSince` | Nichtraucher seit | Integer | D | OS.Anamnese → RauchenAufgehoert | abgeleitet: Jahre zwischen „Mit dem Rauchen aufgehört am“ und Anforderungsdatum; Zeitpunkt „zur Anforderung“: welcher Wert/welches Formular? (E-7 Frage 2) |
| `smokerStatusGroup/packYears` | Pack years | Decimal | A | OS.Anamnese → Packyears | Zeitpunkt „zur Anforderung“: welcher Wert/welches Formular? (E-7 Frage 2) |

<details>
<summary>Strukturelemente (1: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `smokerStatusGroup` | Raucherstatus zur Anforderung | FieldGroup | Struktur | OS.Anamnese |  |

</details>

#### Werteübersetzungen

**`smokerStatusGroup/smokingState`** – Raucherstatus

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| LA18979-7 | Raucher | OS.Raucher |  | G | Ja, gegenwärtig | vorläufig |  |
| LA15920-4 | Ex-Raucher | OS.Raucher |  | E | Ja, Ex-Raucher | vorläufig |  |
| LA18978-9 | Nieraucher | OS.Raucher |  | N | Nein (noch nie) | vorläufig |  |
| unknown | Unbekannt | OS.Raucher |  | U | Unbekannt | vorläufig |  |
|  |  | OS.Raucher |  | P | Ja, Passivraucher | ungelöst | kein nNGM-Wert |

### ECOG (`ecog`)

2 Felder – 2 vorläufig. Entscheidungen: E-7.

#### Vorläufig (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `ecogGroup/ecog` | ECOG | Enumeration | B | OS.Verlauf / OS.Diagnose / OS.Untersuchung / Therapien → Leistungszustand bzw. ECOGvorTherapie (ADT.LeistungszustandECOG) | LOINC → 0–5, unknown → U; Zeitpunkt „zur Anforderung“: welcher Wert/welches Formular? (E-7 Frage 2) |

<details>
<summary>Strukturelemente (1: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `ecogGroup` | ECOG | FieldGroup | Struktur |  |  |

</details>

#### Werteübersetzungen

**`ecogGroup/ecog`** – ECOG

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| LA9622-7 | ECOG 0 | ADT.LeistungszustandECOG |  | 0 | 0 | bestätigt |  |
| LA9623-5 | ECOG 1 | ADT.LeistungszustandECOG |  | 1 | 1 | bestätigt |  |
| LA9624-3 | ECOG 2 | ADT.LeistungszustandECOG |  | 2 | 2 | bestätigt |  |
| LA9625-0 | ECOG 3 | ADT.LeistungszustandECOG |  | 3 | 3 | bestätigt |  |
| LA9626-8 | ECOG 4 | ADT.LeistungszustandECOG |  | 4 | 4 | bestätigt |  |
| LA9627-6 | ECOG 5 | ADT.LeistungszustandECOG |  | 5 | 5 | bestätigt |  |
| unknown | Unbekannt | ADT.LeistungszustandECOG |  | U | Unbekannt | bestätigt |  |

## Diagnose, Stadium und Histologie

<details>
<summary><b>E-1</b> – Tumorstadium → OS.Stadium, definitiver TNM (03.11.2026)</summary>

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

</details>

<details>
<summary><b>E-2</b> – Histologie → OS.Pathologiebefund (03.11.2026)</summary>

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

</details>

### Diagnosen (`tumorDiagnosis`)

12 Felder – 3 bestätigt, 5 vorläufig, 1 unvollständig, 3 ungelöst. Entscheidungen: E-1, E-2.

#### Bestätigt (3)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `diagnosisList/diagnosis/id` | ID des Listeneintrags | EntryId | A | OS.Diagnose → prozedur.id | ID der OS.Diagnose-Prozedur; nNGM erkennt die Diagnose darüber bei erneutem Import wieder |
| `diagnosisList/diagnosis/diagnosisDate` | Diagnosedatum | MedicalDate | A | OS.Diagnose → Diagnose.Diagnosedatum | Schema: Muster JJJJ-MM-TT \| JJJJ-MM \| JJJJ. Export aus Onkostar: diagnosedatum_acc exact -> JJJJ-MM-TT, unk_d -> JJJJ-MM, unk_m -> JJJJ |
| `diagnosisList/diagnosis/localization` | Lokalisation | Enumeration | A | OS.Diagnose → Diagnose.ICDO3Lokalisation (ICD-O-3 Lokalisation) | Alle 6 nNGM-Codes (C34.0-C34.9) identisch im Katalog; Vorschlag des Skripts (Fernmetastase) war falsch |

#### Vorläufig (3)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `diagnosisList/diagnosis/diagnosisType` | Art der Diagnose | Enumeration | C | NNGM.Diagnose (abgeleitet von OS.Diagnose, noch nicht gebaut) → diagnosisType | Enum firstDiagnosis/furtherDiagnosis. Kein Gegenstück in Onkostar; Bedeutung von furtherDiagnosis klären (weiterer Primärtumor -> weitere OS.Diagnose, ableitbar über Reihenfolge; Diagnoseänderung -> Feld Diagnoseveraenderung).; Ziel Erweiterungskatalog des abgeleiteten Formulars (E-8, Herstellerantwort 11.11.2026) |
| `diagnosisList/diagnosis/stageDiagnosisV7` | Stadium der Diagnose | Enumeration | B | OS.Stadium → Stadium.UICCStadium (OS.UICC-Stadium) | Schema: UiccV7EnumType = 0,IA,IB,IIA,IIB,IIIA,IIIB,IV,unknown (wie Excel). Alle in Auflage 7; unknown -> X. Offen: Ziel OS.Stadium (Datum = Diagnosedatum) bestätigen; wählt Onkostar die Auflage automatisch nach Datum? |
| `diagnosisList/diagnosis/stageDiagnosisV8` | Stadium der Diagnose | Enumeration | B | OS.Stadium → Stadium.UICCStadium (OS.UICC-Stadium) | Schema: UiccV8EnumType = 0,IA1,IA2,IA3,IB,IIA,IIB,IIIA,IIIB,IIIC,IV,IVA,IVB,unknown (ohne IA, wie Excel; v9 ist ein eigenes Feld stageDiagnosisV9). Alle in Auflage 8; unknown -> X. Offen wie bei stageDiagnosisV7. |

#### Unvollständig (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `diagnosisList/diagnosis/classification` | Klassifikation | Terminology | A | OS.Diagnose → ICDO3Histologie (ICD-O-3 Histologie) | Codes identisch (31 von 32 nNGM-Werten im Katalog, Version 1399); C3812 (CUP, NCI-Code) fehlt; nur Code gespeichert, Text aus Katalog |

#### Ungelöst (3)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `diagnosisList/diagnosis/usedUiccVersion` | genutzte UICC Version | Enumeration | B | OS.Stadium → (abgeleitet aus Stadium.UICCStadium_propcat_version) | Schema: version7/version8/version9/unknown. Onkostar speichert die TNM-Auflage als Katalogversion von OS.UICC-Stadium (961=Auflage 7, 962=Auflage 8). Auflage 9 gibt es in Onkostar 2.14.4 nicht; unknown hat kein Gegenstück. |
| `diagnosisList/diagnosis/stageDiagnosisV9` | Stadium der Diagnose | Enumeration | B | OS.Stadium → Stadium.UICCStadium (OS.UICC-Stadium) | Schema: UiccV9EnumType = 0,IA,IA1,IA2,IA3,IB,IIA,IIB,IIIA,IIIB,IIIC,IV,IVA,IVB,unknown. Onkostar 2.14.4 kennt keine TNM-Auflage 9 (OS.UICC-Stadium endet mit Auflage 8). |
| `diagnosisList/diagnosis/stageDiagnosisUnknown` | Stadium der Diagnose | Enumeration | B | OS.Stadium → Stadium.UICCStadium (OS.UICC-Stadium) | Schema: UiccUnknownEnumType (Vereinigung aller Werte) für usedUiccVersion=unknown. In Onkostar ist jedes Stadium einer Katalogversion (Auflage) zugeordnet - 'Auflage unbekannt' gibt es nicht. |

<details>
<summary>Strukturelemente (2: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `diagnosisList` | Diagnosen | List | Struktur |  | Jede nNGM-Diagnose = eine OS.Diagnose der Erkrankung |
| `diagnosisList/diagnosis` | Diagnose | ListEntry (mehrfach) | Struktur |  | siehe diagnosisList |

</details>

#### Werteübersetzungen

**`diagnosisList/diagnosis/classification`** – Klassifikation

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | ICD-O-3 Histologie | 1399 | * identisch |  | bestätigt | 31 von 32 Codes vorhanden |
| C3812 | Carcinoma of Unknown Primary | ICD-O-3 Histologie |  |  |  | ungelöst | NCI-Thesaurus-Code, kein ICD-O-3-Morphologiecode; CUP ist in ICD-O-3 eine Lokalisation (C80.9) |

**`diagnosisList/diagnosis/stageDiagnosisV7`** – Stadium der Diagnose

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| 0 | 0 | OS.UICC-Stadium | Auflage 7 | 0 | 0 | vorläufig |  |
| IA | IA | OS.UICC-Stadium | Auflage 7 | IA | IA | vorläufig |  |
| IB | IB | OS.UICC-Stadium | Auflage 7 | IB | IB | vorläufig |  |
| IIA | IIA | OS.UICC-Stadium | Auflage 7 | IIA | IIA | vorläufig |  |
| IIB | IIB | OS.UICC-Stadium | Auflage 7 | IIB | IIB | vorläufig |  |
| IIIA | IIIA | OS.UICC-Stadium | Auflage 7 | IIIA | IIIA | vorläufig |  |
| IIIB | IIIB | OS.UICC-Stadium | Auflage 7 | IIIB | IIIB | vorläufig |  |
| IV | IV | OS.UICC-Stadium | Auflage 7 | IV | IV | vorläufig |  |
| unknown | Unbekannt | OS.UICC-Stadium | Auflage 7 | X | kein Stadium ermittelbar | vorläufig | Bedeutung nicht ganz gleich: unbekannt vs. nicht ermittelbar. Rückweg: X -> unknown |

**`diagnosisList/diagnosis/stageDiagnosisV8`** – Stadium der Diagnose

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| 0 | 0 | OS.UICC-Stadium | Auflage 8 | 0 | 0 | vorläufig |  |
| IA1 | IA1 | OS.UICC-Stadium | Auflage 8 | IA1 | IA1 | vorläufig |  |
| IA2 | IA2 | OS.UICC-Stadium | Auflage 8 | IA2 | IA2 | vorläufig |  |
| IA3 | IA3 | OS.UICC-Stadium | Auflage 8 | IA3 | IA3 | vorläufig |  |
| IB | IB | OS.UICC-Stadium | Auflage 8 | IB | IB | vorläufig |  |
| IIA | IIA | OS.UICC-Stadium | Auflage 8 | IIA | IIA | vorläufig |  |
| IIB | IIB | OS.UICC-Stadium | Auflage 8 | IIB | IIB | vorläufig |  |
| IIIA | IIIA | OS.UICC-Stadium | Auflage 8 | IIIA | IIIA | vorläufig |  |
| IIIB | IIIB | OS.UICC-Stadium | Auflage 8 | IIIB | IIIB | vorläufig |  |
| IIIC | IIIC | OS.UICC-Stadium | Auflage 8 | IIIC | IIIC | vorläufig |  |
| IV | IV | OS.UICC-Stadium | Auflage 8 | IV | IV | vorläufig |  |
| IVA | IVA | OS.UICC-Stadium | Auflage 8 | IVA | IVA | vorläufig |  |
| IVB | IVB | OS.UICC-Stadium | Auflage 8 | IVB | IVB | vorläufig |  |
| unknown | Unbekannt | OS.UICC-Stadium | Auflage 8 | X | kein Stadium ermittelbar | vorläufig | Bedeutung nicht ganz gleich: unbekannt vs. nicht ermittelbar. Rückweg: X -> unknown |

### Tumorstadium (`tumorStage`)

34 Felder – 14 bestätigt, 11 vorläufig, 9 ungelöst. Entscheidungen: E-1, E-2.

#### Bestätigt (7)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `observationList/observation/id` | ID des Listeneintrags | EntryId | A | OS.Stadium → prozedur.id |  |
| `observationList/observation/observationDetailsGroup/date` | Datum | MedicalDate | A | OS.Stadium → Datum |  |
| `observationList/observation/tnmGroup/tnmTumorGroup/tumorSizeV7` | Größe und Ausdehnung des Tumors | Enumeration | B | OS.Stadium → dTNMT (TNM T) | Code ohne Kategoriebuchstaben (T1a→1a, TX→X, Tis→is, N2→2, M1c→1c); Katalogversion nach usedUiccVersion (Auflage 7/8); definitiver Block, definitiverTNM=ja |
| `observationList/observation/tnmGroup/tnmTumorGroup/tumorPrefix` | Präfix | Enumeration | A | OS.Stadium → dTNMTPraefix (TNM T Präfix) | c/p/u identisch |
| `observationList/observation/tnmGroup/lymphNodesGroup/lymphNodesPrefix` | Präfix | Enumeration | A | OS.Stadium → dTNMNPraefix (TNM N Präfix) | c/p/u identisch |
| `observationList/observation/tnmGroup/metastasesGroup/metastasesStateV8` | Abwesenheit oder Vorhandensein von Metastasen | Enumeration | B | OS.Stadium → dTNMM (Spalte pTNMM) (TNM M) | Code ohne Kategoriebuchstaben (T1a→1a, TX→X, Tis→is, N2→2, M1c→1c); Katalogversion nach usedUiccVersion (Auflage 7/8); definitiver Block, definitiverTNM=ja |
| `observationList/observation/tnmGroup/metastasesGroup/metastasesPrefix` | Präfix | Enumeration | A | OS.Stadium → dTNMMPraefix (TNM M Präfix) | c/p/u identisch |

#### Vorläufig (9)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `observationList/observation/tnmGroup/tnmPrefix` | Präfix | Enumeration | B | OS.Stadium → dTNMy / dTNMr | Code y → dTNMy=ja, r → dTNMr=ja |
| `observationList/observation/tnmGroup/tnmTumorGroup/tumorSize` | Größe und Ausdehnung des Tumors | Enumeration | B | OS.Stadium → dTNMT (TNM T) | [Rückfrage offen] Feld ohne Version – vorläufig wie V8 behandelt; Frage an nNGM (Altfeld?) offen; Code ohne Kategoriebuchstaben (T1a→1a, TX→X, Tis→is, N2→2, M1c→1c); Katalogversion nach usedUiccVersion (Auflage 7/8); definitiver Block, definitiverTNM=ja |
| `observationList/observation/tnmGroup/tnmTumorGroup/tumorSizeV8` | Größe und Ausdehnung des Tumors | Enumeration | B | OS.Stadium → dTNMT (TNM T) | Code ohne Kategoriebuchstaben (T1a→1a, TX→X, Tis→is, N2→2, M1c→1c); Katalogversion nach usedUiccVersion (Auflage 7/8); definitiver Block, definitiverTNM=ja; Lücke: T1mi fehlt im Katalog (nur 1mic) |
| `observationList/observation/tnmGroup/tnmTumorGroup/tumorSuffix` | Suffix | Enumeration | B | OS.Stadium → dTNMMulti / dTNMTis | m → dTNMMulti=m, is → dTNMTis=ja; cy ohne Gegenstück |
| `observationList/observation/tnmGroup/lymphNodesGroup/lymphNodesCount` | Zahl und Lage der befallenen Lymphknoten | Enumeration | B | OS.Stadium → dTNMN (TNM N) | [Rückfrage offen] Feld ohne Version – vorläufig wie V8 behandelt; Frage an nNGM (Altfeld?) offen; Code ohne Kategoriebuchstaben (T1a→1a, TX→X, Tis→is, N2→2, M1c→1c); Katalogversion nach usedUiccVersion (Auflage 7/8); definitiver Block, definitiverTNM=ja |
| `observationList/observation/tnmGroup/metastasesGroup/metastasesState` | Abwesenheit oder Vorhandensein von Metastasen | Enumeration | B | OS.Stadium → dTNMM (Spalte pTNMM) (TNM M) | [Rückfrage offen] Feld ohne Version – vorläufig wie V8 behandelt; Frage an nNGM (Altfeld?) offen; Code ohne Kategoriebuchstaben (T1a→1a, TX→X, Tis→is, N2→2, M1c→1c); Katalogversion nach usedUiccVersion (Auflage 7/8); definitiver Block, definitiverTNM=ja |
| `observationList/observation/tnmGroup/metastasesGroup/metastasesStateV7` | Abwesenheit oder Vorhandensein von Metastasen | Enumeration | B | OS.Stadium → dTNMM (Spalte pTNMM) (TNM M) | Code ohne Kategoriebuchstaben (T1a→1a, TX→X, Tis→is, N2→2, M1c→1c); Katalogversion nach usedUiccVersion (Auflage 7/8); definitiver Block, definitiverTNM=ja; Lücke: MX fehlt in Auflage 7 |
| `observationList/observation/tnmGroup/metastasesGroup/metastasesLocalisation` | Lokalisation | Terminology (mehrfach) | B | OS.FernmetastaseDiagnose / OS.FernmetastaseVerlauf → ICDO3Lokalisation (ICD-O-3 Lokalisation) | Codes identisch, ein Eintrag je Lokalisation; liegt nicht in OS.Stadium (OS.Lokalisation dort nur für nicht-solide Tumoren) → Zuordnung zum Stadium-Eintrag beim Export klären |
| `observationList/observation/uiccStateGroup/uiccStateManual` | Stadium der Diagnose | Enumeration | B | OS.Stadium → UICCStadium (OS.UICC-Stadium) | Codes identisch, unknown → X; Version nach usedUiccVersion |

#### Ungelöst (9)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `observationList/observation/observationDetailsGroup/firstDiagnosis` | Erstdiagnose | Enumeration |  |  | [Rückfrage offen] kein Feld in OS.Stadium; Zusatzfeld, Ableitung (Vergleich mit Diagnosedatum) oder offen |
| `observationList/observation/observationDetailsGroup/curativeOperable` | Kurativ-operabel | Enumeration |  |  | [Rückfrage offen] kein Feld in OS.Stadium (OS.Operative Therapie.operabel ist anderer Kontext) |
| `observationList/observation/usedUiccVersionGroup/usedUiccVersion` | Genutzte UICC Version | Enumeration | B | OS.Stadium → dTNMT_propcat_version (Katalogversion TNM T/N/M) | version7/8 → Auflage 7/8 der TNM-Kataloge; version9/unknown ohne Gegenstück (keine TNM-9-Auflage) |
| `observationList/observation/tnmGroup/tnmTumorGroup/tumorSizeV9` | Größe und Ausdehnung des Tumors | Enumeration |  | OS.Stadium → dTNMT | keine TNM-9-Auflage in Onkostar |
| `observationList/observation/tnmGroup/tnmTumorGroup/tumorSizeUnknown` | Größe und Ausdehnung des Tumors | Enumeration |  | OS.Stadium → dTNMT | Version unbekannt – keine Katalogversion zuordenbar |
| `observationList/observation/tnmGroup/lymphNodesGroup/lymphNodesCountV9` | Zahl und Lage der befallenen Lymphknoten | Enumeration |  | OS.Stadium → dTNMN | keine TNM-9-Auflage in Onkostar (N2a/N2b) |
| `observationList/observation/tnmGroup/lymphNodesGroup/lymphNodesCountUnknown` | Zahl und Lage der befallenen Lymphknoten | Enumeration |  | OS.Stadium → dTNMN | Version unbekannt |
| `observationList/observation/tnmGroup/metastasesGroup/metastasesStateV9` | Abwesenheit oder Vorhandensein von Metastasen | Enumeration |  | OS.Stadium → dTNMM | keine TNM-9-Auflage in Onkostar (M1c1/M1c2) |
| `observationList/observation/tnmGroup/metastasesGroup/metastasesStateVUnknown` | Abwesenheit oder Vorhandensein von Metastasen | Enumeration |  | OS.Stadium → dTNMM | Version unbekannt |

<details>
<summary>Strukturelemente (9: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `observationList` | Tumorstadium | List | Struktur |  | Liste → ein OS.Stadium-Eintrag je Listeneintrag |
| `observationList/observation` | Tumorstadium | ListEntry (mehrfach) | Struktur | OS.Stadium | ein OS.Stadium-Eintrag (Prozedur) |
| `observationList/observation/observationDetailsGroup` | Angaben zum Tumorstadium | FieldGroup | Struktur |  |  |
| `observationList/observation/usedUiccVersionGroup` | Genutzte UICC Version | FieldGroup | Struktur |  |  |
| `observationList/observation/tnmGroup` | TNM-Klassifikation | FieldGroup | Struktur |  | Abschnitt „Definitives TNM“ |
| `observationList/observation/tnmGroup/tnmTumorGroup` | Tumor (T) | FieldGroup | Struktur |  |  |
| `observationList/observation/tnmGroup/lymphNodesGroup` | Lymphknoten (N) | FieldGroup | Struktur |  |  |
| `observationList/observation/tnmGroup/metastasesGroup` | Metastasen (M) | FieldGroup | Struktur |  |  |
| `observationList/observation/uiccStateGroup` | Stadium nach Union Internationale Contre le Cancer (UICC) | FieldGroup | Struktur |  |  |

</details>

#### Werteübersetzungen

**`observationList/observation/tnmGroup/tnmPrefix`** – Präfix

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| y | y | (Ja/Nein-Feld dTNMy) |  | 1 | ja | vorläufig |  |
| r | r | (Ja/Nein-Feld dTNMr) |  | 1 | ja | vorläufig |  |

**`observationList/observation/tnmGroup/tnmTumorGroup/tumorSizeV7`** – Größe und Ausdehnung des Tumors

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | TNM T | Auflage 7 | * ohne Kategoriebuchstaben |  | bestätigt | z. B. T1a→1a, TX→X, Tis→is, N2→2, M1c→1c; Ausnahmen einzeln |

**`observationList/observation/tnmGroup/tnmTumorGroup/tumorSizeV8`** – Größe und Ausdehnung des Tumors

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | TNM T | Auflage 8 | * ohne Kategoriebuchstaben |  | bestätigt | z. B. T1a→1a, TX→X, Tis→is, N2→2, M1c→1c; Ausnahmen einzeln |
| T1mi | T1mi | TNM T | Auflage 8 |  |  | ungelöst | nur 1mic (Mikroinvasion) vorhanden, kein 1mi |

**`observationList/observation/tnmGroup/tnmTumorGroup/tumorPrefix`** – Präfix

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| c | c | TNM T Präfix |  | c | c | bestätigt |  |
| p | p | TNM T Präfix |  | p | p | bestätigt |  |
| u | u | TNM T Präfix |  | u | u | bestätigt |  |

**`observationList/observation/tnmGroup/tnmTumorGroup/tumorSuffix`** – Suffix

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| m | m | TNM Multiplizität (dTNMMulti) |  | m | m | vorläufig |  |
| is | is | (Ja/Nein-Feld dTNMTis) |  | 1 | ja | vorläufig |  |
| cy | cy |  |  |  |  | ungelöst | kein Gegenstück |

**`observationList/observation/tnmGroup/lymphNodesGroup/lymphNodesCount`** – Zahl und Lage der befallenen Lymphknoten

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | TNM N | Auflage 7/8 | * ohne Kategoriebuchstaben |  | bestätigt | z. B. T1a→1a, TX→X, Tis→is, N2→2, M1c→1c; Ausnahmen einzeln |

**`observationList/observation/tnmGroup/lymphNodesGroup/lymphNodesPrefix`** – Präfix

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| c | c | TNM N Präfix |  | c | c | bestätigt |  |
| p | p | TNM N Präfix |  | p | p | bestätigt |  |
| u | u | TNM N Präfix |  | u | u | bestätigt |  |

**`observationList/observation/tnmGroup/metastasesGroup/metastasesStateV7`** – Abwesenheit oder Vorhandensein von Metastasen

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | TNM M | Auflage 7 | * ohne Kategoriebuchstaben |  | bestätigt | z. B. T1a→1a, TX→X, Tis→is, N2→2, M1c→1c; Ausnahmen einzeln |
| MX | MX | TNM M | Auflage 7 |  |  | ungelöst | MX fehlt in Auflage 7 |

**`observationList/observation/tnmGroup/metastasesGroup/metastasesStateV8`** – Abwesenheit oder Vorhandensein von Metastasen

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | TNM M | Auflage 8 | * ohne Kategoriebuchstaben |  | bestätigt | z. B. T1a→1a, TX→X, Tis→is, N2→2, M1c→1c; Ausnahmen einzeln |

**`observationList/observation/tnmGroup/metastasesGroup/metastasesStateV9`** – Abwesenheit oder Vorhandensein von Metastasen

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| M1c1 | M1c1 | TNM M |  |  |  | ungelöst | keine TNM-9-Auflage |
| M1c2 | M1c2 | TNM M |  |  |  | ungelöst | keine TNM-9-Auflage |

**`observationList/observation/tnmGroup/metastasesGroup/metastasesPrefix`** – Präfix

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| c | c | TNM M Präfix |  | c | c | bestätigt |  |
| p | p | TNM M Präfix |  | p | p | bestätigt |  |
| u | u | TNM M Präfix |  | u | u | bestätigt |  |

**`observationList/observation/uiccStateGroup/uiccStateManual`** – Stadium der Diagnose

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | OS.UICC-Stadium | Auflage 7/8 | * identisch |  | vorläufig | wie stageDiagnosisV7/V8 in tumorDiagnosis |
| unknown | unknown | OS.UICC-Stadium | Auflage 7/8 | X | kein Stadium ermittelbar | vorläufig |  |

### Histologie (`histology`)

17 Felder – 1 bestätigt, 6 vorläufig, 1 unvollständig, 9 ungelöst. Entscheidungen: E-1, E-2.

#### Bestätigt (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `histologies/histology/id` | ID des Listeneintrags | EntryId | A | → prozedur.id |  |

#### Vorläufig (3)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `histologies/histology/histologyDetail/date` | Datum | MedicalDate | A | OS.Pathologiebefund → HistologieDatum | [Rückfrage offen] Bedeutung histology vs. diagnosticHistology (Netzwerkzentrum) und Zielformular; „Datum Histologie/Entnahme“ |
| `histologies/histology/histologyDetail/localization` | Lokalisation | Enumeration | A | OS.Pathologiebefund → ICDO3Lokalisation (ICD-O-3 Lokalisation) | Werteliste (Lunge + typische Metastasenorte) spricht für Entnahmestelle; nicht ausdrücklich definiert → Frage an nNGM; im Formular nur sichtbar bei Präparat = Biopsie; Option E-8: Filter (Präparat = Biopsie) im abgeleiteten Formular lockern |
| `histologies/histology/histologyDetail/grading` | Grading | Enumeration | B | OS.Pathologiebefund → Grading (ADT.Grading) | [Rückfrage offen] Bedeutung histology vs. diagnosticHistology (Netzwerkzentrum) und Zielformular; Werte siehe werte-mapping.csv (G0 → T); sichtbar nur bei solider Erkrankung und Tumornachweis |

#### Unvollständig (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `histologies/histology/histologyDetail/classification` | Klassifikation | Terminology | A | OS.Pathologiebefund → ICDO3Histologie (ICD-O-3 Histologie) | Codes identisch (31 von 32 nNGM-Werten im Katalog, Version 1399); C3812 (CUP, NCI-Code) fehlt; nur Code gespeichert, Text aus Katalog; im Formular nur sichtbar mit Tumornachweis |

#### Ungelöst (7)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `histologies/histology/reference/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `histologies/histology/detailAdeno/growthPatternLepidic` | Wachstumsmuster bei Adenokarzinom lepidisch | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |
| `histologies/histology/detailAdeno/growthPatternAcinary` | Wachstumsmuster bei Adenokarzinom azinär | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |
| `histologies/histology/detailAdeno/growthPatternPapillary` | Wachstumsmuster bei Adenokarzinom papillär | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |
| `histologies/histology/detailAdeno/growthPatternMicropapillary` | Wachstumsmuster bei Adenokarzinom mikropapillär | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |
| `histologies/histology/detailAdeno/growthPatternSolid` | Wachstumsmuster bei Adenokarzinom solide | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |
| `histologies/histology/detailAdeno/percentSignetRingCellCarcinoma` | Anteil an Siegelringzellkarzinomen | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |

<details>
<summary>Strukturelemente (5: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `histologies` | Histologien | List | Struktur |  | Liste → ein Formulareintrag je Listeneintrag |
| `histologies/histology` | Histologie | ListEntry (mehrfach) | Struktur | OS.Pathologiebefund | [Rückfrage offen] Bedeutung histology vs. diagnosticHistology (Netzwerkzentrum) und Zielformular; je Eintrag ein OS.Pathologiebefund, Tumornachweis = ja setzen |
| `histologies/histology/reference` | Referenzen | FieldGroup | Struktur |  | Verweis auf tumorMaterial/specimen – hängt an der Abbildung des Bogens Tumormaterial |
| `histologies/histology/histologyDetail` | Histologie | FieldGroup | Struktur |  |  |
| `histologies/histology/detailAdeno` | Nähere histologische Beschreibung des Adenokarzinoms | FieldGroup | Struktur |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |

</details>

#### Werteübersetzungen

**`histologies/histology/histologyDetail/classification`** – Klassifikation

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | ICD-O-3 Histologie | 1399 | * identisch |  | bestätigt | 31 von 32 Codes vorhanden |
| C3812 | Carcinoma of Unknown Primary | ICD-O-3 Histologie |  |  |  | ungelöst | NCI-Thesaurus-Code, kein ICD-O-3-Morphologiecode; CUP ist in ICD-O-3 eine Lokalisation (C80.9) |

**`histologies/histology/histologyDetail/grading`** – Grading

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| G0 | Grading nicht vorgesehen | ADT.Grading |  | T | Trifft nicht zu | bestätigt | nNGM meint „Grading nicht vorgesehen“; ADT.Grading 0 bedeutet „Malignes Melanom der Konjunktiva“ (nur für dieses Grading-System) und wäre im Krebsregister falsch |
| G1 | gut differenziert | ADT.Grading |  | 1 | G1 (Gut differenziert) | bestätigt |  |
| G2 | mäßig differenziert | ADT.Grading |  | 2 | G2 (Mäßig differenziert) | bestätigt |  |
| G3 | schlecht / gering differenziert | ADT.Grading |  | 3 | G3 (Schlecht differenziert) | bestätigt |  |
| G4 | undifferenzierter Tumor mit sehr hohem Malignitätsgrad | ADT.Grading |  | 4 | G4 (Undifferenziert/anapl.) | bestätigt |  |
| GX | nicht bestimmbar | ADT.Grading |  | X | Differenzierungsgrad nicht bestimmbar | bestätigt |  |
| U | unbekannt | ADT.Grading |  | U | Unbekannt | bestätigt |  |
| T | trifft nicht zu | ADT.Grading |  | T | Trifft nicht zu | bestätigt |  |

### Histologie (`diagnosticHistology`)

19 Felder – 1 bestätigt, 8 vorläufig, 1 unvollständig, 9 ungelöst. Entscheidungen: E-1, E-2.

#### Bestätigt (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `pfHistologies/pfHistology/id` | ID des Listeneintrags | EntryId | A | → prozedur.id |  |

#### Vorläufig (4)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `pfHistologies/pfHistology/biopsy/dateOfResult` | Befunddatum | MedicalDate | A | OS.Pathologiebefund → Befundausgang | [Rückfrage offen] Bedeutung histology vs. diagnosticHistology (Netzwerkzentrum) und Zielformular |
| `pfHistologies/pfHistology/biopsy/resultNumber` | Befundnummer | FreeText | A | OS.Pathologiebefund → Einsendenummer | [Rückfrage offen] Bedeutung histology vs. diagnosticHistology (Netzwerkzentrum) und Zielformular; nNGM max. 200 Zeichen, Onkostar Textfeld |
| `pfHistologies/pfHistology/histologyGroup/Localization` | Lokalisation | Enumeration | A | OS.Pathologiebefund → ICDO3Lokalisation (ICD-O-3 Lokalisation) | Werteliste (Lunge + typische Metastasenorte) spricht für Entnahmestelle; nicht ausdrücklich definiert → Frage an nNGM; im Formular nur sichtbar bei Präparat = Biopsie; Option E-8: Filter (Präparat = Biopsie) im abgeleiteten Formular lockern |
| `pfHistologies/pfHistology/histologyGroup/grading` | Grading | Enumeration | B | OS.Pathologiebefund → Grading (ADT.Grading) | [Rückfrage offen] Bedeutung histology vs. diagnosticHistology (Netzwerkzentrum) und Zielformular; Werte siehe werte-mapping.csv (G0 → T); sichtbar nur bei solider Erkrankung und Tumornachweis |

#### Unvollständig (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `pfHistologies/pfHistology/histologyGroup/classification` | Klassifikation | Terminology | A | OS.Pathologiebefund → ICDO3Histologie (ICD-O-3 Histologie) | Codes identisch (31 von 32 nNGM-Werten im Katalog, Version 1399); C3812 (CUP, NCI-Code) fehlt; nur Code gespeichert, Text aus Katalog; im Formular nur sichtbar mit Tumornachweis |

#### Ungelöst (8)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `pfHistologies/pfHistology/biopsy/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `pfHistologies/pfHistology/adenoDetailsGroup/hasAdenoDetails` | Nähere histologische Beschreibung des Adenokarzinoms | Enumeration | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt (Schalter, ggf. ableitbar aus ausgefüllten Mustern) |
| `pfHistologies/pfHistology/adenoDetailsGroup/growthPatternLepidic` | Wachstumsmuster bei Adenokarzinom lepidisch | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |
| `pfHistologies/pfHistology/adenoDetailsGroup/growthPatternAcinary` | Wachstumsmuster bei Adenokarzinom azinär | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |
| `pfHistologies/pfHistology/adenoDetailsGroup/growthPatternPapillary` | Wachstumsmuster bei Adenokarzinom papillär | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |
| `pfHistologies/pfHistology/adenoDetailsGroup/growthPatternMicropapillary` | Wachstumsmuster bei Adenokarzinom mikropapillär | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |
| `pfHistologies/pfHistology/adenoDetailsGroup/growthPatternSolid` | Wachstumsmuster bei Adenokarzinom solide | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |
| `pfHistologies/pfHistology/adenoDetailsGroup/percentSignetRingCellCarcinoma` | Anteil an Siegelringzellkarzinomen | Integer | C |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |

<details>
<summary>Strukturelemente (5: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `pfHistologies` | Histologien (Netzwerkzentrum) | List | Struktur |  | Liste → ein Formulareintrag je Listeneintrag |
| `pfHistologies/pfHistology` | Histologie | ListEntry (mehrfach) | Struktur | OS.Pathologiebefund | [Rückfrage offen] Bedeutung histology vs. diagnosticHistology (Netzwerkzentrum) und Zielformular; je Eintrag ein OS.Pathologiebefund, Tumornachweis = ja setzen |
| `pfHistologies/pfHistology/biopsy` | Biopsie Referenzen | FieldGroup | Struktur |  |  |
| `pfHistologies/pfHistology/histologyGroup` | Histologie | FieldGroup | Struktur |  |  |
| `pfHistologies/pfHistology/adenoDetailsGroup` | Nähere histologische Beschreibung des Adenokarzinoms | FieldGroup | Struktur |  | Wachstumsmuster Adenokarzinom: kein Gegenstück in Onkostar – vorerst zurückgestellt |

</details>

#### Werteübersetzungen

**`pfHistologies/pfHistology/histologyGroup/classification`** – Klassifikation

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | ICD-O-3 Histologie | 1399 | * identisch |  | bestätigt | 31 von 32 Codes vorhanden |
| C3812 | Carcinoma of Unknown Primary | ICD-O-3 Histologie |  |  |  | ungelöst | NCI-Thesaurus-Code, kein ICD-O-3-Morphologiecode; CUP ist in ICD-O-3 eine Lokalisation (C80.9) |

**`pfHistologies/pfHistology/histologyGroup/grading`** – Grading

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| G0 | Grading nicht vorgesehen | ADT.Grading |  | T | Trifft nicht zu | bestätigt | nNGM meint „Grading nicht vorgesehen“; ADT.Grading 0 bedeutet „Malignes Melanom der Konjunktiva“ (nur für dieses Grading-System) und wäre im Krebsregister falsch |
| G1 | gut differenziert | ADT.Grading |  | 1 | G1 (Gut differenziert) | bestätigt |  |
| G2 | mäßig differenziert | ADT.Grading |  | 2 | G2 (Mäßig differenziert) | bestätigt |  |
| G3 | schlecht / gering differenziert | ADT.Grading |  | 3 | G3 (Schlecht differenziert) | bestätigt |  |
| G4 | undifferenzierter Tumor mit sehr hohem Malignitätsgrad | ADT.Grading |  | 4 | G4 (Undifferenziert/anapl.) | bestätigt |  |
| GX | nicht bestimmbar | ADT.Grading |  | X | Differenzierungsgrad nicht bestimmbar | bestätigt |  |
| U | unbekannt | ADT.Grading |  | U | Unbekannt | bestätigt |  |
| T | trifft nicht zu | ADT.Grading |  | T | Trifft nicht zu | bestätigt |  |

## Tumormaterial

<details>
<summary><b>E-3</b> – Tumormaterial → OS.Molekulargenetik (Arbeitsstand) (04.11.2026)</summary>

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

</details>

### Tumormaterial (`tumorMaterial`)

9 Felder – 1 bestätigt, 6 vorläufig, 2 ungelöst. Entscheidungen: E-3.

#### Bestätigt (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `specimenList/specimen/id` | ID des Listeneintrags | EntryId | A | → prozedur.id |  |

#### Vorläufig (4)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `specimenList/specimen/materialType` | Materialtyp | Enumeration | B | OS.Molekulargenetik → Probenmaterial (OS.Probenmaterial) | Zielformular hängt an E-3 (Weg A/B/C offen), Arbeitsstand OS.Molekulargenetik; Export: B → Blut, Gewebearten → Gewebe; AS/PLERG/L/U offen (E-3) |
| `specimenList/specimen/biopsieID` | Biopsie-ID/Eingangsnummer | FreeText | A | OS.Molekulargenetik → Einsendenummer | Zielformular hängt an E-3 (Weg A/B/C offen), Arbeitsstand OS.Molekulargenetik; „Journalnummer / Eingangsnummer“, nNGM max. 200 Zeichen |
| `specimenList/specimen/tumorCellContent` | Tumorzellgehalt in % | Integer | A | OS.Molekulargenetik → Tumorzellgehalt | Zielformular hängt an E-3 (Weg A/B/C offen), Arbeitsstand OS.Molekulargenetik; im Formular nur sichtbar bei Analysemethode Sequenzierung/PCR/sonstige; Option E-8: Filter im abgeleiteten Formular lockern |
| `specimenList/specimen/extractionDate` | Entnahmedatum | MedicalDate | A | OS.Molekulargenetik → Entnahmedatum | Zielformular hängt an E-3 (Weg A/B/C offen), Arbeitsstand OS.Molekulargenetik |

#### Ungelöst (2)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `specimenList/specimen/extractionContext` | Entnahmekontext | Enumeration |  |  | kein Feld; evtl. aus Aufenthalt am Entnahmedatum ableitbar (zu prüfen) |
| `specimenList/specimen/pathologistName` | Tumormaterial lagert bei | NngmNetworkPathologist | D |  | NngmNetworkPathologist – allgemeine Frage Netzwerkpartner |

<details>
<summary>Strukturelemente (2: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `specimenList` | Tumormaterialien zur Anforderung | List | Struktur |  | Liste → ein Formulareintrag je Material |
| `specimenList/specimen` | Tumormaterial | ListEntry (mehrfach) | Struktur | OS.Molekulargenetik | Zielformular hängt an E-3 (Weg A/B/C offen), Arbeitsstand OS.Molekulargenetik; Untersuchungen als Unterformulare |

</details>

#### Werteübersetzungen

**`specimenList/specimen/materialType`** – Materialtyp

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| C12434 | Blut | OS.Probenmaterial |  | B | Blut | vorläufig |  |
| C12801 | Gewebe | OS.Probenmaterial |  | T, R, LK, M, ITM, SM, KM, NG | Gewebearten | vorläufig | Export-Richtung: jede Gewebeart → C12801; Import-Richtung nicht eindeutig |
|  |  | OS.Probenmaterial |  | AS, PLERG, L, U, S | Aszites, Pleuraerguss, Liquor, Urin, Sonstiges | ungelöst | weder Gewebe noch Blut (E-3) |

## Therapien

<details>
<summary><b>E-4</b> – Systemische Therapie → OS.Systemische Therapie (Arbeitsstand) (04.11.2026)</summary>

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

</details>

<details>
<summary><b>E-5</b> – Operation → OS.Operative Therapie (Arbeitsstand) (04.11.2026)</summary>

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

</details>

<details>
<summary><b>E-6</b> – Strahlentherapie → OS.Strahlentherapie (Arbeitsstand) (04.11.2026)</summary>

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

</details>

### Systemische Therapie (`systemicTherapy`)

50 Felder – 1 bestätigt, 39 vorläufig, 1 unvollständig, 9 ungelöst. Entscheidungen: E-4, E-5, E-6.

#### Bestätigt (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList/systemTherapy/id` | ID des Listeneintrags | EntryId | A | → prozedur.id |  |

#### Vorläufig (32)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `systemTherapyLineList/systemTherapyLine/noTherapyGroup` | Therapie | FieldGroup | C | NNGM.Systemische Therapie | Therapiefreie Zeit / Best Supportive Care: kein Gegenstück (Status „nicht durchgeführt“ passt nicht, BSC ist ein Zeitraum); Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/noTherapyGroup/noTherapy` | Therapiefreie Zeit / Best Supportive Care | Enumeration | C | NNGM.Systemische Therapie → noTherapy (OS.JaNein) | BSC: kein Gegenstück; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8); Katalog OS.JaNein statt NNGM.yesNo (Übersetzung beim Export, E-0 11.11.2026) |
| `systemTherapyLineList/systemTherapyLine/noTherapyGroup/noTherapyReason` | Grund für "Therapiefreie Zeit / Best Supportive Care" | Enumeration | C | NNGM.Systemische Therapie → noTherapyReason | BSC: kein Gegenstück; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/noTherapyGroup/otherNoTherapyReason` | Bitte spezifizieren Sie "Anderer" | FreeText | C | NNGM.Systemische Therapie → otherNoTherapyReason | BSC: kein Gegenstück; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/noTherapyGroup/noTherapyStart` | Therapiefreie Zeit / Best Supportive Care - Start | MedicalDate | C | NNGM.Systemische Therapie → noTherapyStart | BSC: kein Gegenstück; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/noTherapyGroup/noTherapyEnde` | Therapiefreie Zeit / Best Supportive Care - Ende | MedicalDate | C | NNGM.Systemische Therapie → noTherapyEnde | BSC: kein Gegenstück; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/basedOnRecommendation` | Auf Basis einer Therapieempfehlung durchgeführt | Enumeration | C | NNGM.Systemische Therapie → basedOnRecommendation | Therapieempfehlung: Empfehlungen in OS.Tumorkonferenz, kein Verweis aus der Systemtherapie; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/furtherDetails` | Weitere Angaben (Therapieempfehlung) | FreeText | C | NNGM.Systemische Therapie → furtherDetails | Therapieempfehlung: kein Gegenstück; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/therapyExecutionCenter` | Durchführende Einrichtung (Therapieempfehlung) | FreeText | C | NNGM.Systemische Therapie → therapyExecutionCenter | Therapieempfehlung: kein Gegenstück; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/therapyDate` | Datum (Therapieempfehlung) | MedicalDate | C | NNGM.Systemische Therapie → therapyDate | Therapieempfehlung: kein Gegenstück; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapeuticIntention` | Therapeutische Intention | Enumeration | B | OS.Systemische Therapie → Intention (OS.Therapieintention) | Linienangabe: bei jedem Schema der Linie, beim Export je Linie zusammengefasst (E-4, Frage Therapielinie offen); Werte siehe werte-mapping.csv |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/positionSurgicalTherapy` | Stellung zu operativer Therapie | Enumeration | B | OS.Systemische Therapie → Relation (CDA.ZeitlicheRelation) | Linienangabe: bei jedem Schema der Linie, beim Export je Linie zusammengefasst (E-4, Frage Therapielinie offen); O/A/N/I/Z/S identisch, T und UKN ohne nNGM-Wert |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapyLine` | Line | Integer | C | NNGM.Systemische Therapie → therapyLine | Liniennummer: kein Feld – Zusatzfeld oder Ableitung aus zeitlicher Reihenfolge (E-4); Option E-8: Liniennummer im Erweiterungskatalog (getestet); Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapyLineStart` | Beginn der Therapielinie | MedicalDate | D | OS.Systemische Therapie → Beginn (frühester der Linie) | abgeleitet, setzt Linienzuordnung voraus (E-4) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapyLineEnd` | Ende der Therapielinie | MedicalDate | D | OS.Systemische Therapie → Ende (spätestes der Linie) | abgeleitet, setzt Linienzuordnung voraus (E-4); ongoing = ein Schema ohne Ende |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/ecogAtStart` | ECOG Performance Status bei Therapiebeginn | Enumeration | B | OS.Systemische Therapie → ECOGvorTherapie (ADT.LeistungszustandECOG) | Linienangabe: bei jedem Schema der Linie, beim Export je Linie zusammengefasst (E-4, Frage Therapielinie offen); LOINC → 0–5, unknown → U |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/offLabelUse` | Off-Label-Use | Enumeration | C | NNGM.Systemische Therapie → offLabelUse (OS.JaNein) | Off-Label-Use: kein Feld; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8); Katalog OS.JaNein statt NNGM.yesNo (Übersetzung beim Export, E-0 11.11.2026) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapyLineStudyParticipation` | Therapie innerhalb einer klinischen Studie | Enumeration | C | NNGM.Systemische Therapie → therapyLineStudyParticipation (OS.JaNein) | Studie: OS.Studie (Studie, Patientennummer, Aufnahme/Abschluss) ohne Register, Studien-ID und Therapiebezug; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8); Katalog OS.JaNein statt NNGM.yesNo (Übersetzung beim Export, E-0 11.11.2026) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapyLineStudyName` | Studienname / Kurztitel | FreeText | C | NNGM.Systemische Therapie → therapyLineStudyName | Studie: siehe therapyLineStudyParticipation; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapyLineStudyRegister` | Studien-Register | Enumeration | C | NNGM.Systemische Therapie → therapyLineStudyRegister | Studie: kein Feld; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapyLineStudyId` | Studien-ID | FreeText | C | NNGM.Systemische Therapie → therapyLineStudyId | Studie: kein Feld; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapyLineInclusionGeneticVariants` | Einschlusskriterium genetische Variante(n) | FreeText | C | NNGM.Systemische Therapie → therapyLineInclusionGeneticVariants | Studie: kein Feld; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList/systemTherapy/otherTherapyName` | Wirkstoff | FreeText | A | OS.Systemische Therapie → Substanzen | Freitext „Substanzen“ |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList/systemTherapy/therapyStart` | Therapiebeginn | MedicalDate | A | OS.Systemische Therapie → Beginn | Prozedurdatum |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList/systemTherapy/therapyEnd` | Therapieende | MedicalDate | A | OS.Systemische Therapie → Ende | ongoing → Ende leer |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList/systemTherapy/cyclesCount` | Anzahl der Zyklen | Decimal | A | OS.Systemische Therapie → ZyklenDurchgefuehrt | Onkostar Textfeld, nNGM Decimal |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList/systemTherapy/isMaintainceTherapy` | Ist Erhaltungstherapie | Enumeration | C | NNGM.Systemische Therapie → isMaintainceTherapy (OS.JaNeinUnbekannt) | Erhaltungstherapie: kein Feld; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8); Katalog OS.JaNeinUnbekannt statt NNGM.yesNoUnknown (Übersetzung beim Export, E-0 11.11.2026) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList/systemTherapy/therapyEndOrChangeReason` | Grund für Therapieende/Therapiewechsel | MultipleChoice (mehrfach) | B | OS.Systemische Therapie → Beendigungsstatus + GrundAbbruch + Dosisreduktion + Substanzwechsel (ADT.BeendigungsstatusTherapie / OS.Abbruchgrund) | Werte siehe werte-mapping.csv; nNGM Mehrfachauswahl, Onkostar je ein Wert |
| `systemTherapyLineList/systemTherapyLine/informationGroup/responseGroup/BestResponse` | Bestes Ansprechen | Enumeration | A | OS.Systemische Therapie → Ergebnis (ADT.Gesamtbeurteilung) | Linienangabe: bei jedem Schema der Linie, beim Export je Linie zusammengefasst (E-4, Frage Therapielinie offen); alle 10 Codes identisch (V,T,K,P,D,B,R,Y,U,X) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/responseGroup/bestResponseDate` | Bestes Ansprechen Datum | MedicalDate | C | NNGM.Systemische Therapie → bestResponseDate | Response-Detail: kein Feld; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/responseGroup/AssessmentBy` | Beurteilung nach | Enumeration | C | NNGM.Systemische Therapie → AssessmentBy | Response-Detail (RECIST/behandelnder Arzt): kein Feld; Erweiterungskatalog des verknüpften Formulars, gebaut 10.11.2026 (E-8) |
| `systemTherapyLineList/systemTherapyLine/otherInformationGroup/note` | Bemerkungen | FreeText | A | OS.Systemische Therapie → Bemerkung | nNGM je Linie, Onkostar je Schema |

#### Unvollständig (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList/systemTherapy/therapyName` | Therapieschema | Terminology (mehrfach) | B | OS.Substanz (Unterformular von OS.Systemische Therapie) → Substanz (OS.Substanzen) | Liste von ATC-Codes, eine OS.Substanz-Zeile je Code; OS.Substanzen (2013, 273 Werte) mit ATC-Codes vor der Umstellung 2022 und ohne aktuelle Lungen-Substanzen (Osimertinib, Pembrolizumab …) → Katalogpflege nötig (E-4) |

#### Ungelöst (6)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `systemTherapyLineList/systemTherapyLine/id` | ID des Listeneintrags | EntryId |  |  | Linien-ID: keine Linien-Ebene in Onkostar (E-4) |
| `systemTherapyLineList/systemTherapyLine/executionCenter` | Durchführende Einrichtung | NngmNetworkLocation | D |  | NngmNetworkLocation – allgemeine Frage Netzwerkpartner |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapyLineDocumentation` | Therapiedokumentation bis | MedicalDate |  | OS.Systemische Therapie → LetzterTherapietag | „Therapiedokumentation bis“ ≠ „Letzter bekannter Therapietag“ – inhaltlich nicht gleich |
| `systemTherapyLineList/systemTherapyLine/informationGroup/responseGroup/progressList/progressListEntry/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Verlauf) | VERMUTUNG, nicht bestätigt: Progress als OS.Verlauf (Gesamtbeurteilung P) mit Unterformular OS.FernmetastaseVerlauf; Zuordnung zur Linie über das Datum (zwischen Linienbeginn und -ende) – progressRezidiv enthält diese Angaben nicht |
| `systemTherapyLineList/systemTherapyLine/informationGroup/responseGroup/progressList/progressListEntry/progressDate` | Datum des Progresses | MedicalDate | D | OS.Verlauf → Datum (Gesamtbeurteilung = P) | VERMUTUNG, nicht bestätigt: Progress als OS.Verlauf (Gesamtbeurteilung P) mit Unterformular OS.FernmetastaseVerlauf; Zuordnung zur Linie über das Datum (zwischen Linienbeginn und -ende) – progressRezidiv enthält diese Angaben nicht |
| `systemTherapyLineList/systemTherapyLine/informationGroup/responseGroup/progressList/progressListEntry/metastasisLocalization` | Metastasenlokalisationen | Terminology (mehrfach) | B | OS.FernmetastaseVerlauf (Unterformular von OS.Verlauf) → ICDO3Lokalisation (ICD-O-3 Lokalisation) | VERMUTUNG, nicht bestätigt: Progress als OS.Verlauf (Gesamtbeurteilung P) mit Unterformular OS.FernmetastaseVerlauf; Zuordnung zur Linie über das Datum (zwischen Linienbeginn und -ende) – progressRezidiv enthält diese Angaben nicht |

<details>
<summary>Strukturelemente (10: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `systemTherapyLineList` | Systemische Therapielinien | List | Struktur |  | Liste der Therapielinien |
| `systemTherapyLineList/systemTherapyLine` | Systemische Therapielinie | ListEntry (mehrfach) | Struktur |  | keine Linien-Ebene in Onkostar; Linie = Gruppe von OS.Systemische Therapie-Einträgen (E-4) |
| `systemTherapyLineList/systemTherapyLine/informationGroup` | TherapieInformationen | FieldGroup | Struktur |  |  |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy` | completedTherapy | FieldGroup | Struktur |  |  |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList` | Therapieschemata | List | Struktur |  | ein OS.Systemische Therapie-Eintrag je Schema |
| `systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList/systemTherapy` | Therapieschema | ListEntry (mehrfach) | Struktur | OS.Systemische Therapie | ein OS.Systemische Therapie-Eintrag je Therapieschema (E-4) |
| `systemTherapyLineList/systemTherapyLine/informationGroup/responseGroup` | Response | FieldGroup | Struktur |  |  |
| `systemTherapyLineList/systemTherapyLine/informationGroup/responseGroup/progressList` | Progresse | List | Struktur |  | VERMUTUNG, nicht bestätigt: Progress als OS.Verlauf (Gesamtbeurteilung P) mit Unterformular OS.FernmetastaseVerlauf; Zuordnung zur Linie über das Datum (zwischen Linienbeginn und -ende) – progressRezidiv enthält diese Angaben nicht |
| `systemTherapyLineList/systemTherapyLine/informationGroup/responseGroup/progressList/progressListEntry` | Progress innerhalb dieser Line | ListEntry (mehrfach) | Struktur |  | VERMUTUNG, nicht bestätigt: Progress als OS.Verlauf (Gesamtbeurteilung P) mit Unterformular OS.FernmetastaseVerlauf; Zuordnung zur Linie über das Datum (zwischen Linienbeginn und -ende) – progressRezidiv enthält diese Angaben nicht |
| `systemTherapyLineList/systemTherapyLine/otherInformationGroup` | Sonstiges | FieldGroup | Struktur |  |  |

</details>

#### Werteübersetzungen

**`systemTherapyLineList/systemTherapyLine/noTherapyGroup/noTherapy`** – Therapiefreie Zeit / Best Supportive Care

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNein |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNein |  | 0 | Nein | bestätigt | Export-Übersetzung |

**`systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapeuticIntention`** – Therapeutische Intention

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| curative | K = kurativ | OS.Therapieintention |  | K | Kurativ | vorläufig |  |
| palliative | P = palliativ | OS.Therapieintention |  | P | Palliativ | vorläufig |  |
| other | S = Sonstiges | OS.Therapieintention |  | S | Sonstige | vorläufig |  |
| noInformation | X = keine Angabe | OS.Therapieintention |  | UNK | Unbekannt | vorläufig | Version 3 hat kein X |
|  |  | OS.Therapieintention |  | O | lokal kurativ bei Oligometastasierung | ungelöst | Export: curative oder other? |
| other | S = Sonstiges | OS.Therapieintention |  | PRO, D, R | Prophylaktisch, Diagnostisch, Revision/Komplikation | vorläufig | nur Export-Richtung |

**`systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/positionSurgicalTherapy`** – Stellung zu operativer Therapie

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| unrelated | O = ohne Bezug zu einer operativen Therapie | CDA.ZeitlicheRelation |  | O | Ohne Bezug zu OP | vorläufig |  |
| adjuvant | A = adjuvant | CDA.ZeitlicheRelation |  | A | Adjuvant | vorläufig |  |
| neoadjuvant | N = neoadjuvant | CDA.ZeitlicheRelation |  | N | Neoadjuvant | vorläufig |  |
| intraoperative | I = intraoperativ | CDA.ZeitlicheRelation |  | I | Intraoperativ | vorläufig |  |
| additive | Z = additiv | CDA.ZeitlicheRelation |  | Z | Additiv | vorläufig |  |
| other | S = Sonstiges | CDA.ZeitlicheRelation |  | S | Sonstiges | vorläufig |  |
|  |  | CDA.ZeitlicheRelation |  | T | Alleinige Therapie | ungelöst | kein nNGM-Wert |
|  |  | CDA.ZeitlicheRelation |  | UKN | Unbekannt | ungelöst | kein nNGM-Wert |

**`systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/ecogAtStart`** – ECOG Performance Status bei Therapiebeginn

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| LA9622-7 | ECOG 0 | ADT.LeistungszustandECOG |  | 0 | 0 | bestätigt |  |
| LA9623-5 | ECOG 1 | ADT.LeistungszustandECOG |  | 1 | 1 | bestätigt |  |
| LA9624-3 | ECOG 2 | ADT.LeistungszustandECOG |  | 2 | 2 | bestätigt |  |
| LA9625-0 | ECOG 3 | ADT.LeistungszustandECOG |  | 3 | 3 | bestätigt |  |
| LA9626-8 | ECOG 4 | ADT.LeistungszustandECOG |  | 4 | 4 | bestätigt |  |
| LA9627-6 | ECOG 5 | ADT.LeistungszustandECOG |  | 5 | 5 | bestätigt |  |
| unknown | Unbekannt | ADT.LeistungszustandECOG |  | U | Unbekannt | bestätigt |  |

**`systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/offLabelUse`** – Off-Label-Use

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNein |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNein |  | 0 | Nein | bestätigt | Export-Übersetzung |

**`systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/therapyLineStudyParticipation`** – Therapie innerhalb einer klinischen Studie

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNein |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNein |  | 0 | Nein | bestätigt | Export-Übersetzung |

**`systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList/systemTherapy/isMaintainceTherapy`** – Ist Erhaltungstherapie

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNeinUnbekannt |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNeinUnbekannt |  | 0 | Nein | bestätigt | Export-Übersetzung |
| unknown | Unbekannt | OS.JaNeinUnbekannt |  | 9 | Unbekannt | bestätigt | Export-Übersetzung |

**`systemTherapyLineList/systemTherapyLine/informationGroup/completedTherapy/systemTherapyList/systemTherapy/therapyEndOrChangeReason`** – Grund für Therapieende/Therapiewechsel

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| regularEnd | E = reguläres Ende | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=E |  | vorläufig |  |
| regularEndWithDoseReduction | R = reguläres Ende mit Dosisreduktion | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=E, Dosisreduktion=J |  | vorläufig |  |
| regularEndWithSubstanceChange | W = reguläres Ende mit Substanzwechsel | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=E, Substanzwechsel=J |  | vorläufig |  |
| discontinuationSideEffects | A = Abbruch wegen Nebenwirkungen | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=A, GrundAbbruch=A |  | vorläufig |  |
| discontinuationProgress | P = Abbruch wegen Progress | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=A, GrundAbbruch=P |  | vorläufig |  |
| discontinuationOther | S = Abbruch aus sonstigen Gründen | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=A, GrundAbbruch=M oder S |  | vorläufig |  |
| patientRefusal | V = Patient verweigert weitere Therapie | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=A, GrundAbbruch=V |  | vorläufig |  |
| patientDeceased | T = Patient verstorben | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=A, GrundAbbruch=T |  | vorläufig |  |
| unknown | U = unbekannt | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=U |  | vorläufig |  |

**`systemTherapyLineList/systemTherapyLine/informationGroup/responseGroup/BestResponse`** – Bestes Ansprechen

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | ADT.Gesamtbeurteilung |  | * identisch (V,T,K,P,D,B,R,Y,U,X) |  | bestätigt |  |

### Operation (`operationTherapy`)

20 Felder – 1 bestätigt, 17 vorläufig, 2 ungelöst. Entscheidungen: E-4, E-5, E-6.

#### Bestätigt (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `operationList/operation/id` | ID des Listeneintrags | EntryId | A | → prozedur.id |  |

#### Vorläufig (10)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `operationList/operation/executionGroup/executionDate` | Operationsdatum | MedicalDate | A | OS.Operative Therapie → OPDatum | OP-Datum |
| `operationList/operation/informationGroup/operationIntention` | Operative Intention | Enumeration | B | OS.Operative Therapie → Intention (OS.Therapieintention) | K/P/D/R/S identisch, X → UNK; Werte siehe werte-mapping.csv |
| `operationList/operation/informationGroup/typeOfResection` | Art der Resektion | MultipleChoice (mehrfach) | D | OS.OPS (Unterformular von OS.Operative Therapie) → OPSCode (OPS) | VERMUTUNG, muss fachlich geprüft werden (Kodierung/Chirurgie): abgeleitet aus OPS-Codes (E-5); Alternative: eigenes nNGM-Feld mit nNGM-Codes (E-0, Weg 1); Metastasenresektion über Feld „Metastasenresektion“ = ja |
| `operationList/operation/informationGroup/otherTypeOfResection` | Bitte spezifizieren Sie "Sonstiges" | FreeText | C | NNGM.Operative Therapie (abgeleitet, noch nicht gebaut) → otherTypeOfResection | Freitext „Sonstiges“: kein eigenes Feld (höchstens Bemerkung); Ziel Erweiterungskatalog des abgeleiteten Formulars (E-8, Herstellerantwort 11.11.2026) |
| `operationList/operation/informationGroup/resectionStatus` | Resektionsstatus | Enumeration | B | OS.Operative Therapie → RKlassifikation (OS.R-Klassifikation) | Codes gleich bis auf Schreibweise; R0a/R0b/R2a/R2b → R0/R2; sichtbar nur bei Tumorresektion oder Metastasenresektion |
| `operationList/operation/informationGroup/outcomeDeath` | Ausgang mit Todesfolge | Enumeration | C | NNGM.Operative Therapie (abgeleitet, noch nicht gebaut) → outcomeDeath | kein Feld; ableitbar wäre CTCAE-Grad 5 in Komplikationen oder Sterbedatum nahe OP-Datum – von nNGM nicht definiert; Ziel Erweiterungskatalog des abgeleiteten Formulars (E-8, Herstellerantwort 11.11.2026) |
| `operationList/operation/localisationGroup/localisation` | Lokalisation | Enumeration | D | OS.OPS (Unterformular von OS.Operative Therapie) → OPSCode (OPS) | VERMUTUNG, muss fachlich geprüft werden (Kodierung/Chirurgie): abgeleitet aus OPS-Codes (E-5); Alternative: eigenes nNGM-Feld mit nNGM-Codes (E-0, Weg 1); OPS-Kapitel 5-32x Lunge, 5-50x Leber, 5-01x Gehirn, 5-07x Nebenniere; bei Metastasenresektion auch „befallene Organe“ (PUL/HEP/BRA/ADR/OTH) |
| `operationList/operation/localisationGroup/localisationOther` | Andere | FreeText | C | NNGM.Operative Therapie (abgeleitet, noch nicht gebaut) → localisationOther | Freitext „Andere“: kein eigenes Feld (höchstens Bemerkung); Ziel Erweiterungskatalog des abgeleiteten Formulars (E-8, Herstellerantwort 11.11.2026) |
| `operationList/operation/ectomyGroup/lymphadenectomy` | Lymphadenektomie | Enumeration | D | OS.OPS (Unterformular von OS.Operative Therapie) → OPSCode (OPS) | VERMUTUNG, muss fachlich geprüft werden (Kodierung/Chirurgie): abgeleitet aus OPS-Codes (E-5); Alternative: eigenes nNGM-Feld mit nNGM-Codes (E-0, Weg 1); ja bei OPS „mit radikaler Lymphadenektomie“ oder 5-401/5-404; Feld „Lymphonodektomie“ nur für CH sichtbar; Option E-8: Feld „Lymphonodektomie“ im abgeleiteten Formular einblenden statt OPS-Ableitung |
| `operationList/operation/otherInformationGroup/note` | Bemerkungen | FreeText | A | OS.Operative Therapie → Bemerkung |  |

#### Ungelöst (2)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `operationList/operation/executionGroup/executionCenter` | Durchführende Einrichtung | NngmNetworkLocation | D |  | NngmNetworkLocation – allgemeine Frage Netzwerkpartner |
| `operationList/operation/localisationGroup/sideLocalisation` | Seitenlokalisation | Enumeration | B | OS.Operative Therapie → Seite (ADT.Seitenlokalisation) | Werte identisch (B/L/R/U), aber Feld „Seite“ im Formular immer ausgeblendet (Filter false) – Feld nutzen oder Seite der Erkrankung? (E-5); Option E-8: Feld „Seite“ im abgeleiteten Formular einblenden |

<details>
<summary>Strukturelemente (7: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `operationList` | Operationen | List | Struktur |  | Liste → ein Formulareintrag je Operation |
| `operationList/operation` | Operation | ListEntry (mehrfach) | Struktur | OS.Operative Therapie | je Eintrag ein OS.Operative Therapie mit Status = D (durchgeführt), sonst sind Intention/OPS ausgeblendet |
| `operationList/operation/executionGroup` | Durchführung | FieldGroup | Struktur |  |  |
| `operationList/operation/informationGroup` | Operationsmerkmale | FieldGroup | Struktur |  |  |
| `operationList/operation/localisationGroup` | Lokalisation | FieldGroup | Struktur |  |  |
| `operationList/operation/ectomyGroup` | Ektomie | FieldGroup | Struktur |  |  |
| `operationList/operation/otherInformationGroup` | Sonstiges | FieldGroup | Struktur |  |  |

</details>

#### Werteübersetzungen

**`operationList/operation/informationGroup/operationIntention`** – Operative Intention

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| curative | K = kurativ | OS.Therapieintention |  | K | Kurativ | vorläufig |  |
| palliative | P = palliativ | OS.Therapieintention |  | P | Palliativ | vorläufig |  |
| diagnostic | D = diagnostisch | OS.Therapieintention |  | D | Diagnostisch | vorläufig |  |
| revisionOrcomplication | R = Revision/Komplikation | OS.Therapieintention |  | R | Revision/Komplikation | vorläufig |  |
| other | S = Sonstiges | OS.Therapieintention |  | S | Sonstige | vorläufig |  |
| missingInformation | X = fehlende Angabe | OS.Therapieintention |  | UNK | Unbekannt | vorläufig | Version 3 hat kein X |
|  |  | OS.Therapieintention |  | O | lokal kurativ bei Oligometastasierung | ungelöst | Export: curative oder other? |
| other | S = Sonstiges | OS.Therapieintention |  | PRO | Prophylaktisch | vorläufig | nur Export-Richtung |

**`operationList/operation/informationGroup/typeOfResection`** – Art der Resektion

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| wedgeResection | Keilresektion | OPS |  | 5-322.d, 5-322.e, 5-322.g, 5-322.h (übrige 5-322 atypische Resektion?) |  | vorläufig | VERMUTUNG – Code-Liste muss fachlich geprüft werden |
| segmentalResection | Segmentresektion | OPS |  | 5-323.* |  | vorläufig | VERMUTUNG – Code-Liste muss fachlich geprüft werden |
| lobectomy | Lobektomie | OPS |  | 5-324.6, 5-324.7, 5-324.a, 5-324.b, 5-325.0–5-325.4 |  | vorläufig | VERMUTUNG – Code-Liste muss fachlich geprüft werden |
| bilobectomy | Bilobektomie | OPS |  | 5-324.2, 5-324.3, 5-324.8, 5-324.9, 5-325.5–5-325.9 |  | vorläufig | VERMUTUNG – Code-Liste muss fachlich geprüft werden |
| pneumectomy | Pneumektomie | OPS |  | 5-327.*, 5-328.* |  | vorläufig | VERMUTUNG – Code-Liste muss fachlich geprüft werden |
| metastasectomy | Metastasenresektion | OPS |  | Feld Metastasenresektion = 1 |  | vorläufig | VERMUTUNG – Code-Liste muss fachlich geprüft werden |
| other | Sonstiges | OPS |  | andere OPS |  | vorläufig | VERMUTUNG – Code-Liste muss fachlich geprüft werden |
| unknown | Unbekannt | OPS |  | kein OPS |  | vorläufig | VERMUTUNG – Code-Liste muss fachlich geprüft werden |

**`operationList/operation/informationGroup/resectionStatus`** – Resektionsstatus

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| r0 | R0 | OS.R-Klassifikation |  | R0, R0a, R0b | R0 | vorläufig |  |
| r1 | R1 | OS.R-Klassifikation |  | R1 | R1 | vorläufig |  |
| r2 | R2 | OS.R-Klassifikation |  | R2, R2a, R2b | R2 | vorläufig |  |
| r1Is | R1 (is) | OS.R-Klassifikation |  | R1(is) | R1(is) | vorläufig |  |
| r1Cy+ | R1 (cy+) | OS.R-Klassifikation |  | R1(cy+) | R1(cy+) | vorläufig |  |
| rx | RX | OS.R-Klassifikation |  | RX | RX | vorläufig |  |
| u | U = nicht bekannt | OS.R-Klassifikation |  | U | Unbekannt | vorläufig |  |

**`operationList/operation/localisationGroup/sideLocalisation`** – Seitenlokalisation

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| B | beiderseits | ADT.Seitenlokalisation |  | B | Beidseitig | ungelöst | Feld ausgeblendet (E-5) |
| L | links | ADT.Seitenlokalisation |  | L | Links | ungelöst |  |
| R | rechts | ADT.Seitenlokalisation |  | R | Rechts | ungelöst |  |
| unknown | Unbekannt | ADT.Seitenlokalisation |  | U | Unbekannt | ungelöst |  |
|  |  | ADT.Seitenlokalisation |  | M, T | Mittellinie, Trifft nicht zu | ungelöst | kein nNGM-Wert |

### Strahlentherapie (`radioTherapy`)

24 Felder – 1 bestätigt, 20 vorläufig, 3 ungelöst. Entscheidungen: E-4, E-5, E-6.

#### Bestätigt (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `radiotherapyList/radiotherapy/id` | ID des Listeneintrags | EntryId | A | → prozedur.id |  |

#### Vorläufig (12)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `radiotherapyList/radiotherapy/executionGroup/therapyStart` | Therapiebeginn | MedicalDate | A | OS.Strahlentherapie → Beginn |  |
| `radiotherapyList/radiotherapy/executionGroup/therapyEnd` | Therapieende | MedicalDate | A | OS.Strahlentherapie → Ende | ongoing → Ende leer |
| `radiotherapyList/radiotherapy/informationGroup/radiationTargetSide` | Seite Zielgebiet | Enumeration | A | OS.StrahlentherapieEinzel (Unterformular von OS.Strahlentherapie) → Seite (ADT.Seitenlokalisation) | L/R/B/M/U/T identisch; mehrere Einzelbestrahlungen mit unterschiedlichen Werten: welcher wird gemeldet? (E-6) |
| `radiotherapyList/radiotherapy/informationGroup/therapeuticIntention` | Intention der Strahlentherapie | Enumeration | B | OS.Strahlentherapie → Intention (OS.Therapieintention) | K/P/O/S identisch, X → UNK |
| `radiotherapyList/radiotherapy/informationGroup/otherTherapeuticIntention` | Sonstiges | FreeText | C | NNGM.Strahlentherapie (abgeleitet, noch nicht gebaut) → otherTherapeuticIntention | Freitext „Sonstiges“: kein eigenes Feld (höchstens Bemerkung); Ziel Erweiterungskatalog des abgeleiteten Formulars (E-8, Herstellerantwort 11.11.2026) |
| `radiotherapyList/radiotherapy/informationGroup/positionSurgicalTherapy` | Stellung zu operativer Therapie | Enumeration | B | OS.Strahlentherapie → Relation (CDA.ZeitlicheRelation) | O/A/N/I/Z/S identisch, T und UKN ohne nNGM-Wert |
| `radiotherapyList/radiotherapy/doseGroup/totalDose` | Gesamtdosis | Decimal | A | OS.Strahlentherapie → Gesamtdosis | Gesamtdosis (Gy); alternativ je Einzelbestrahlung „Gesamtdosis incl. Boost“ |
| `radiotherapyList/radiotherapy/boostGroup/boostExecuted` | Boost durchgeführt | Enumeration | A | OS.StrahlentherapieEinzel (Unterformular von OS.Strahlentherapie) → BoostBestrahlung (OS.ST.Boost) | J/SIB/SEQ/KON/N identisch; mehrere Einzelbestrahlungen mit unterschiedlichen Werten: welcher wird gemeldet? (E-6) |
| `radiotherapyList/radiotherapy/boostGroup/boostDoseInTotalDose` | Boostdosis in Gesamtdosis enthalten | Enumeration | D | OS.StrahlentherapieEinzel (Unterformular von OS.Strahlentherapie) → Gesamtdosis / DosisAppliziert | abgeleitet: Onkostar trennt „Dosis appliziert ohne Boost“ und „Gesamtdosis incl. Boost“ – hängt daran, welche Dosis als totalDose exportiert wird |
| `radiotherapyList/radiotherapy/boostGroup/boostDose` | Boostdosis | Decimal | A | OS.StrahlentherapieEinzel (Unterformular von OS.Strahlentherapie) → DosisBoostAppliziert | mehrere Einzelbestrahlungen mit unterschiedlichen Werten: welcher wird gemeldet? (E-6) |
| `radiotherapyList/radiotherapy/therapyEndGroup/endOfRadiotherapy` | Ende der Bestrahlung | MultipleChoice (mehrfach) | B | OS.Strahlentherapie → Beendigungsstatus + GrundAbbruch + Unterbrechung (ADT.BeendigungsstatusTherapie / OS.Abbruchgrund) | Werte siehe werte-mapping.csv; F: nNGM > 3 Kalendertage, Onkostar > 3 Werktage |
| `radiotherapyList/radiotherapy/otherInformationGroup/note` | Bemerkungen | FreeText | A | OS.Strahlentherapie → Bemerkung |  |

#### Ungelöst (3)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `radiotherapyList/radiotherapy/executionGroup/executionCenter` | Durchführende Einrichtung | NngmNetworkLocation | D |  | NngmNetworkLocation – allgemeine Frage Netzwerkpartner |
| `radiotherapyList/radiotherapy/informationGroup/radiationTarget` | Zielgebiet | MultipleChoice (mehrfach) | B | OS.StrahlentherapieEinzel (Unterformular von OS.Strahlentherapie) → Zielgebiet (CDA) oder ZielgebietLK (oBDS) (CDA.Zielgebiet Strahlentherapie / oBDS.Zielgebiete) | oBDS.Zielgebiete: 98/99 Codes identisch (Code vor „_“), aber Feld nur bei LK-Bestrahlung sichtbar; Hauptfeld nutzt CDA-Katalog mit anderer Codesystematik (1.1 Hirnschädel ≠ 1.1 Ganzhirn), Übersetzung fehlt; Export sammelt Zielgebiete aller Einzelbestrahlungen (E-6); Option E-8: oBDS-Zielgebiet (ZielgebietLK) im abgeleiteten Formular immer einblenden |
| `radiotherapyList/radiotherapy/doseGroup/singleDose` | Einzeldosis pro Tag | Decimal | D | OS.StrahlentherapieEinzel (Unterformular von OS.Strahlentherapie) → EinzeldosisFraktion | nNGM: Dosis pro TAG, Onkostar: Dosis pro FRAKTION – nur gleich bei 1 Fraktion/Tag (OS.Strahlentherapie.KonvFraktionierung = ja); bei Hyperfraktionierung (z. B. 2 × 1,5 Gy/Tag) nicht ableitbar, Fraktionen pro Tag werden nicht erfasst; mehrere Einzelbestrahlungen mit unterschiedlichen Werten: welcher wird gemeldet? (E-6); Option E-8: eigenes Feld „Einzeldosis pro Tag“ im Erweiterungskatalog |

<details>
<summary>Strukturelemente (8: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `radiotherapyList` | Strahlentherapien | List | Struktur |  | Liste → ein Formulareintrag je Strahlentherapie |
| `radiotherapyList/radiotherapy` | Strahlentherapie | ListEntry (mehrfach) | Struktur | OS.Strahlentherapie | je Eintrag ein OS.Strahlentherapie mit Status = D; Details in OS.StrahlentherapieEinzel (je Zielgebiet ein Eintrag). Weg-1-Variante: NNGM.Strahlentherapie (E-6) |
| `radiotherapyList/radiotherapy/executionGroup` | Durchführung | FieldGroup | Struktur |  |  |
| `radiotherapyList/radiotherapy/informationGroup` | Therapiemerkmale | FieldGroup | Struktur |  |  |
| `radiotherapyList/radiotherapy/doseGroup` | Dosis | FieldGroup | Struktur |  |  |
| `radiotherapyList/radiotherapy/boostGroup` | Boost | FieldGroup | Struktur |  |  |
| `radiotherapyList/radiotherapy/therapyEndGroup` | Ende der Therapie | FieldGroup | Struktur |  |  |
| `radiotherapyList/radiotherapy/otherInformationGroup` | Sonstiges | FieldGroup | Struktur |  |  |

</details>

#### Werteübersetzungen

**`radiotherapyList/radiotherapy/informationGroup/radiationTarget`** – Zielgebiet

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | oBDS.Zielgebiete |  | Code vor „_“ (z. B. 4.10_upperAbdomen → 4.10) |  | ungelöst | nur für Feld ZielgebietLK; Hauptfeld (CDA) braucht eigene Übersetzung (E-6) |
| unknown | Unbekannt | oBDS.Zielgebiete |  |  |  | ungelöst | nicht in oBDS.Zielgebiete |

**`radiotherapyList/radiotherapy/informationGroup/radiationTargetSide`** – Seite Zielgebiet

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| left | L = links | ADT.Seitenlokalisation |  | L | Links | vorläufig |  |
| right | R = rechts | ADT.Seitenlokalisation |  | R | Rechts | vorläufig |  |
| both | B = beidseits | ADT.Seitenlokalisation |  | B | Beidseitig | vorläufig |  |
| middle | M = mittig | ADT.Seitenlokalisation |  | M | Mittellinie | vorläufig |  |
| unknown | U = unbekannt | ADT.Seitenlokalisation |  | U | Unbekannt | vorläufig |  |
| notApplicable | T = trifft nicht zu | ADT.Seitenlokalisation |  | T | Trifft nicht zu | vorläufig |  |

**`radiotherapyList/radiotherapy/informationGroup/therapeuticIntention`** – Intention der Strahlentherapie

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| curative | K = kurativ | OS.Therapieintention |  | K | Kurativ | vorläufig |  |
| palliative | P = palliativ | OS.Therapieintention |  | P | Palliativ | vorläufig |  |
| locallyCurativeOrDefinitive | O = lokal kurativ bei Oligometastasierung / definitiv | OS.Therapieintention |  | O | lokal kurativ bei Oligometastasierung | vorläufig |  |
| other | S = Sonstiges | OS.Therapieintention |  | S | Sonstige | vorläufig |  |
| missingInformation | X = keine Angabe | OS.Therapieintention |  | UNK | Unbekannt | vorläufig | Version 3 hat kein X |
| other | S = Sonstiges | OS.Therapieintention |  | PRO, D, R | Prophylaktisch, Diagnostisch, Revision/Komplikation | vorläufig | nur Export-Richtung |

**`radiotherapyList/radiotherapy/informationGroup/positionSurgicalTherapy`** – Stellung zu operativer Therapie

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | CDA.ZeitlicheRelation |  | O/A/N/I/Z/S identisch |  | vorläufig | wie systemicTherapy |
|  |  | CDA.ZeitlicheRelation |  | T, UKN | Alleinige Therapie, Unbekannt | ungelöst | kein nNGM-Wert |

**`radiotherapyList/radiotherapy/boostGroup/boostExecuted`** – Boost durchgeführt

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | J = ja, mit Boost o. n. A. | OS.ST.Boost |  | J | ja, mit Boost o. n. A. | vorläufig |  |
| simultaneousIntegrated | SIB | OS.ST.Boost |  | SIB | simultan integrierter Boost | vorläufig |  |
| sequentialBoost | SEQ | OS.ST.Boost |  | SEQ | sequentieller Boost | vorläufig |  |
| concomitantBoost | KON | OS.ST.Boost |  | KON | konkomitanter Boost | vorläufig |  |
| no | N = nein, ohne Boost | OS.ST.Boost |  | N | nein, ohne Boost | vorläufig |  |

**`radiotherapyList/radiotherapy/therapyEndGroup/endOfRadiotherapy`** – Ende der Bestrahlung

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| regularEnd | E = reguläres Ende | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=E |  | vorläufig |  |
| targetReachedWithInterruption | F = Zieldosis erreicht mit Unterbrechung > 3 Kalendertage | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=E, Unterbrechung=J |  | vorläufig | Onkostar: > 3 Werktage |
| discontinuationSideEffects | A = Abbruch wegen Nebenwirkungen | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=A, GrundAbbruch=A |  | vorläufig |  |
| discontinuationProgress | P = Abbruch wegen Progress | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=A, GrundAbbruch=P |  | vorläufig |  |
| discontinuationOther | S = Abbruch aus sonstigen Gründen | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=A, GrundAbbruch=M oder S |  | vorläufig |  |
| patientRefusal | V = Patient verweigert weitere Therapie | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=A, GrundAbbruch=V |  | vorläufig |  |
| patientDeceased | T = Patient verstorben | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=A, GrundAbbruch=T |  | vorläufig |  |
| unknown | U = unbekannt | ADT.BeendigungsstatusTherapie / OS.Abbruchgrund |  | Beendigungsstatus=U |  | vorläufig |  |

## Verlauf und Molekularpathologie

<details>
<summary><b>E-9</b> – Rezidiv/Progress und Resistenztestungen (Arbeitsstand) (09.11.2026)</summary>

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

</details>

### Rezidiv/Progress + Resistenztestung (`progressRezidiv`)

130 Felder – 64 vorläufig, 11 unvollständig, 55 ungelöst. Entscheidungen: E-9.

#### Vorläufig (43)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `observationList/observation/id` | ID des Listeneintrags | EntryId | A | → prozedur.id |  |
| `observationList/observation/date` | Datum | MedicalDate | A | OS.Verlauf (Basis von NNGM.Verlauf) → Datum |  |
| `observationList/observation/rezidivProgress` | Rezidiv/Progress | Enumeration | B | OS.Verlauf bzw. NNGM.Verlauf (E-9) → Variante A: Gesamtbeurteilung / Variante B: rezidivProgress (ADT.Gesamtbeurteilung / NNGM.yesNo) | Variante offen (E-9): A) Gesamtbeurteilung nutzen, P (Progression) und Y (Rezidiv) bleiben unterscheidbar, beide → yes, keine Doppelerfassung; B) eigenes Ja/Nein-Feld (NNGM.yesNo) im Erweiterungskatalog von NNGM.Verlauf, genau wie nNGM; Variante B2) Gesamtbeurteilung im abgeleiteten Formular auf P/Y beschränken (Machbarkeit ungeprüft) |
| `observationList/observation/therapiesList/alk/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `observationList/observation/therapiesList/alk/alkDate` | Datum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `observationList/observation/therapiesList/alk/alkFusionGroup/fusionPartner` | Fusionspartner | FreeText | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusioniertesGen (OS.Molekulargenetik) | nNGM Freitext, Onkostar Genkatalog (alternativ HGNC-Symbol des Fusionspartners als Freitext) |
| `observationList/observation/therapiesList/braf/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `observationList/observation/therapiesList/braf/brafDate` | Datum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `observationList/observation/therapiesList/braf/brafExon` | Exon | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ExonInt | Feld „Exon“ (ExonText ist im Formular ausgeblendet) |
| `observationList/observation/therapiesList/braf/brafHgvsC` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P (Einfache Variante) |
| `observationList/observation/therapiesList/braf/brafHgvsP` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P (Einfache Variante) |
| `observationList/observation/therapiesList/egfr/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `observationList/observation/therapiesList/egfr/egfrDate` | Datum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `observationList/observation/therapiesList/egfr/egfrMutationGroup/egfrExon` | Exon | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ExonInt | Feld „Exon“ (ExonText ist im Formular ausgeblendet) |
| `observationList/observation/therapiesList/egfr/egfrMutationGroup/egfrHgvsC` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P (Einfache Variante) |
| `observationList/observation/therapiesList/egfr/egfrMutationGroup/egfrHgvsP` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P (Einfache Variante) |
| `observationList/observation/therapiesList/fgfr/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `observationList/observation/therapiesList/fgfr/fgfrDate` | Datum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `observationList/observation/therapiesList/kras/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `observationList/observation/therapiesList/kras/krasDate` | Datum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `observationList/observation/therapiesList/kras/krasExon` | Exon | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ExonInt | Feld „Exon“ (ExonText ist im Formular ausgeblendet) |
| `observationList/observation/therapiesList/kras/krasHgvsC` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P (Einfache Variante) |
| `observationList/observation/therapiesList/kras/krasHgvsP` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P (Einfache Variante) |
| `observationList/observation/therapiesList/met/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `observationList/observation/therapiesList/met/metDate` | Datum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `observationList/observation/therapiesList/met/metExon` | Exon | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ExonInt | Feld „Exon“ (ExonText ist im Formular ausgeblendet) |
| `observationList/observation/therapiesList/met/metHgvsC` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P (Einfache Variante) |
| `observationList/observation/therapiesList/met/metHgvsP` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P (Einfache Variante) |
| `observationList/observation/therapiesList/ntrk1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `observationList/observation/therapiesList/ntrk1/ntrk1Date` | Datum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `observationList/observation/therapiesList/ntrk1/ntrk1FusionGroup/ntrk1FusionPartner` | Fusionspartner | FreeText | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusioniertesGen (OS.Molekulargenetik) | nNGM Freitext, Onkostar Genkatalog (alternativ HGNC-Symbol des Fusionspartners als Freitext) |
| `observationList/observation/therapiesList/ntrk2/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `observationList/observation/therapiesList/ntrk2/ntrk2Date` | Datum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `observationList/observation/therapiesList/ntrk2/ntrk2FusionGroup/ntrk2FusionPartner` | Fusionspartner | FreeText | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusioniertesGen (OS.Molekulargenetik) | nNGM Freitext, Onkostar Genkatalog (alternativ HGNC-Symbol des Fusionspartners als Freitext) |
| `observationList/observation/therapiesList/ntrk3/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `observationList/observation/therapiesList/ntrk3/ntrk3Date` | Datum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `observationList/observation/therapiesList/ntrk3/ntrk3FusionGroup/ntrk3FusionPartner` | Fusionspartner | FreeText | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusioniertesGen (OS.Molekulargenetik) | nNGM Freitext, Onkostar Genkatalog (alternativ HGNC-Symbol des Fusionspartners als Freitext) |
| `observationList/observation/therapiesList/ret/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `observationList/observation/therapiesList/ret/retDate` | Datum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `observationList/observation/therapiesList/ret/retFusionGroup/retFusionPartner` | Fusionspartner | FreeText | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusioniertesGen (OS.Molekulargenetik) | nNGM Freitext, Onkostar Genkatalog (alternativ HGNC-Symbol des Fusionspartners als Freitext) |
| `observationList/observation/therapiesList/ros1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `observationList/observation/therapiesList/ros1/ros1Date` | Datum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `observationList/observation/therapiesList/ros1/ros1FusionGroup/ros1FusionPartner` | Fusionspartner | FreeText | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusioniertesGen (OS.Molekulargenetik) | nNGM Freitext, Onkostar Genkatalog (alternativ HGNC-Symbol des Fusionspartners als Freitext) |

#### Unvollständig (11)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `observationList/observation/therapiesList/alk/alkExaminations` | Durchgeführte Untersuchungen | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → Panel / AnalyseMethode (OS.MolDiag.Panels / OS.MolDiagMethode) | Panels/Tests: OS.MolDiag.Panels kennt nur 3 Panels (AmpliSeq v2, Oncomine v3, TSO500), nNGM rund 15 Panels + FISH-Tests → unvollständig; Option E-8: nNGM-Katalog im Erweiterungskatalog |
| `observationList/observation/therapiesList/braf/brafExaminations` | Durchgeführte Untersuchungen | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → Panel / AnalyseMethode (OS.MolDiag.Panels / OS.MolDiagMethode) | Panels/Tests: OS.MolDiag.Panels kennt nur 3 Panels (AmpliSeq v2, Oncomine v3, TSO500), nNGM rund 15 Panels + FISH-Tests → unvollständig; Option E-8: nNGM-Katalog im Erweiterungskatalog |
| `observationList/observation/therapiesList/egfr/egfrExaminations` | Durchgeführte Untersuchungen | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → Panel / AnalyseMethode (OS.MolDiag.Panels / OS.MolDiagMethode) | Panels/Tests: OS.MolDiag.Panels kennt nur 3 Panels (AmpliSeq v2, Oncomine v3, TSO500), nNGM rund 15 Panels + FISH-Tests → unvollständig; Option E-8: nNGM-Katalog im Erweiterungskatalog |
| `observationList/observation/therapiesList/fgfr/fgfrExaminations` | Durchgeführte Untersuchungen | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → Panel / AnalyseMethode (OS.MolDiag.Panels / OS.MolDiagMethode) | Panels/Tests: OS.MolDiag.Panels kennt nur 3 Panels (AmpliSeq v2, Oncomine v3, TSO500), nNGM rund 15 Panels + FISH-Tests → unvollständig; Option E-8: nNGM-Katalog im Erweiterungskatalog |
| `observationList/observation/therapiesList/kras/krasExaminations` | Durchgeführte Untersuchungen | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → Panel / AnalyseMethode (OS.MolDiag.Panels / OS.MolDiagMethode) | Panels/Tests: OS.MolDiag.Panels kennt nur 3 Panels (AmpliSeq v2, Oncomine v3, TSO500), nNGM rund 15 Panels + FISH-Tests → unvollständig; Option E-8: nNGM-Katalog im Erweiterungskatalog |
| `observationList/observation/therapiesList/met/metExaminations` | Durchgeführte Untersuchungen | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → Panel / AnalyseMethode (OS.MolDiag.Panels / OS.MolDiagMethode) | Panels/Tests: OS.MolDiag.Panels kennt nur 3 Panels (AmpliSeq v2, Oncomine v3, TSO500), nNGM rund 15 Panels + FISH-Tests → unvollständig; Option E-8: nNGM-Katalog im Erweiterungskatalog |
| `observationList/observation/therapiesList/ntrk1/ntrk1Examinations` | Durchgeführte Untersuchungen | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → Panel / AnalyseMethode (OS.MolDiag.Panels / OS.MolDiagMethode) | Panels/Tests: OS.MolDiag.Panels kennt nur 3 Panels (AmpliSeq v2, Oncomine v3, TSO500), nNGM rund 15 Panels + FISH-Tests → unvollständig; Option E-8: nNGM-Katalog im Erweiterungskatalog |
| `observationList/observation/therapiesList/ntrk2/ntrk2Examinations` | Durchgeführte Untersuchungen | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → Panel / AnalyseMethode (OS.MolDiag.Panels / OS.MolDiagMethode) | Panels/Tests: OS.MolDiag.Panels kennt nur 3 Panels (AmpliSeq v2, Oncomine v3, TSO500), nNGM rund 15 Panels + FISH-Tests → unvollständig; Option E-8: nNGM-Katalog im Erweiterungskatalog |
| `observationList/observation/therapiesList/ntrk3/ntrk3Examinations` | Durchgeführte Untersuchungen | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → Panel / AnalyseMethode (OS.MolDiag.Panels / OS.MolDiagMethode) | Panels/Tests: OS.MolDiag.Panels kennt nur 3 Panels (AmpliSeq v2, Oncomine v3, TSO500), nNGM rund 15 Panels + FISH-Tests → unvollständig; Option E-8: nNGM-Katalog im Erweiterungskatalog |
| `observationList/observation/therapiesList/ret/retExaminations` | Durchgeführte Untersuchungen | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → Panel / AnalyseMethode (OS.MolDiag.Panels / OS.MolDiagMethode) | Panels/Tests: OS.MolDiag.Panels kennt nur 3 Panels (AmpliSeq v2, Oncomine v3, TSO500), nNGM rund 15 Panels + FISH-Tests → unvollständig; Option E-8: nNGM-Katalog im Erweiterungskatalog |
| `observationList/observation/therapiesList/ros1/ros1Examinations` | Durchgeführte Untersuchungen | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → Panel / AnalyseMethode (OS.MolDiag.Panels / OS.MolDiagMethode) | Panels/Tests: OS.MolDiag.Panels kennt nur 3 Panels (AmpliSeq v2, Oncomine v3, TSO500), nNGM rund 15 Panels + FISH-Tests → unvollständig; Option E-8: nNGM-Katalog im Erweiterungskatalog |

#### Ungelöst (22)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `observationList/observation/therapiesList/alk/otherAlkExamination` | Bitte spezifizieren Sie "Andere" | FreeText | C |  | Freitext „Andere“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `observationList/observation/therapiesList/alk/alkTherapyList/alkTherapy/alkTherapyValue` | Therapie | Enumeration | D |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/braf/otherBrafExamination` | Bitte spezifizieren Sie "Andere" | FreeText | C |  | Freitext „Andere“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `observationList/observation/therapiesList/braf/brafTherapyList/brafTherapy/brafTherapyValue` | Therapie | Enumeration | D |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/egfr/otherEgfrExamination` | Bitte spezifizieren Sie "Andere" | FreeText | C |  | Freitext „Andere“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `observationList/observation/therapiesList/egfr/egfrTherapyList/egfrTherapy/egfrTherapyValue` | Therapie | Enumeration | D |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/fgfr/otherFgfrExamination` | Bitte spezifizieren Sie "Andere" | FreeText | C |  | Freitext „Andere“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `observationList/observation/therapiesList/fgfr/fgfrTherapyList/fgfrTherapy/fgfrTherapyValue` | Therapie | Enumeration | D |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/kras/otherKrasExamination` | Bitte spezifizieren Sie "Andere" | FreeText | C |  | Freitext „Andere“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `observationList/observation/therapiesList/kras/krasTherapyList/krasTherapy/krasTherapyValue` | Therapie | Enumeration | D |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/met/otherMetExamination` | Bitte spezifizieren Sie "Andere" | FreeText | C |  | Freitext „Andere“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `observationList/observation/therapiesList/met/metTherapyList/metTherapy/metTherapyValue` | Therapie | Enumeration | D |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk1/otherNtrk1Examination` | Bitte spezifizieren Sie "Andere" | FreeText | C |  | Freitext „Andere“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `observationList/observation/therapiesList/ntrk1/ntrk1TherapyList/ntrk1Therapy/ntrk1TherapyValue` | Therapie | Enumeration | D |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk2/otherNtrk2Examination` | Bitte spezifizieren Sie "Andere" | FreeText | C |  | Freitext „Andere“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `observationList/observation/therapiesList/ntrk2/ntrk2TherapyList/ntrk2Therapy/ntrk2TherapyValue` | Therapie | Enumeration | D |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk3/otherNtrk3Examination` | Bitte spezifizieren Sie "Andere" | FreeText | C |  | Freitext „Andere“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `observationList/observation/therapiesList/ntrk3/ntrk3TherapyList/ntrk3Therapy/ntrk3TherapyValue` | Therapie | Enumeration | D |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ret/otherRetExamination` | Bitte spezifizieren Sie "Andere" | FreeText | C |  | Freitext „Andere“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `observationList/observation/therapiesList/ret/retTherapyList/retTherapy/retTherapyValue` | Therapie | Enumeration | D |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ros1/otherRos1Examination` | Bitte spezifizieren Sie "Andere" | FreeText | C |  | Freitext „Andere“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `observationList/observation/therapiesList/ros1/ros1TherapyList/ros1Therapy/ros1TherapyValue` | Therapie | Enumeration | D |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |

<details>
<summary>Strukturelemente (54: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `observationList` | Rezidiv/Progress | List | Struktur |  | Liste → ein OS.Verlauf je Ereignis |
| `observationList/observation` | Rezidiv/Progress | ListEntry (mehrfach) | Struktur | OS.Verlauf (Basis von NNGM.Verlauf) | je Rezidiv/Progress-Ereignis ein OS.Verlauf |
| `observationList/observation/therapiesList` | Resistenztestungen | List | Struktur |  | Resistenztestungen → OS.Molekulargenetik + je Gen OS.Molekulargenetische Untersuchung; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9) |
| `observationList/observation/therapiesList/alk` | Resistenztestung ALK | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = ALK (OS.Molekulargenetik) | je Resistenztestung ein OS.Molekulargenetik mit Untersuchung je Gen; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9) |
| `observationList/observation/therapiesList/alk/alkFusionGroup` | ALK-Fusion | FieldGroup | Struktur |  |  |
| `observationList/observation/therapiesList/alk/alkTherapyList` | ALK-TKI Therapien | List | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/alk/alkTherapyList/alkTherapy` | ALK-TKI Therapie | ListEntry (mehrfach) | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/alk/alkTherapyList/alkTherapy/id` | ID des Listeneintrags | EntryId | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/braf` | Resistenztestung BRAF | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = BRAF (OS.Molekulargenetik) | je Resistenztestung ein OS.Molekulargenetik mit Untersuchung je Gen; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9) |
| `observationList/observation/therapiesList/braf/brafTherapyList` | BRAF-Inhibitor Therapien | List | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/braf/brafTherapyList/brafTherapy` | BRAF-Inhibitor Therapie | ListEntry (mehrfach) | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/braf/brafTherapyList/brafTherapy/id` | ID des Listeneintrags | EntryId | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/egfr` | Resistenztestung EGFR | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = EGFR (OS.Molekulargenetik) | je Resistenztestung ein OS.Molekulargenetik mit Untersuchung je Gen; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9) |
| `observationList/observation/therapiesList/egfr/egfrMutationGroup` | EGFR-Mutation | FieldGroup | Struktur |  |  |
| `observationList/observation/therapiesList/egfr/egfrTherapyList` | EGFR-TKI Therapien | List | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/egfr/egfrTherapyList/egfrTherapy` | EGFR-TKI Therapie | ListEntry (mehrfach) | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/egfr/egfrTherapyList/egfrTherapy/id` | ID des Listeneintrags | EntryId | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/fgfr` | Resistenztestung FGFR | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = FGFR (OS.Molekulargenetik) | je Resistenztestung ein OS.Molekulargenetik mit Untersuchung je Gen; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9); nNGM „FGFR“ ohne Nummer, Onkostar kennt FGFR1/FGFR2/FGFR3 – welches? |
| `observationList/observation/therapiesList/fgfr/fgfrTherapyList` | FGFR-TKI Therapien | List | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/fgfr/fgfrTherapyList/fgfrTherapy` | FGFR-TKI Therapie | ListEntry (mehrfach) | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/fgfr/fgfrTherapyList/fgfrTherapy/id` | ID des Listeneintrags | EntryId | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/kras` | Resistenztestung KRAS | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = KRAS (OS.Molekulargenetik) | je Resistenztestung ein OS.Molekulargenetik mit Untersuchung je Gen; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9) |
| `observationList/observation/therapiesList/kras/krasTherapyList` | KRAS-Inhibitor Therapien | List | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/kras/krasTherapyList/krasTherapy` | KRAS-Inhibitor Therapie | ListEntry (mehrfach) | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/kras/krasTherapyList/krasTherapy/id` | ID des Listeneintrags | EntryId | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/met` | Resistenztestung MET | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = MET (OS.Molekulargenetik) | je Resistenztestung ein OS.Molekulargenetik mit Untersuchung je Gen; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9) |
| `observationList/observation/therapiesList/met/metTherapyList` | MET-TKI Therapien | List | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/met/metTherapyList/metTherapy` | MET-TKI Therapie | ListEntry (mehrfach) | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/met/metTherapyList/metTherapy/id` | ID des Listeneintrags | EntryId | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk1` | Resistenztestung NTRK1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = NTRK1 (OS.Molekulargenetik) | je Resistenztestung ein OS.Molekulargenetik mit Untersuchung je Gen; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9) |
| `observationList/observation/therapiesList/ntrk1/ntrk1FusionGroup` | NTRK1-Fusion | FieldGroup | Struktur |  |  |
| `observationList/observation/therapiesList/ntrk1/ntrk1TherapyList` | NTRK1-TKI Therapien | List | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk1/ntrk1TherapyList/ntrk1Therapy` | NTRK1-TKI Therapie | ListEntry (mehrfach) | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk1/ntrk1TherapyList/ntrk1Therapy/id` | ID des Listeneintrags | EntryId | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk2` | Resistenztestung NTRK2 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = NTRK2 (OS.Molekulargenetik) | je Resistenztestung ein OS.Molekulargenetik mit Untersuchung je Gen; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9) |
| `observationList/observation/therapiesList/ntrk2/ntrk2FusionGroup` | NTRK2-Fusion | FieldGroup | Struktur |  |  |
| `observationList/observation/therapiesList/ntrk2/ntrk2TherapyList` | NTRK2-TKI Therapien | List | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk2/ntrk2TherapyList/ntrk2Therapy` | NTRK2-TKI Therapie | ListEntry (mehrfach) | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk2/ntrk2TherapyList/ntrk2Therapy/id` | ID des Listeneintrags | EntryId | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk3` | Resistenztestung NTRK3 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = NTRK3 (OS.Molekulargenetik) | je Resistenztestung ein OS.Molekulargenetik mit Untersuchung je Gen; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9) |
| `observationList/observation/therapiesList/ntrk3/ntrk3FusionGroup` | NTRK3-Fusion | FieldGroup | Struktur |  |  |
| `observationList/observation/therapiesList/ntrk3/ntrk3TherapyList` | NTRK3-TKI Therapien | List | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk3/ntrk3TherapyList/ntrk3Therapy` | NTRK3-TKI Therapie | ListEntry (mehrfach) | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ntrk3/ntrk3TherapyList/ntrk3Therapy/id` | ID des Listeneintrags | EntryId | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ret` | Resistenztestung RET | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = RET (OS.Molekulargenetik) | je Resistenztestung ein OS.Molekulargenetik mit Untersuchung je Gen; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9) |
| `observationList/observation/therapiesList/ret/retFusionGroup` | RET-Fusion | FieldGroup | Struktur |  |  |
| `observationList/observation/therapiesList/ret/retTherapyList` | RET-TKI Therapien | List | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ret/retTherapyList/retTherapy` | RET-TKI Therapie | ListEntry (mehrfach) | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ret/retTherapyList/retTherapy/id` | ID des Listeneintrags | EntryId | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ros1` | Resistenztestung ROS1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = ROS1 (OS.Molekulargenetik) | je Resistenztestung ein OS.Molekulargenetik mit Untersuchung je Gen; Zuordnung zum Rezidiv/Progress-Ereignis offen – Idee: über das Datum ableiten (letztes Ereignis vor der Testung) oder Formularverweis im abgeleiteten NNGM.Molekulargenetik auf den Verlauf (E-9) |
| `observationList/observation/therapiesList/ros1/ros1FusionGroup` | ROS1-Fusion | FieldGroup | Struktur |  |  |
| `observationList/observation/therapiesList/ros1/ros1TherapyList` | ROS1-TKI Therapien | List | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ros1/ros1TherapyList/ros1Therapy` | ROS1-TKI Therapie | ListEntry (mehrfach) | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |
| `observationList/observation/therapiesList/ros1/ros1TherapyList/ros1Therapy/id` | ID des Listeneintrags | EntryId | Struktur |  | frühere TKI-Therapien als nNGM-Namen (129 Werte inkl. Kombinationen) – ungeklärt: aus OS.Systemische Therapie/OS.Substanz ableiten (Übersetzung ATC → nNGM-Name, hängt am veralteten Substanzkatalog) oder eigenes Feld mit nNGM-Katalog (Doppelerfassung) (E-9 Frage) |

</details>

#### Werteübersetzungen

**`observationList/observation/rezidivProgress`** – Rezidiv/Progress

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | NNGM.yesNo |  | * identisch (yes/no) |  | vorläufig | Variante B: eigener nNGM-Katalog (E-0/E-8) |
| yes | Ja | ADT.Gesamtbeurteilung |  | P | Progression | vorläufig | Variante A; von Rezidiv unterscheidbar |
| yes | Ja | ADT.Gesamtbeurteilung |  | Y | Rezidiv | vorläufig | Variante A; von Progression unterscheidbar |
| no | Nein | ADT.Gesamtbeurteilung |  | V, T, K, D, B, R, U, X | übrige Gesamtbeurteilungen | vorläufig | Variante A; nur Export-Richtung |

### NGS DNA Panel (`lungPanel`)

37 Felder – 28 vorläufig, 1 unvollständig, 8 ungelöst. Entscheidungen: E-9.

#### Vorläufig (21)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetik) |  |
| `findingList/finding/reference/findingDate` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `findingList/finding/detailsNGSPanel/comment` | Kommentar | FreeText | A | OS.Molekulargenetik → Bemerkung |  |
| `findingList/finding/detailsNGSPanel/geneTable/gene/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/detailsNGSPanel/geneTable/gene/resultDate` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/detailsNGSPanel/geneTable/gene/name` | Gen | Terminology | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) (OS.Molekulargenetik) | nNGM-Terminologie gene → Gen-Code |
| `findingList/finding/detailsNGSPanel/geneTable/gene/refSeqId` | Ref. Seq. ID | Terminology | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVNMNummer | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/otherRefSeqId` | Ref. Seq. ID | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVNMNummer | Freitext-Variante; sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/exon` | Exon | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ExonInt |  |
| `findingList/finding/detailsNGSPanel/geneTable/gene/hgvsC` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/detailsNGSPanel/geneTable/gene/hgvsP` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/detailsNGSPanel/geneTable/gene/allelicFraction` | Allelic fraction (Allelfrequenz)(0 bis 1) | Decimal | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Allelfrequenz | nNGM 0–1, Onkostar % → × 100; sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/coverage` | Coverage | Integer | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Coverage | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/additionalInformation` | Zusätzliche Angaben | Enumeration | D |  | abgeleitet: ja, wenn Zusatzangaben ausgefüllt |
| `findingList/finding/detailsNGSPanel/geneTable/gene/additionalInformationGroup/genomeBuild` | Genome build | Enumeration | B | OS.Molekulargenetik → ReferenzGenom (OS.MolSeqGenom) | GRCh37 → HG19, GRCh38 → HG38 |
| `findingList/finding/detailsNGSPanel/geneTable/gene/additionalInformationGroup/chromosome` | Chromosom | Enumeration | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVChromosom (OS.MolDiagFusionChromosome) | chr1–chrY identisch, chrM fehlt; sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/additionalInformationGroup/startPosition` | Position Start (1-basiert) | Integer | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVStart | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/additionalInformationGroup/stopPosition` | Position Stop (1-basiert) | Integer | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVEnde | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/additionalInformationGroup/refAllele` | Ref allele (Nukleotid) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVRefNucleotide | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/additionalInformationGroup/altAllele` | Alt allele (Nukleotid) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVAltNucleotide | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/consequence` | Biologische Interpretation | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Pathogenitaetsklasse (OS.MolSeqPathogenitätsklasse) | ACMG-5-Klassen (LOINC) → Pathogenitätsklasse 5–1, Werte siehe werte-mapping.csv; Unsicherheiten (E-9): Keimbahn-Schema für somatische Varianten (fachlich meist AMP/ASCO/CAP Tier I–IV), Feldname „Biologische Interpretation“ ≠ ausdrücklich ACMG, „Anderes“ ohne Gegenstück – fachliche Prüfung Molekularpathologie |

#### Unvollständig (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/detailsNGSPanel/ngsVersion` | NGS Lung Panel Version | Terminology | B | OS.Molekulargenetik → Panel (OS.MolDiag.Panels) | nNGM-Terminologie ngsDnaPanel – Werteliste weder im Schema noch in der Excel-Datei (Frage an nNGM), Onkostar kennt 3 Panels; sichtbar bei Art der Sequenzierung = Panel |

#### Ungelöst (8)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/reference/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `findingList/finding/detailsNGSPanel/otherNgsVersion` | Bitte spezifizieren Sie "Anderes" | FreeText | C |  | Freitext „Anderes“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/detailsNGSPanel/analysisPossible` | Analyse möglich | Enumeration | C |  | kein Feld auf Panel-Ebene; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/detailsNGSPanel/analysisImpossibleReason` | Grund | Enumeration | C |  | kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/detailsNGSPanel/otherAnalysisImpossibleReason` | Bitte spezifizieren Sie "Anderes" | FreeText | C |  | kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/detailsNGSPanel/ngsSequenzer` | NGS Sequencer | FreeText | B | OS.Molekulargenetik → Sequenziergeraet (OS.MolDiag.Sequenziergerät) | nNGM Freitext, Onkostar-Katalog in der Instanz leer (Standortpflege) – Katalog pflegen oder Freitext im Erweiterungskatalog? (E-9) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/completelyEvaluable` | Vollständig auswertbar | Enumeration | C |  | kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/detailsNGSPanel/geneTable/gene/otherConsequence` | Bitte spezifizieren Sie "Anderes" | FreeText | C |  | Freitext „Anderes“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |

<details>
<summary>Strukturelemente (7: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList` | Befunde | List | Struktur |  | Liste → ein OS.Molekulargenetik je Befund |
| `findingList/finding` | NGS Panel | ListEntry (mehrfach) | Struktur | OS.Molekulargenetik | je Panel-Befund ein OS.Molekulargenetik (Analysemethode = Sequenzierung, Art = Panel, Dokumentation = Erweitert) |
| `findingList/finding/reference` | Referenzen | FieldGroup | Struktur |  |  |
| `findingList/finding/detailsNGSPanel` | Angaben zum NGS Panel | FieldGroup | Struktur |  |  |
| `findingList/finding/detailsNGSPanel/geneTable` | NGS Panels | Table | Struktur |  | Tabelle → je Zeile eine OS.Molekulargenetische Untersuchung |
| `findingList/finding/detailsNGSPanel/geneTable/gene` | NGS Panel | TableEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) | je Gen eine Untersuchung; Ergebnis P (Variante) bzw. N (Wildtyp) setzen – ableitbar aus „HGVS ausgefüllt“ |
| `findingList/finding/detailsNGSPanel/geneTable/gene/additionalInformationGroup` | Zusätzliche Angaben | FieldGroup | Struktur |  |  |

</details>

#### Werteübersetzungen

**`findingList/finding/detailsNGSPanel/geneTable/gene/additionalInformationGroup/genomeBuild`** – Genome build

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| grCh37Hg19 | GRCh37 (hg19) | OS.MolSeqGenom |  | HG19 | HG19 | vorläufig |  |
| grCh38 | GRCh38 | OS.MolSeqGenom |  | HG38 | HG38 | vorläufig |  |

**`findingList/finding/detailsNGSPanel/geneTable/gene/additionalInformationGroup/chromosome`** – Chromosom

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | OS.MolDiagFusionChromosome |  | * identisch (chr1–chr22, chrX, chrY) |  | vorläufig |  |
| chrM | chrM | OS.MolDiagFusionChromosome |  |  |  | ungelöst | fehlt in Onkostar |

**`findingList/finding/detailsNGSPanel/geneTable/gene/consequence`** – Biologische Interpretation

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| LA6668-3 | Pathogen | OS.MolSeqPathogenitätsklasse |  | 5 | Pathogene Variante (pathogenic) | vorläufig | über Bedeutung abgeleitet (ACMG), fachlich prüfen |
| LA26332-9 | Wahrscheinlich pathogen | OS.MolSeqPathogenitätsklasse |  | 4 | Wahrscheinlich pathogene Variante (likely pathogenic) | vorläufig | über Bedeutung abgeleitet (ACMG), fachlich prüfen |
| LA26333-7 | Unsichere Signifikanz | OS.MolSeqPathogenitätsklasse |  | 3 | Variante unklarer klinischer Relevanz (VUS) | vorläufig | über Bedeutung abgeleitet (ACMG), fachlich prüfen |
| LA26334-5 | Wahrscheinlich gutartig | OS.MolSeqPathogenitätsklasse |  | 2 | Wahrscheinliche Normvariante (likely benign) | vorläufig | über Bedeutung abgeleitet (ACMG), fachlich prüfen |
| LA6675-8 | Gutartig | OS.MolSeqPathogenitätsklasse |  | 1 | Normvariante ohne klinische Relevanz (benign) | vorläufig | über Bedeutung abgeleitet (ACMG), fachlich prüfen |
| other | Anderes | OS.MolSeqPathogenitätsklasse |  |  |  | ungelöst | kein Gegenstück |

### NGS RNA Panel (`ngsFusion`)

35 Felder – 26 vorläufig, 1 unvollständig, 8 ungelöst. Entscheidungen: E-9.

#### Vorläufig (18)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetik) |  |
| `findingList/finding/reference/findingDate` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `findingList/finding/detailsNGSPanel/geneTable/gene/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/detailsNGSPanel/geneTable/gene/resultDate` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/detailsNGSPanel/geneTable/gene/name` | Gen | Terminology | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) (OS.Molekulargenetik) | nNGM-Terminologie gene → Gen-Code |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → F, negativ → N, nicht auswertbar → UX (bei MET Exon-14-Skipping siehe metPhenotype) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/transcriptId` | Transcript ID | Terminology | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusionRNA3TranscriptID bzw. FusionRNA5TranscriptID | Seite des untersuchten Gens; ANNAHME (E-9): Seite aus fusionPartnerType – Partner 5' → untersuchtes Gen 3' und umgekehrt (z. B. EML4-ALK: EML4 5', ALK 3'); nicht ausdrücklich definiert; sichtbar bei Dokumentation = Erweitert, Art der Fusion = RNA, Ergebnis = F |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/otherTranscriptId` | Transcript ID | FreeText | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusionRNA3TranscriptID bzw. FusionRNA5TranscriptID | Freitext-Variante; ANNAHME (E-9): Seite aus fusionPartnerType – Partner 5' → untersuchtes Gen 3' und umgekehrt (z. B. EML4-ALK: EML4 5', ALK 3'); nicht ausdrücklich definiert |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/fusionPartner` | Fusionspartner | Terminology | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusioniertesGen + FusionRNA5HGNCSymbol bzw. FusionRNA3HGNCSymbol (OS.Molekulargenetik) | ANNAHME (E-9): Seite aus fusionPartnerType – Partner 5' → untersuchtes Gen 3' und umgekehrt (z. B. EML4-ALK: EML4 5', ALK 3'); nicht ausdrücklich definiert; sichtbar bei Dokumentation = Erweitert, Art der Fusion = RNA, Ergebnis = F |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/fusionPartnerTranscriptId` | Fusionspartner Transkript ID (NCBI) | Terminology | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusionRNA5TranscriptID bzw. FusionRNA3TranscriptID | Seite des Partners; ANNAHME (E-9): Seite aus fusionPartnerType – Partner 5' → untersuchtes Gen 3' und umgekehrt (z. B. EML4-ALK: EML4 5', ALK 3'); nicht ausdrücklich definiert |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/otherFusionPartnerTranscriptId` | Fusionspartner Transkript ID (NCBI) | FreeText | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusionRNA5TranscriptID bzw. FusionRNA3TranscriptID | Freitext-Variante; ANNAHME (E-9): Seite aus fusionPartnerType – Partner 5' → untersuchtes Gen 3' und umgekehrt (z. B. EML4-ALK: EML4 5', ALK 3'); nicht ausdrücklich definiert |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/countFusionReads` | Anzahl der Fusionsreads | Integer | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusionRNAReportedNumRead | sichtbar bei Dokumentation = Erweitert, Art der Fusion = RNA, Ergebnis = F |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/fusionPartnerType` | Fusionspartner Exon | Enumeration | D |  | bestimmt die Seitenzuordnung, kein eigenes Feld; ANNAHME (E-9): Seite aus fusionPartnerType – Partner 5' → untersuchtes Gen 3' und umgekehrt (z. B. EML4-ALK: EML4 5', ALK 3'); nicht ausdrücklich definiert |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/fusionPartner5Exon` | 5' Fusionspartner Exon | Integer | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusionRNA5ExonID | sichtbar bei Dokumentation = Erweitert, Art der Fusion = RNA, Ergebnis = F |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/fusionPartner3Exon` | 3' Fusionspartner Exon | Integer | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusionRNA3ExonID | sichtbar bei Dokumentation = Erweitert, Art der Fusion = RNA, Ergebnis = F |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/exonNumber` | Exon | Integer | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusionRNA3ExonID bzw. FusionRNA5ExonID | Exon des untersuchten Gens; ANNAHME (E-9): Seite aus fusionPartnerType – Partner 5' → untersuchtes Gen 3' und umgekehrt (z. B. EML4-ALK: EML4 5', ALK 3'); nicht ausdrücklich definiert |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/exonText` | Exon | FreeText | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → FusionRNA3ExonID bzw. FusionRNA5ExonID | Freitext-Variante; ANNAHME (E-9): Seite aus fusionPartnerType – Partner 5' → untersuchtes Gen 3' und umgekehrt (z. B. EML4-ALK: EML4 5', ALK 3'); nicht ausdrücklich definiert |
| `findingList/finding/methology/comment` | Kommentar | FreeText | A | OS.Molekulargenetik → Bemerkung |  |

#### Unvollständig (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/detailsNGSPanel/ngsVersion` | NGS Lung Panel Version | Terminology | B | OS.Molekulargenetik → Panel (OS.MolDiag.Panels) | nNGM-Terminologie ngsRnaPanel – Werteliste fehlt (Frage an nNGM, wie ngsDnaPanel), Onkostar kennt 3 Panels |

#### Ungelöst (8)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/reference/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `findingList/finding/detailsNGSPanel/otherNgsVersion` | Bitte spezifizieren Sie "Anderes" | FreeText | C |  | Freitext „Anderes“: kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/detailsNGSPanel/geneTable/gene/metPhenotype` | Phänotyp | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → METLevel (E-14) + Ergebnis ? (OS.MolGenMET_Level) | Fusion → Ergebnis F; Exon-14-Skipping ist eine Spleißvariante: MET Level = E-14 („Exon 14-skipping“), offen welches Ergebnis (P oder S) (E-9) |
| `findingList/finding/detailsNGSPanel/geneTable/gene/completelyEvaluable` | Vollständig auswertbar | Enumeration | C |  | kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/methology/assay` | Assay | FreeText | C |  | Assay (Freitext): Bemerkung oder eigenes Feld im Erweiterungskatalog? (E-9 Frage 3) |
| `findingList/finding/methology/analysisPossible` | Analyse möglich | Enumeration | C |  | kein Feld auf Panel-Ebene; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/methology/analysisImpossibleReason` | Grund | Enumeration | C |  | kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/methology/otherAnalysisImpossibleReason` | Bitte spezifizieren Sie "Anderes" | FreeText | C |  | kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |

<details>
<summary>Strukturelemente (8: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList` | Befunde | List | Struktur |  | Liste → ein OS.Molekulargenetik je Befund |
| `findingList/finding` | NGS Panel | ListEntry (mehrfach) | Struktur | OS.Molekulargenetik | je RNA-Panel-Befund ein OS.Molekulargenetik (Analysemethode = Sequenzierung, Art = RNA-Sequenzierung/Panel, Dokumentation = Erweitert) |
| `findingList/finding/reference` | Referenzen | FieldGroup | Struktur |  |  |
| `findingList/finding/detailsNGSPanel` | Angaben zum NGS Panel | FieldGroup | Struktur |  |  |
| `findingList/finding/detailsNGSPanel/geneTable` | NGS Panels | Table | Struktur |  | Tabelle → je Zeile eine OS.Molekulargenetische Untersuchung |
| `findingList/finding/detailsNGSPanel/geneTable/gene` | NGS Panel | TableEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) | je Gen eine Untersuchung; bei Fusion Ergebnis = F, Art der Fusion = RNA |
| `findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup` | NGS Fusion | FieldGroup | Struktur |  | sichtbar bei Dokumentation = Erweitert, Art der Fusion = RNA, Ergebnis = F |
| `findingList/finding/methology` | Methodik | FieldGroup | Struktur |  |  |

</details>

#### Werteübersetzungen

**`findingList/finding/detailsNGSPanel/geneTable/gene/metPhenotype`** – Phänotyp

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| fusion | Fusion | OS.MolGenMET_Level / OS.MolGenErgebnis |  | Ergebnis=F | Fusion | vorläufig |  |
| exon14Skipping | Exon 14 Skipping Variante | OS.MolGenMET_Level / OS.MolGenErgebnis |  | METLevel=E-14, Ergebnis=? | Exon 14-skipping | ungelöst | Ergebnis P oder S offen |

**`findingList/finding/detailsNGSPanel/geneTable/gene/ngsFusionGroup/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | F | Fusion | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

### Fast Track (`fastTrack`)

108 Felder – 92 vorläufig, 12 unvollständig, 4 ungelöst. Entscheidungen: E-9.

#### Vorläufig (75)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetik) |  |
| `findingList/finding/reference/examinationResultDate` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) |  |
| `findingList/finding/reference/comment` | Kommentar | FreeText | A | OS.Molekulargenetik → Bemerkung |  |
| `findingList/finding/examination/examFastTrack/ALK/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/ALK/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/ALK/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/ALK/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/ALK/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Fusion → F, keine Fusion → N, nicht auswertbar → UX |
| `findingList/finding/examination/examFastTrack/BRAF15/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/BRAF15/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/BRAF15/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/BRAF15/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/BRAF15/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis / OS.MolAktivierend) | „keine aktivierende Mutation“ umfasst Wildtyp (N) und nicht aktivierende Mutation (P + Aktivierend = N): Export beides → keine; bei der Erfassung eines davon wählen (E-9); Feld „Aktivierend“ nur bei EGFR sichtbar; bei BRAF/KRAS ANNAHME: Mutation (P) = aktivierend; Option E-8: Feld im abgeleiteten Formular auch für BRAF/KRAS einblenden (E-9) |
| `findingList/finding/examination/examFastTrack/BRAF15/changeDNA` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/BRAF15/changeProtein` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/EGFR19/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/EGFR19/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/EGFR19/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/EGFR19/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/EGFR19/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis + Aktivierend (OS.MolGenErgebnis / OS.MolAktivierend) | „keine aktivierende Mutation“ umfasst Wildtyp (N) und nicht aktivierende Mutation (P + Aktivierend = N): Export beides → keine; bei der Erfassung eines davon wählen (E-9) |
| `findingList/finding/examination/examFastTrack/EGFR19/changeDNA` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/EGFR19/changeProtein` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/EGFR20/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/EGFR20/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/EGFR20/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/EGFR20/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/EGFR20/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis + Aktivierend (OS.MolGenErgebnis / OS.MolAktivierend) | „keine aktivierende Mutation“ umfasst Wildtyp (N) und nicht aktivierende Mutation (P + Aktivierend = N): Export beides → keine; bei der Erfassung eines davon wählen (E-9) |
| `findingList/finding/examination/examFastTrack/EGFR20/changeDNA` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/EGFR20/changeProtein` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/EGFR21/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/EGFR21/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/EGFR21/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/EGFR21/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/EGFR21/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis + Aktivierend (OS.MolGenErgebnis / OS.MolAktivierend) | „keine aktivierende Mutation“ umfasst Wildtyp (N) und nicht aktivierende Mutation (P + Aktivierend = N): Export beides → keine; bei der Erfassung eines davon wählen (E-9) |
| `findingList/finding/examination/examFastTrack/EGFR21/changeDNA` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/EGFR21/changeProtein` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/KRAS2/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/KRAS2/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/KRAS2/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/KRAS2/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/KRAS2/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis / OS.MolAktivierend) | „keine aktivierende Mutation“ umfasst Wildtyp (N) und nicht aktivierende Mutation (P + Aktivierend = N): Export beides → keine; bei der Erfassung eines davon wählen (E-9); Feld „Aktivierend“ nur bei EGFR sichtbar; bei BRAF/KRAS ANNAHME: Mutation (P) = aktivierend; Option E-8: Feld im abgeleiteten Formular auch für BRAF/KRAS einblenden (E-9) |
| `findingList/finding/examination/examFastTrack/KRAS2/changeDNA` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/KRAS2/changeProtein` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/MET14/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/MET14/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/MET14/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/MET14/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/MET14/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Mutation → P, keine → N, nicht auswertbar → UX; Zusammenhang mit MET Level E-14 offen (E-9 Frage 6) |
| `findingList/finding/examination/examFastTrack/MET14/changeDNA` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/MET14/changeProtein` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/examFastTrack/NTRK1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/NTRK1/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/NTRK1/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/NTRK1/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/NTRK1/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Fusion → F, keine Fusion → N, nicht auswertbar → UX |
| `findingList/finding/examination/examFastTrack/NTRK2/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/NTRK2/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/NTRK2/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/NTRK2/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/NTRK2/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Fusion → F, keine Fusion → N, nicht auswertbar → UX |
| `findingList/finding/examination/examFastTrack/NTRK3/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/NTRK3/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/NTRK3/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/NTRK3/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/NTRK3/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Fusion → F, keine Fusion → N, nicht auswertbar → UX |
| `findingList/finding/examination/examFastTrack/RET/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/RET/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/RET/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/RET/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/RET/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Fusion → F, keine Fusion → N, nicht auswertbar → UX |
| `findingList/finding/examination/examFastTrack/ROS1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/examFastTrack/ROS1/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/examFastTrack/ROS1/otherAssay` | Andere | FreeText | A | OS.Molekulargenetik → MolDiagMethodeAndere | sichtbar bei Analysemethode Andere |
| `findingList/finding/examination/examFastTrack/ROS1/analysisPossible` | Analyse möglich | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis = UX bei nein | nein → Ergebnis UX (untersucht, kein Ergebnis); ja → Ergebnis gesetzt |
| `findingList/finding/examination/examFastTrack/ROS1/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Fusion → F, keine Fusion → N, nicht auswertbar → UX |

#### Unvollständig (12)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/examination/examFastTrack/ALK/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |
| `findingList/finding/examination/examFastTrack/BRAF15/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |
| `findingList/finding/examination/examFastTrack/EGFR19/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |
| `findingList/finding/examination/examFastTrack/EGFR20/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |
| `findingList/finding/examination/examFastTrack/EGFR21/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |
| `findingList/finding/examination/examFastTrack/KRAS2/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |
| `findingList/finding/examination/examFastTrack/MET14/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |
| `findingList/finding/examination/examFastTrack/NTRK1/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |
| `findingList/finding/examination/examFastTrack/NTRK2/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |
| `findingList/finding/examination/examFastTrack/NTRK3/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |
| `findingList/finding/examination/examFastTrack/RET/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |
| `findingList/finding/examination/examFastTrack/ROS1/assay` | Analysemethoden | MultipleChoice (mehrfach) | B | OS.Molekulargenetik → AnalyseMethoden (+ ArtDerSequenzierung) (OS.MolDiagMethode / OS.MolDiagSequenzierung) | Analysemethoden gröber als nNGM: qPCR, RT-PCR, Fragmentlängen- und Schmelzkurvenanalyse → alle P; Export aus P nicht eindeutig (E-9) |

#### Ungelöst (4)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/reference/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `findingList/finding/reference/analysisPossible` | Analyse möglich | Enumeration | C |  | kein Feld auf Befund-Ebene; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/reference/noAnalysisReason` | Grund | Enumeration | C |  | kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/reference/otherNoAnalysisReason` | Bitte spezifizieren Sie "Anderes" | FreeText | C |  | kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |

<details>
<summary>Strukturelemente (17: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList` | Befunde | List | Struktur |  | Liste → ein OS.Molekulargenetik je Material |
| `findingList/finding` | Tumormaterial | ListEntry (mehrfach) | Struktur | OS.Molekulargenetik | je Material ein OS.Molekulargenetik mit Untersuchung je Test |
| `findingList/finding/reference` | Referenzen | FieldGroup | Struktur |  |  |
| `findingList/finding/examination` | Untersuchungen | FieldGroup | Struktur |  |  |
| `findingList/finding/examination/examFastTrack` | Fast Track | List | Struktur |  | je Test eine OS.Molekulargenetische Untersuchung |
| `findingList/finding/examination/examFastTrack/ALK` | ALK | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = ALK (OS.Molekulargenetik) |  |
| `findingList/finding/examination/examFastTrack/BRAF15` | BRAF Exon 15 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = BRAF, Exon = 15 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/examFastTrack/EGFR19` | EGFR Exon 19 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = EGFR, Exon = 19 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/examFastTrack/EGFR20` | EGFR Exon 20 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = EGFR, Exon = 20 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/examFastTrack/EGFR21` | EGFR Exon 21 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = EGFR, Exon = 21 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/examFastTrack/KRAS2` | KRAS Exon 2 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = KRAS, Exon = 2 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/examFastTrack/MET14` | MET Exon 14 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = MET, Exon = 14 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/examFastTrack/NTRK1` | NTRK1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = NTRK1 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/examFastTrack/NTRK2` | NTRK2 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = NTRK2 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/examFastTrack/NTRK3` | NTRK3 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = NTRK3 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/examFastTrack/RET` | RET | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = RET (OS.Molekulargenetik) |  |
| `findingList/finding/examination/examFastTrack/ROS1` | ROS1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = ROS1 (OS.Molekulargenetik) |  |

</details>

#### Werteübersetzungen

**`findingList/finding/examination/examFastTrack/ALK/assay`** – Analysemethoden

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| fragmentLengthAnalysis | Fragmentlängenanalyse | OS.MolDiagMethode / OS.MolDiagSequenzierung |  | P | PCR/ Realtime-PCR/ MLPA | vorläufig | gröber; Export aus P nicht eindeutig |
| immunohistochemistry | Immunhistochemie | OS.MolDiagMethode / OS.MolDiagSequenzierung |  | I | Immunhistochemie | vorläufig |  |
| pyroSequencing | Pyrosequenzierung | OS.MolDiagMethode / OS.MolDiagSequenzierung |  | S + ArtDerSequenzierung=PYRO | Sequenzierung / Pyrosequenzierung | vorläufig |  |
| qPcr | qPCR | OS.MolDiagMethode / OS.MolDiagSequenzierung |  | P | PCR/ Realtime-PCR/ MLPA | vorläufig | gröber; Export aus P nicht eindeutig |
| rtPcr | RT-PCR | OS.MolDiagMethode / OS.MolDiagSequenzierung |  | P | PCR/ Realtime-PCR/ MLPA | vorläufig | gröber; Export aus P nicht eindeutig |
| sangerSequencing | Sanger Sequenzierung | OS.MolDiagMethode / OS.MolDiagSequenzierung |  | S + ArtDerSequenzierung=Sanger | Sequenzierung / Sanger | vorläufig |  |
| meltCurveAnalysis | Schmelzkurvenanalyse | OS.MolDiagMethode / OS.MolDiagSequenzierung |  | P | PCR/ Realtime-PCR/ MLPA | vorläufig | gröber; Export aus P nicht eindeutig |
| other | Andere | OS.MolDiagMethode / OS.MolDiagSequenzierung |  | A + MolDiagMethodeAndere | Andere | vorläufig | gilt für alle 12 assay-Felder in fastTrack |

**`findingList/finding/examination/examFastTrack/ALK/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| Fusion | Fusion | OS.MolGenErgebnis |  | F | Fusion | vorläufig |  |
| keine Fusion | keine Fusion | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/examFastTrack/BRAF15/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| aktivierende Mutation | aktivierende Mutation | OS.MolGenErgebnis |  | Ergebnis=P | Mutation, aktivierend | vorläufig | Annahme: P = aktivierend (kein Feld „Aktivierend“) |
| keine aktivierende Mutation | keine aktivierende Mutation | OS.MolGenErgebnis |  | Ergebnis=N | Wildtyp bzw. nicht aktivierende Mutation | vorläufig | Export beides → keine aktivierende Mutation |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/examFastTrack/EGFR19/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| aktivierende Mutation | aktivierende Mutation | OS.MolGenErgebnis / OS.MolAktivierend |  | Ergebnis=P, Aktivierend=A | Mutation, aktivierend | vorläufig |  |
| keine aktivierende Mutation | keine aktivierende Mutation | OS.MolGenErgebnis / OS.MolAktivierend |  | Ergebnis=N oder Ergebnis=P + Aktivierend=N | Wildtyp bzw. nicht aktivierende Mutation | vorläufig | Export beides → keine aktivierende Mutation |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis / OS.MolAktivierend |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/examFastTrack/EGFR20/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| aktivierende Mutation | aktivierende Mutation | OS.MolGenErgebnis / OS.MolAktivierend |  | Ergebnis=P, Aktivierend=A | Mutation, aktivierend | vorläufig |  |
| keine aktivierende Mutation | keine aktivierende Mutation | OS.MolGenErgebnis / OS.MolAktivierend |  | Ergebnis=N oder Ergebnis=P + Aktivierend=N | Wildtyp bzw. nicht aktivierende Mutation | vorläufig | Export beides → keine aktivierende Mutation |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis / OS.MolAktivierend |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/examFastTrack/EGFR21/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| aktivierende Mutation | aktivierende Mutation | OS.MolGenErgebnis / OS.MolAktivierend |  | Ergebnis=P, Aktivierend=A | Mutation, aktivierend | vorläufig |  |
| keine aktivierende Mutation | keine aktivierende Mutation | OS.MolGenErgebnis / OS.MolAktivierend |  | Ergebnis=N oder Ergebnis=P + Aktivierend=N | Wildtyp bzw. nicht aktivierende Mutation | vorläufig | Export beides → keine aktivierende Mutation |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis / OS.MolAktivierend |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/examFastTrack/KRAS2/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| aktivierende Mutation | aktivierende Mutation | OS.MolGenErgebnis |  | Ergebnis=P | Mutation, aktivierend | vorläufig | Annahme: P = aktivierend (kein Feld „Aktivierend“) |
| keine aktivierende Mutation | keine aktivierende Mutation | OS.MolGenErgebnis |  | Ergebnis=N | Wildtyp bzw. nicht aktivierende Mutation | vorläufig | Export beides → keine aktivierende Mutation |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/examFastTrack/MET14/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| Mutation | Mutation | OS.MolGenErgebnis |  | P | Einfache Variante | vorläufig | Zusammenhang MET Level E-14 offen |
| keine Mutation | keine Mutation | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/examFastTrack/NTRK1/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| Fusion | Fusion | OS.MolGenErgebnis |  | F | Fusion | vorläufig |  |
| keine Fusion | keine Fusion | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/examFastTrack/NTRK2/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| Fusion | Fusion | OS.MolGenErgebnis |  | F | Fusion | vorläufig |  |
| keine Fusion | keine Fusion | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/examFastTrack/NTRK3/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| Fusion | Fusion | OS.MolGenErgebnis |  | F | Fusion | vorläufig |  |
| keine Fusion | keine Fusion | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/examFastTrack/RET/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| Fusion | Fusion | OS.MolGenErgebnis |  | F | Fusion | vorläufig |  |
| keine Fusion | keine Fusion | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/examFastTrack/ROS1/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| Fusion | Fusion | OS.MolGenErgebnis |  | F | Fusion | vorläufig |  |
| keine Fusion | keine Fusion | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

### Liquid Biopsy (`liquidBiopsy`)

32 Felder – 27 vorläufig, 5 ungelöst. Entscheidungen: E-9.

#### Vorläufig (20)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/primaryMutationExists` | Primärmutation | Enumeration | D |  | abgeleitet: ja, wenn Primärmutations-Einträge vorhanden (hängt an der Kennzeichnung Primär/Resistenz) |
| `findingList/finding/examination/primaryMutationList/primaryMutation/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/primaryMutationList/primaryMutation/examinationId` | Eingangsnummer | FreeText | B | OS.Molekulargenetik → Einsendenummer | Eingangsnummer je Eintrag, in Onkostar je Einsendung (OS.Molekulargenetik): gleiche Nummer = ein OS.Molekulargenetik, verschiedene Nummern = mehrere (E-9) |
| `findingList/finding/examination/primaryMutationList/primaryMutation/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/primaryMutationList/primaryMutation/gene` | Gen | FreeText | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) (OS.Molekulargenetik) | nNGM Freitext → Gen-Code im Katalog (Übersetzung nötig) |
| `findingList/finding/examination/primaryMutationList/primaryMutation/exon` | Exon | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ExonInt |  |
| `findingList/finding/examination/primaryMutationList/primaryMutation/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/primaryMutationList/primaryMutation/HGVScDNA` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/primaryMutationList/primaryMutation/HGVSProtein` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/resistenceTestExists` | Resistenztestung | Enumeration | D |  | abgeleitet: ja, wenn Resistenz-Einträge vorhanden (hängt an der Kennzeichnung Primär/Resistenz) |
| `findingList/finding/examination/resistenceList/resistence/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Untersuchung) |  |
| `findingList/finding/examination/resistenceList/resistence/examinationId` | Eingangsnummer | FreeText | B | OS.Molekulargenetik → Einsendenummer | Eingangsnummer je Eintrag, in Onkostar je Einsendung (OS.Molekulargenetik): gleiche Nummer = ein OS.Molekulargenetik, verschiedene Nummern = mehrere (E-9) |
| `findingList/finding/examination/resistenceList/resistence/date` | Datum Untersuchungsergebnis | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/examination/resistenceList/resistence/gene` | Gen | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) (OS.Molekulargenetik) | EGFR/ALK/ROS1/BRAF identisch; other → otherGene |
| `findingList/finding/examination/resistenceList/resistence/otherGene` | Anderes Gen | FreeText | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) (OS.Molekulargenetik) | nNGM Freitext → Gen-Code im Katalog (Übersetzung nötig) |
| `findingList/finding/examination/resistenceList/resistence/exon` | Exon | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ExonInt |  |
| `findingList/finding/examination/resistenceList/resistence/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/resistenceList/resistence/HGVScDNA` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/examination/resistenceList/resistence/HGVSProtein` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P |

#### Ungelöst (3)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/reference/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `findingList/finding/methology/assay` | Assay | FreeText | C |  | Assay (Freitext): Bemerkung oder eigenes Feld im Erweiterungskatalog? (E-9 Frage 3) |
| `findingList/finding/methology/manufacturer` | Hersteller | FreeText | B | OS.Molekulargenetik → SeqKitHersteller (OS.MolDiag.KitHersteller) | nNGM Freitext, Onkostar-Katalog in der Instanz leer (Standortpflege) – wie Sequenzer (E-9 Frage 4) |

<details>
<summary>Strukturelemente (9: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList` | Befunde | List | Struktur |  | Liste → OS.Molekulargenetik je Befund bzw. je Eingangsnummer |
| `findingList/finding` | Tumormaterial | ListEntry (mehrfach) | Struktur | OS.Molekulargenetik | Entnahmemethode = Liquid-Biopsie (LB), Probe aus = Blut (B), Nukleinsäure = cfDNA; Eingangsnummer je Eintrag, in Onkostar je Einsendung (OS.Molekulargenetik): gleiche Nummer = ein OS.Molekulargenetik, verschiedene Nummern = mehrere (E-9) |
| `findingList/finding/reference` | Referenzen | FieldGroup | Struktur |  |  |
| `findingList/finding/methology` | Methodik | FieldGroup | Struktur |  |  |
| `findingList/finding/examination` | Untersuchungen | FieldGroup | Struktur |  |  |
| `findingList/finding/examination/primaryMutationList` | Primärmutationen | List | Struktur |  |  |
| `findingList/finding/examination/primaryMutationList/primaryMutation` | Primärmutation | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) | je Eintrag eine OS.Molekulargenetische Untersuchung; Primärmutation oder Resistenztestung: keine Kennzeichnung in Onkostar – ungelöst, Option E-8: Feld im Erweiterungskatalog von NNGM.Molekulargenetik (E-9) |
| `findingList/finding/examination/resistenceList` | Resistenztestungen | List | Struktur |  |  |
| `findingList/finding/examination/resistenceList/resistence` | Resistenztestung | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) | je Eintrag eine OS.Molekulargenetische Untersuchung; Primärmutation oder Resistenztestung: keine Kennzeichnung in Onkostar – ungelöst, Option E-8: Feld im Erweiterungskatalog von NNGM.Molekulargenetik (E-9) |

</details>

#### Werteübersetzungen

**`findingList/finding/examination/primaryMutationList/primaryMutation/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv (mutiert) | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ (Wildtyp) | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/resistenceList/resistence/gene`** – Gen

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| EGFR | EGFR | OS.Molekulargenetik |  | EGFR | EGFR | vorläufig |  |
| ALK | ALK | OS.Molekulargenetik |  | ALK | ALK | vorläufig |  |
| ROS1 | ROS1 | OS.Molekulargenetik |  | ROS1 | ROS1 | vorläufig |  |
| BRAF | BRAF | OS.Molekulargenetik |  | BRAF | BRAF | vorläufig |  |
| other | Anderes | OS.Molekulargenetik |  | (otherGene) |  | vorläufig | Gen aus otherGene (Freitext) |

**`findingList/finding/examination/resistenceList/resistence/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv (mutiert) | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ (Wildtyp) | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

### Resistenztestung (`resistanceTesting`)

58 Felder – 49 vorläufig, 9 ungelöst. Entscheidungen: E-9.

#### Vorläufig (37)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetik) |  |
| `findingList/finding/resistanceTestingList/alk/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `findingList/finding/resistanceTestingList/alk/alkDate` | Datum | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/resistanceTestingList/alk/alkResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis + CopyNumberVariation (OS.MolGenErgebnis / OS.MolCopyNumberVariation) | positive → CNV + Amplifikation (High/Low Level beide → positive), negative → N, notEvaluable → UX; Werte siehe werte-mapping.csv |
| `findingList/finding/resistanceTestingList/braf/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `findingList/finding/resistanceTestingList/braf/brafDate` | Datum | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/resistanceTestingList/braf/brafResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis + CopyNumberVariation (OS.MolGenErgebnis / OS.MolCopyNumberVariation) | positive → CNV + Amplifikation (High/Low Level beide → positive), negative → N, notEvaluable → UX; Werte siehe werte-mapping.csv |
| `findingList/finding/resistanceTestingList/egfr/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `findingList/finding/resistanceTestingList/egfr/egfrDate` | Datum | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/resistanceTestingList/egfr/egfrResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis + CopyNumberVariation (OS.MolGenErgebnis / OS.MolCopyNumberVariation) | positive → CNV + Amplifikation (High/Low Level beide → positive), negative → N, notEvaluable → UX; Werte siehe werte-mapping.csv |
| `findingList/finding/resistanceTestingList/her2/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `findingList/finding/resistanceTestingList/her2/her2Date` | Datum | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/resistanceTestingList/her2/her2Result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis + CopyNumberVariation (OS.MolGenErgebnis / OS.MolCopyNumberVariation) | positive → CNV + Amplifikation (High/Low Level beide → positive), negative → N, notEvaluable → UX; Werte siehe werte-mapping.csv |
| `findingList/finding/resistanceTestingList/kit17/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `findingList/finding/resistanceTestingList/kit17/kit17Date` | Datum | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/resistanceTestingList/kit17/kit17Gene` | Gen | Terminology | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) (OS.Molekulargenetik) | nNGM-Terminologie gene → Gen-Code (KIT) |
| `findingList/finding/resistanceTestingList/kit17/kit17RefSeqId` | Ref. Seq. ID | Terminology | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVNMNummer | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/resistanceTestingList/kit17/kit17OtherRefSeqId` | Ref. Seq. ID | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVNMNummer | Freitext-Variante der Ref. Seq. ID; sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/resistanceTestingList/kit17/kit17Exon` | Exon | Integer | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ExonInt |  |
| `findingList/finding/resistanceTestingList/kit17/kit17HgvsC` | c. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → cDNANomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/resistanceTestingList/kit17/kit17HgvsP` | p. (nach HGVS -Human Genome Variation Society) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → ProteinebeneNomenklatur | sichtbar bei Ergebnis = P |
| `findingList/finding/resistanceTestingList/kit17/kit17AllelicFraction` | Allelic fraction (Allelfrequenz)(0 bis 1) | Decimal | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Allelfrequenz | nNGM 0–1, Onkostar % → × 100; sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/resistanceTestingList/kit17/kit17Coverage` | Coverage | Integer | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Coverage | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/resistanceTestingList/kit17/kit17AdditionalInformation` | Zusätzliche Angaben | Enumeration | D | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) | abgeleitet: ja, wenn Zusatzangaben (Genome build, Chromosom, Positionen, Allele) ausgefüllt |
| `findingList/finding/resistanceTestingList/kit17/kit17AdditionalInformationGroup/kit17GenomeBuild` | Genome build | Enumeration | B | OS.Molekulargenetik → ReferenzGenom (OS.MolSeqGenom) | GRCh37 → HG19, GRCh38 → HG38; sichtbar bei Analysemethode Sequenzierung |
| `findingList/finding/resistanceTestingList/kit17/kit17AdditionalInformationGroup/kit17Chromosome` | Chromosom | Enumeration | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVChromosom (OS.MolDiagFusionChromosome) | chr1–chrY identisch, chrM fehlt in Onkostar; sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/resistanceTestingList/kit17/kit17AdditionalInformationGroup/kit17StartPosition` | Position Start (1-basiert) | Integer | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVStart | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/resistanceTestingList/kit17/kit17AdditionalInformationGroup/kit17StopPosition` | Position Stop (1-basiert) | Integer | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVEnde | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/resistanceTestingList/kit17/kit17AdditionalInformationGroup/kit17RefAllele` | Ref allele (Nukleotid) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVRefNucleotide | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/resistanceTestingList/kit17/kit17AdditionalInformationGroup/kit17AltAllele` | Alt allele (Nukleotid) | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → EVAltNucleotide | sichtbar bei Dokumentation = Erweitert und Ergebnis = P (Abschnitt Einfache Variante) |
| `findingList/finding/resistanceTestingList/kit17/kit17Consequence` | Biologische Interpretation | FreeText | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Interpretation |  |
| `findingList/finding/resistanceTestingList/kras/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `findingList/finding/resistanceTestingList/kras/krasDate` | Datum | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/resistanceTestingList/kras/krasResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis + CopyNumberVariation (OS.MolGenErgebnis / OS.MolCopyNumberVariation) | positive → CNV + Amplifikation (High/Low Level beide → positive), negative → N, notEvaluable → UX; Werte siehe werte-mapping.csv |
| `findingList/finding/resistanceTestingList/met/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetische Untersuchung) |  |
| `findingList/finding/resistanceTestingList/met/metDate` | Datum | MedicalDate | A | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Datum |  |
| `findingList/finding/resistanceTestingList/met/metResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Ergebnis + CopyNumberVariation (OS.MolGenErgebnis / OS.MolCopyNumberVariation) | positive → CNV + Amplifikation (High/Low Level beide → positive), negative → N, notEvaluable → UX; Werte siehe werte-mapping.csv; Alternative für MET: Feld „MET Level“ (OS.MolGenMET_Level: low/intermediate/high level, sichtbar bei Gen = MET) |

#### Ungelöst (9)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/reference/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `findingList/finding/resistanceTestingList/alk/alkAssay` | Assay | FreeText | C |  | Assay (Freitext): Bemerkung der Untersuchung oder eigenes Feld im Erweiterungskatalog? (E-9 Frage) |
| `findingList/finding/resistanceTestingList/braf/brafAssay` | Assay | FreeText | C |  | Assay (Freitext): Bemerkung der Untersuchung oder eigenes Feld im Erweiterungskatalog? (E-9 Frage) |
| `findingList/finding/resistanceTestingList/egfr/egfrAssay` | Assay | FreeText | C |  | Assay (Freitext): Bemerkung der Untersuchung oder eigenes Feld im Erweiterungskatalog? (E-9 Frage) |
| `findingList/finding/resistanceTestingList/her2/her2Assay` | Assay | FreeText | C |  | Assay (Freitext): Bemerkung der Untersuchung oder eigenes Feld im Erweiterungskatalog? (E-9 Frage) |
| `findingList/finding/resistanceTestingList/kit17/kit17Assay` | Assay | FreeText | C |  | Assay (Freitext): Bemerkung der Untersuchung oder eigenes Feld im Erweiterungskatalog? (E-9 Frage) |
| `findingList/finding/resistanceTestingList/kit17/kit17CompletelyEvaluable` | Vollständig auswertbar | Enumeration | C | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) | kein Feld; Option E-8: Erweiterungskatalog von NNGM.Molekulargenetik |
| `findingList/finding/resistanceTestingList/kras/krasAssay` | Assay | FreeText | C |  | Assay (Freitext): Bemerkung der Untersuchung oder eigenes Feld im Erweiterungskatalog? (E-9 Frage) |
| `findingList/finding/resistanceTestingList/met/metAssay` | Assay | FreeText | C |  | Assay (Freitext): Bemerkung der Untersuchung oder eigenes Feld im Erweiterungskatalog? (E-9 Frage) |

<details>
<summary>Strukturelemente (12: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList` | Befunde | List | Struktur |  | Liste → ein OS.Molekulargenetik je Material |
| `findingList/finding` | Tumormaterial | ListEntry (mehrfach) | Struktur | OS.Molekulargenetik | je Tumormaterial ein OS.Molekulargenetik (passt zu E-3 Weg A); Dokumentation = Erweitert setzen |
| `findingList/finding/reference` | Referenzen | FieldGroup | Struktur |  |  |
| `findingList/finding/resistanceTestingList` | Resistenztestungen | List | Struktur |  |  |
| `findingList/finding/resistanceTestingList/alk` | ALK amp | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = ALK (OS.Molekulargenetik) | Amplifikation |
| `findingList/finding/resistanceTestingList/braf` | BRAF amp | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = BRAF (OS.Molekulargenetik) | Amplifikation |
| `findingList/finding/resistanceTestingList/egfr` | EGFR amp | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = EGFR (OS.Molekulargenetik) | Amplifikation |
| `findingList/finding/resistanceTestingList/her2` | HER2 (ERBB2) amp | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = ERBB2 (OS.Molekulargenetik) | Amplifikation; HER2 = ERBB2 |
| `findingList/finding/resistanceTestingList/kit17` | KIT exon 17 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = KIT (OS.Molekulargenetik) | KIT Exon 17, Einfache Variante (Ergebnis = P) |
| `findingList/finding/resistanceTestingList/kit17/kit17AdditionalInformationGroup` | Zusätzliche Angaben | FieldGroup | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) |  |
| `findingList/finding/resistanceTestingList/kras` | KRAS amp | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = KRAS (OS.Molekulargenetik) | Amplifikation |
| `findingList/finding/resistanceTestingList/met` | MET amp | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Untersuchung (Unterformular von OS.Molekulargenetik) → Untersucht (Gen) = MET (OS.Molekulargenetik) | Amplifikation |

</details>

#### Werteübersetzungen

**`findingList/finding/resistanceTestingList/alk/alkResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positive | positiv (amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=CNV, CNV=G oder LLG | High/Low Level Amplifikation | vorläufig | Import-Richtung: High oder Low Level offen |
| negative | negativ (nicht amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=N | Wildtyp (WT) / negativ | vorläufig |  |
| notEvaluable | nicht auswertbar | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/resistanceTestingList/braf/brafResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positive | positiv (amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=CNV, CNV=G oder LLG | High/Low Level Amplifikation | vorläufig | Import-Richtung: High oder Low Level offen |
| negative | negativ (nicht amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=N | Wildtyp (WT) / negativ | vorläufig |  |
| notEvaluable | nicht auswertbar | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/resistanceTestingList/egfr/egfrResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positive | positiv (amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=CNV, CNV=G oder LLG | High/Low Level Amplifikation | vorläufig | Import-Richtung: High oder Low Level offen |
| negative | negativ (nicht amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=N | Wildtyp (WT) / negativ | vorläufig |  |
| notEvaluable | nicht auswertbar | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/resistanceTestingList/her2/her2Result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positive | positiv (amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=CNV, CNV=G oder LLG | High/Low Level Amplifikation | vorläufig | Import-Richtung: High oder Low Level offen |
| negative | negativ (nicht amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=N | Wildtyp (WT) / negativ | vorläufig |  |
| notEvaluable | nicht auswertbar | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/resistanceTestingList/kit17/kit17AdditionalInformationGroup/kit17GenomeBuild`** – Genome build

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| grCh37Hg19 | GRCh37 (hg19) | OS.MolSeqGenom |  | HG19 | HG19 | vorläufig |  |
| grCh38 | GRCh38 | OS.MolSeqGenom |  | HG38 | HG38 | vorläufig |  |

**`findingList/finding/resistanceTestingList/kit17/kit17AdditionalInformationGroup/kit17Chromosome`** – Chromosom

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| * | (Regel) | OS.MolDiagFusionChromosome |  | * identisch (chr1–chr22, chrX, chrY) |  | vorläufig |  |
| chrM | chrM | OS.MolDiagFusionChromosome |  |  |  | ungelöst | fehlt in Onkostar |

**`findingList/finding/resistanceTestingList/kras/krasResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positive | positiv (amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=CNV, CNV=G oder LLG | High/Low Level Amplifikation | vorläufig | Import-Richtung: High oder Low Level offen |
| negative | negativ (nicht amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=N | Wildtyp (WT) / negativ | vorläufig |  |
| notEvaluable | nicht auswertbar | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/resistanceTestingList/met/metResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positive | positiv (amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=CNV, CNV=G oder LLG | High/Low Level Amplifikation | vorläufig | Import-Richtung: High oder Low Level offen |
| negative | negativ (nicht amplifiziert) | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=N | Wildtyp (WT) / negativ | vorläufig |  |
| notEvaluable | nicht auswertbar | OS.MolGenErgebnis / OS.MolCopyNumberVariation |  | Ergebnis=UX | untersucht, kein Ergebnis | vorläufig |  |

### ISH/FISH (`ishFish`)

126 Felder – 52 vorläufig, 74 ungelöst. Entscheidungen: E-9.

#### Vorläufig (34)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetik) |  |
| `findingList/finding/reference/comment` | Kommentar | FreeText | A | OS.Molekulargenetik → Bemerkung |  |
| `findingList/finding/examination/ishList/ishAlk/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/ishList/ishAlk/ishAlkExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/ishList/ishMet/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/ishList/ishMet/ishMetExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/ishList/ishMet/ishMetResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv high-/intermediate-level → CNV (Stufe ohne Feld), negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/ishList/ishRet/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/ishList/ishRet/ishRetExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/ishList/ishRos1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/ishList/ishRos1/ishRos1ExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/fishList/fishAlk/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/fishList/fishAlk/fishAlkExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/fishList/fishEgfr/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → CNV, negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/fishList/fishErbb2/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/fishList/fishErbb2/fishErbb2ExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/fishList/fishErbb2/fishErbb2Result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → CNV, negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/fishList/fishKras/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/fishList/fishKras/fishKrasExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/fishList/fishMet/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/fishList/fishMet/fishMetExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/fishList/fishMet/fishMetResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → CNV, negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/fishList/fishNtrk1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/fishList/fishNtrk1/fishNtrk1ExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/fishList/fishNtrk2/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/fishList/fishNtrk2/fishNtrk2ExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/fishList/fishNtrk3/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/fishList/fishNtrk3/fishNtrk3ExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/fishList/fishRet/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/fishList/fishRet/fishRetExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |
| `findingList/finding/examination/fishList/fishRos1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Hybridisierung) |  |
| `findingList/finding/examination/fishList/fishRos1/fishRos1ExaminationDate` | Datum Untersuchungsergebnis | MedicalDate | B | OS.Molekulargenetik → Datum | kein Datum je Test im Hybridisierungs-Unterformular – nur Datum der Einsendung; bei verschiedenen Daten Verlust (E-9) |

#### Ungelöst (74)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/reference/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `findingList/finding/examination/ishList` | In-situ-Hybridisierung (ISH) | List | B | OS.Molekulargenetik → ArtinsituHybridisierung = CISH (OS.MolArtderHybridisierung) | CISH und FISH im selben Befund: ein OS.Molekulargenetik hat nur eine „Art der Hybridisierung“ – Lösung offen (E-9) |
| `findingList/finding/examination/ishList/ishAlk/ishAlkKitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/ishList/ishAlk/ishAlkResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Break-Apart positiv → F (Fusion) oder T (Translokation)? (E-9 Frage); negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/ishList/ishAlk/ishAlkCellCount` | Positive Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/ishList/ishMet/ishMetKitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/ishList/ishRet/ishRetKitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/ishList/ishRet/ishRetResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Break-Apart positiv → F (Fusion) oder T (Translokation)? (E-9 Frage); negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/ishList/ishRet/ishRetCellCount` | Positive Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/ishList/ishRos1/ishRos1KitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/ishList/ishRos1/ishRos1Result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Break-Apart positiv → F (Fusion) oder T (Translokation)? (E-9 Frage); negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/ishList/ishRos1/ishRos1CellCount` | Positive Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList` | Fluoreszenz-in-situ-Hybridisierung (FISH) | List | B | OS.Molekulargenetik → ArtinsituHybridisierung = FISH (OS.MolArtderHybridisierung) | CISH und FISH im selben Befund: ein OS.Molekulargenetik hat nur eine „Art der Hybridisierung“ – Lösung offen (E-9) |
| `findingList/finding/examination/fishList/fishAlk/fishAlkKitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishAlk/fishAlkResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Break-Apart positiv → F (Fusion) oder T (Translokation)? (E-9 Frage); negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/fishList/fishAlk/fishAlkCellCount` | Positive Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishAlk/fishAlkPolysomy` | Polysomie | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrKitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrAmplification` | Amplifikation | Enumeration | C |  | Amplifikationsstufe (high/intermediate/low): kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9); in OS.Molekulargenetische Untersuchung gäbe es CNV-Typ bzw. MET Level |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrPercentCellsHighLevel` | Prozentzahl an Zellen mit mehr als 15 EGFR-Signalen pro Zelle (Positiv ≥ 10 %) bei einer low-level Amplifikation | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrPercentCellsLowLevel` | Prozentzahl an Zellen mit mehr als 4 EGFR-Signalen pro Zelle (Positiv ≥ 40 %) bei einer low-level Amplifikation | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrCellCount` | gezählte Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrSignalCountMET` | EGFR Signale | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9); Feldname „MET“ bei EGFR offenbar aus dem MET-Block kopiert, gemeint ist das untersuchte Gen |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrSignalCountCEN` | CEN Signale | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrSignalQuotientMETToCEN` | Quotient EGFR / CEN7 Signale | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9); Feldname „MET“ bei EGFR offenbar aus dem MET-Block kopiert, gemeint ist das untersuchte Gen |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrMeanMETPerCell` | Durchschnitt EGFR-Genkopiezahl / Zelle (Positiv ≥ 6) | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9); Feldname „MET“ bei EGFR offenbar aus dem MET-Block kopiert, gemeint ist das untersuchte Gen |
| `findingList/finding/examination/fishList/fishEgfr/fishEgfrPolysomy` | Polysomie | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishErbb2/fishErbb2KitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishErbb2/fishErbb2CellCount` | gezählte Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishErbb2/fishErbb2SignalCountMET` | ERBB2 (HER2) Signale | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9); Feldname „MET“ bei ERBB2 offenbar aus dem MET-Block kopiert, gemeint ist das untersuchte Gen |
| `findingList/finding/examination/fishList/fishErbb2/fishErbb2SignalCountCEN` | CEN Signale | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishErbb2/fishErbb2SignalQuotientMETToCEN` | Quotient ERBB2 (HER2) / CEN17 Signale | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9); Feldname „MET“ bei ERBB2 offenbar aus dem MET-Block kopiert, gemeint ist das untersuchte Gen |
| `findingList/finding/examination/fishList/fishErbb2/fishErbb2MeanMETPerCell` | Durchschnitt ERBB2 (HER2)-Genkopiezahl / Zelle (Positiv ≥ 6) | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9); Feldname „MET“ bei ERBB2 offenbar aus dem MET-Block kopiert, gemeint ist das untersuchte Gen |
| `findingList/finding/examination/fishList/fishErbb2/fishErbb2Polysomy` | Polysomie | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishKras/fishKrasKitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishKras/fishKrasResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → CNV, negativ → N, nicht auswertbar → UX; hohe Polysomie (≥ 40 % / 10–40 % Zellen) ohne Gegenstück (ungelöst) |
| `findingList/finding/examination/fishList/fishKras/fishKrasPercentCellsHighLevel` | Prozentzahl an Zellen mit mehr als 15 KRAS-Signalen pro Zelle (Cluster) | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishKras/fishKrasPercentCellsLowLevel` | Prozentzahl an Zellen mit mehr als 4 KRAS-Signalen pro Zelle | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishKras/fishKrasCellCount` | gezählte Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishKras/fishKrasSignalCountMET` | KRAS Signale | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9); Feldname „MET“ bei KRAS offenbar aus dem MET-Block kopiert, gemeint ist das untersuchte Gen |
| `findingList/finding/examination/fishList/fishKras/fishKrasSignalCountCEN` | CEN Signale | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishKras/fishKrasSignalQuotientMETToCEN` | Quotient KRAS / CEN12 Signale | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9); Feldname „MET“ bei KRAS offenbar aus dem MET-Block kopiert, gemeint ist das untersuchte Gen |
| `findingList/finding/examination/fishList/fishKras/fishKrasMeanMETPerCell` | Durchschnitt KRAS-Genkopiezahl / Zelle | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9); Feldname „MET“ bei KRAS offenbar aus dem MET-Block kopiert, gemeint ist das untersuchte Gen |
| `findingList/finding/examination/fishList/fishMet/fishMetKitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishMet/fishMetAmplification` | Amplifikation | Enumeration | C |  | Amplifikationsstufe (high/intermediate/low): kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9); in OS.Molekulargenetische Untersuchung gäbe es CNV-Typ bzw. MET Level |
| `findingList/finding/examination/fishList/fishMet/fishMetPercentCellsHighLevel` | Prozentzahl an Zellen mit mehr als 15 MET-Signalen pro Zelle (Positiv ≥ 10 %) bei einer high-level Amplifikation | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishMet/fishMetPercentCellsMediumLevel` | Prozentzahl an Zellen mit mehr als 5 MET-Signalen pro Zelle (Positiv ≥ 50 %) bei einer intermediate-level Amplifikation | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishMet/fishMetPercentCellsLowLevel` | Prozentzahl an Zellen mit mehr als 4 MET-Signalen pro Zelle (Positiv ≥ 40 %) bei einer low-level Amplifikation | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishMet/fishMetCellCount` | gezählte Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishMet/fishMetSignalCountMET` | MET Signale | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishMet/fishMetSignalCountCEN` | CEN Signale | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishMet/fishMetSignalQuotientMETToCEN` | Quotient MET / CEN7 Signale | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishMet/fishMetMeanMETPerCell` | Durchschnitt MET-Genkopiezahl / Zelle (Positiv ≥ 6) | Decimal | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishMet/fishMetPolysomy` | Polysomie | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishNtrk1/fishNtrk1KitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishNtrk1/fishNtrk1Result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Break-Apart positiv → F (Fusion) oder T (Translokation)? (E-9 Frage); negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/fishList/fishNtrk1/fishNtrk1CellCount` | Positive Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishNtrk1/fishNtrk1Polysomy` | Polysomie | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishNtrk2/fishNtrk2KitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishNtrk2/fishNtrk2Result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Break-Apart positiv → F (Fusion) oder T (Translokation)? (E-9 Frage); negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/fishList/fishNtrk2/fishNtrk2CellCount` | Positive Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishNtrk2/fishNtrk2Polysomy` | Polysomie | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishNtrk3/fishNtrk3KitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishNtrk3/fishNtrk3Result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Break-Apart positiv → F (Fusion) oder T (Translokation)? (E-9 Frage); negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/fishList/fishNtrk3/fishNtrk3CellCount` | Positive Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishNtrk3/fishNtrk3Polysomy` | Polysomie | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishRet/fishRetKitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishRet/fishRetResult` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Break-Apart positiv → F (Fusion) oder T (Translokation)? (E-9 Frage); negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/fishList/fishRet/fishRetCellCount` | Positive Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishRet/fishRetPolysomy` | Polysomie | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishRos1/fishRos1KitDescription` | Kit Bezeichnung | Enumeration | C |  | Kit: kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishRos1/fishRos1Result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | Break-Apart positiv → F (Fusion) oder T (Translokation)? (E-9 Frage); negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/fishList/fishRos1/fishRos1CellCount` | Positive Tumorzellen | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/fishList/fishRos1/fishRos1Polysomy` | Polysomie | Integer | C |  | kein Feld im Hybridisierungs-Unterformular (nur Gen, Ergebnis, fusioniertes Gen); Vorschlag E-8: abgeleitetes Hybridisierungs-Unterformular mit Erweiterungskatalog (E-9) |

<details>
<summary>Strukturelemente (18: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList` | Befunde | List | Struktur |  | Liste → OS.Molekulargenetik je Befund |
| `findingList/finding` | Tumormaterial | ListEntry (mehrfach) | Struktur | OS.Molekulargenetik | Analysemethode = (in-situ) Hybridisierung; CISH und FISH im selben Befund: ein OS.Molekulargenetik hat nur eine „Art der Hybridisierung“ – Lösung offen (E-9) |
| `findingList/finding/reference` | Referenzen | FieldGroup | Struktur |  |  |
| `findingList/finding/examination` | Untersuchungen | FieldGroup | Struktur |  |  |
| `findingList/finding/examination/ishList/ishAlk` | ALK | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = ALK (OS.Molekulargenetik) | CISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/ishList/ishMet` | MET | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = MET (OS.Molekulargenetik) | CISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/ishList/ishRet` | RET | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = RET (OS.Molekulargenetik) | CISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/ishList/ishRos1` | ROS1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = ROS1 (OS.Molekulargenetik) | CISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/fishList/fishAlk` | ALK | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = ALK (OS.Molekulargenetik) | FISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/fishList/fishEgfr` | EGFR | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = EGFR (OS.Molekulargenetik) | FISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/fishList/fishErbb2` | ERBB2 (HER2) | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = ERBB2 (OS.Molekulargenetik) | FISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/fishList/fishKras` | KRAS | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = KRAS (OS.Molekulargenetik) | FISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/fishList/fishMet` | MET | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = MET (OS.Molekulargenetik) | FISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/fishList/fishNtrk1` | NTRK1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = NTRK1 (OS.Molekulargenetik) | FISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/fishList/fishNtrk2` | NTRK2 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = NTRK2 (OS.Molekulargenetik) | FISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/fishList/fishNtrk3` | NTRK3 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = NTRK3 (OS.Molekulargenetik) | FISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/fishList/fishRet` | RET | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = RET (OS.Molekulargenetik) | FISH; je Test ein Hybridisierungs-Eintrag |
| `findingList/finding/examination/fishList/fishRos1` | ROS1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Hybridisierung (Unterformular von OS.Molekulargenetik) → Gen = ROS1 (OS.Molekulargenetik) | FISH; je Test ein Hybridisierungs-Eintrag |

</details>

#### Werteübersetzungen

**`findingList/finding/examination/ishList/ishAlk/ishAlkResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | F oder T | Fusion bzw. Translokation | ungelöst | Frage F/T (E-9) |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/ishList/ishMet/ishMetResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv (high-level amplification) | Amplifikation high-level (positiv) | OS.MolGenErgebnis |  | CNV | Copy number variation | vorläufig | Stufe ohne Feld |
| positiv (moderate-level amplification) | Amplifikation intermediate-level | OS.MolGenErgebnis |  | CNV | Copy number variation | vorläufig | Stufe ohne Feld |
| negativ | keine Amplifikation | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/ishList/ishRet/ishRetResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | F oder T | Fusion bzw. Translokation | ungelöst | Frage F/T (E-9) |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/ishList/ishRos1/ishRos1Result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | F oder T | Fusion bzw. Translokation | ungelöst | Frage F/T (E-9) |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/fishList/fishAlk/fishAlkResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | F oder T | Fusion bzw. Translokation | ungelöst | Frage F/T (E-9) |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/fishList/fishEgfr/fishEgfrResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv (Amplifikation) | OS.MolGenErgebnis |  | CNV | Copy number variation | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/fishList/fishErbb2/fishErbb2Result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv (Amplifikation) | OS.MolGenErgebnis |  | CNV | Copy number variation | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/fishList/fishKras/fishKrasResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv (Amplifikation) | OS.MolGenErgebnis |  | CNV | Copy number variation | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |
| highPolysomyOver40 | hohe Polysomie (≥ 4 Kopien in ≥ 40% Zellen) | OS.MolGenErgebnis |  |  |  | ungelöst | kein Gegenstück |
| highPolysomy10To40 | hohe Polysomie (≥ 4 Kopien in 10-40% Zellen) | OS.MolGenErgebnis |  |  |  | ungelöst | kein Gegenstück |

**`findingList/finding/examination/fishList/fishMet/fishMetResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv (Amplifikation) | OS.MolGenErgebnis |  | CNV | Copy number variation | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/fishList/fishNtrk1/fishNtrk1Result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | F oder T | Fusion bzw. Translokation | ungelöst | Frage F/T (E-9) |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/fishList/fishNtrk2/fishNtrk2Result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | F oder T | Fusion bzw. Translokation | ungelöst | Frage F/T (E-9) |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/fishList/fishNtrk3/fishNtrk3Result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | F oder T | Fusion bzw. Translokation | ungelöst | Frage F/T (E-9) |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/fishList/fishRet/fishRetResult`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | F oder T | Fusion bzw. Translokation | ungelöst | Frage F/T (E-9) |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/fishList/fishRos1/fishRos1Result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | F oder T | Fusion bzw. Translokation | ungelöst | Frage F/T (E-9) |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

### Immunhistochemie (`immunohistochemistry`)

85 Felder – 50 vorläufig, 35 ungelöst. Entscheidungen: E-9.

#### Vorläufig (29)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetik) |  |
| `findingList/finding/examination/ALK/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/BRAF/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/BRAF/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/CK7/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/CK7/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/MET/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/MIB1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/NapsinA/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/NapsinA/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/Synaptophysin/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/Synaptophysin/neuroendocrineMarker` | Neuroendokrine Marker | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) (OS.Molekulargenetik) | CD56 → NCAM1, Chromogranin → CHGA, Synaptophysin → SYP, Andere → otherNeuroendocrineMarker |
| `findingList/finding/examination/Synaptophysin/otherNeuroendocrineMarker` | Bitte spezifizieren Sie "Andere" | FreeText | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) (OS.Molekulargenetik) | Freitext → Code im Genkatalog (Übersetzung nötig) |
| `findingList/finding/examination/Synaptophysin/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/NTRK1to3/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/NTRK1to3/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/P40/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/P40/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `findingList/finding/examination/PDL1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/PDL1/tpsGroup/tpsScore` | Tumor-Proportion-Score (TPS) | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → TC (OS.MolIC) | TC-Score 0 → <1 %, 1–4 → 1–49 %, 5–6 → ≥50 %; alternativ aus TPS (%) ableitbar |
| `findingList/finding/examination/PDL1/tpsGroup/tpsExactPercentage` | Genaue Prozentzahl | Integer | A | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → TPS | TPS (%) |
| `findingList/finding/examination/PDL1/icsGroup/icsScore` | Immun-Cell-Score (IC) | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → ICScore (OS.MolIC) | IC-Score 0 → <1 %, 1 → 1–4 %, 2 → 5–9 %, 3–6 → ≥10 % |
| `findingList/finding/examination/PDL1/icsGroup/icsExactPercentage` | Genaue Prozentzahl | Integer | A | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → IC | IC (%) |
| `findingList/finding/examination/PDL1/cpsGroup/cpsScore` | Combined-Positive-Score (CPS) | Enumeration | D |  | ja/nein „CPS bestimmt“: abgeleitet aus CPS ausgefüllt |
| `findingList/finding/examination/PDL1/cpsGroup/cpsExactNumber` | Genaue Zahl | Integer | A | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → CPS |  |
| `findingList/finding/examination/PDL1/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | nicht auswertbar → UX; auswertbar → Ergebnis gesetzt (Scores ausgefüllt) |
| `findingList/finding/examination/ROS1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/TTF1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `findingList/finding/examination/TTF1/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |

#### Ungelöst (34)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/biopsy/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `findingList/finding/examination/ALK/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/ALK/alkIHC/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `findingList/finding/examination/ALK/alkIHC/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX; „fraglich“ ohne Gegenstück (ungelöst) |
| `findingList/finding/examination/BRAF/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/BRAF/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `findingList/finding/examination/CK7/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/CK7/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `findingList/finding/examination/MET/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/MET/metIHC/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `findingList/finding/examination/MET/metIHC/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX; „fraglich“ ohne Gegenstück (ungelöst) |
| `findingList/finding/examination/MET/metIHC/classification` | Klassifikation | Enumeration | C |  | MET-Klassifikation 0/1+/2+/3+: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/MET/metIHC/Expression` | Expression high-level | Enumeration | C |  | MET-Expression ja/nein: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/MIB1/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/MIB1/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `findingList/finding/examination/MIB1/result` | Ergebnis | Enumeration | C |  | Ki-67-Bereich (<20 / 20–49 / 50–80 / >80 %): als Feld im Erweiterungskatalog (E-8), aus dem exakten Wert ableitbar; Alternative: Ki-67 (%) in OS.Pathologiebefund (anderes Formular) |
| `findingList/finding/examination/MIB1/exactPercentage` | Genaue Prozentzahl | Integer | C |  | Ki-67 exakt (%): bevorzugt Feld im Erweiterungskatalog (E-8); Alternative: OS.Pathologiebefund → Ki67 (%) – anderes Formular als die übrigen IHC-Marker |
| `findingList/finding/examination/NapsinA/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/NapsinA/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `findingList/finding/examination/Synaptophysin/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/Synaptophysin/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `findingList/finding/examination/NTRK1to3/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/NTRK1to3/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `findingList/finding/examination/P40/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/P40/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `findingList/finding/examination/PDL1/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/PDL1/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `findingList/finding/examination/PDL1/tpsGroup/tpsNoPercentage` | Keine genaue Prozentzahl | Enumeration | C |  | „nicht bestimmt / nicht auswertbar“ je Score: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/PDL1/icsGroup/icsNoPercentage` | Keine genaue Prozentzahl | Enumeration | C |  | „nicht bestimmt / nicht auswertbar“ je Score: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/PDL1/cpsGroup/cpsNoPercentage` | Keine genaue Prozentzahl | Enumeration | C |  | „nicht bestimmt / nicht auswertbar“ je Score: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/ROS1/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/ROS1/ros1IHC/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX; „fraglich“ ohne Gegenstück (ungelöst) |
| `findingList/finding/examination/TTF1/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `findingList/finding/examination/TTF1/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |

<details>
<summary>Strukturelemente (22: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList` | Befunde | List | Struktur |  | Liste → OS.Molekulargenetik je Befund |
| `findingList/finding` | Tumormaterial | ListEntry (mehrfach) | Struktur | OS.Molekulargenetik | Analysemethode = Immunhistochemie (I), je Marker ein IHC-Eintrag |
| `findingList/finding/biopsy` | Referenzen | FieldGroup | Struktur |  |  |
| `findingList/finding/examination` | Untersuchungen | List | Struktur |  |  |
| `findingList/finding/examination/ALK` | ALK | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = ALK (OS.Molekulargenetik) |  |
| `findingList/finding/examination/ALK/alkIHC` | IHC | FieldGroup | Struktur |  |  |
| `findingList/finding/examination/BRAF` | BRAF | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = BRAF (OS.Molekulargenetik) |  |
| `findingList/finding/examination/CK7` | CK7 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = CK7 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/MET` | MET | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = MET (OS.Molekulargenetik) |  |
| `findingList/finding/examination/MET/metIHC` | IHC | FieldGroup | Struktur |  |  |
| `findingList/finding/examination/MIB1` | MIB1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = MKI67 (OS.Molekulargenetik) | MIB1-Antikörper = Ki-67 (MKI67) |
| `findingList/finding/examination/NapsinA` | Napsin A | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = NAPSA (OS.Molekulargenetik) |  |
| `findingList/finding/examination/Synaptophysin` | Neuroendokrine Marker | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = NCAM1 / CHGA / SYP (aus neuroendocrineMarker) (OS.Molekulargenetik) |  |
| `findingList/finding/examination/NTRK1to3` | NTRK1-3 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) (OS.Molekulargenetik) | pan-TRK (NTRK1–3) hat keinen gemeinsamen Code; mögliche Umsetzung: NTRK1 mit Notiz (E-9) |
| `findingList/finding/examination/P40` | P40 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = P40 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/PDL1` | PD-L1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = PDL1 (OS.Molekulargenetik) | Code PDL1, sonst sind die Score-Felder ausgeblendet |
| `findingList/finding/examination/PDL1/tpsGroup` | Tumor-Proportion-Score (TPS) | FieldGroup | Struktur |  |  |
| `findingList/finding/examination/PDL1/icsGroup` | Immun-Cell-Score (IC) | FieldGroup | Struktur |  |  |
| `findingList/finding/examination/PDL1/cpsGroup` | Combined-Positive-Score (CPS) | FieldGroup | Struktur |  |  |
| `findingList/finding/examination/ROS1` | ROS1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = ROS1 (OS.Molekulargenetik) |  |
| `findingList/finding/examination/ROS1/ros1IHC` | IHC | FieldGroup | Struktur |  |  |
| `findingList/finding/examination/TTF1` | TTF1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = TTF1 (OS.Molekulargenetik) |  |

</details>

#### Werteübersetzungen

**`findingList/finding/examination/ALK/alkIHC/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |
| fraglich | fraglich | OS.MolGenErgebnis |  |  |  | ungelöst | kein Gegenstück |

**`findingList/finding/examination/BRAF/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/CK7/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/MET/metIHC/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |
| fraglich | fraglich | OS.MolGenErgebnis |  |  |  | ungelöst | kein Gegenstück |

**`findingList/finding/examination/NapsinA/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/Synaptophysin/neuroendocrineMarker`** – Neuroendokrine Marker

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| CD56 | CD56 | OS.Molekulargenetik |  | NCAM1 | NCAM1 | vorläufig |  |
| chromogranin | Chromogranin | OS.Molekulargenetik |  | CHGA | CHGA | vorläufig |  |
| synaptophysin | Synaptophysin | OS.Molekulargenetik |  | SYP | SYP | vorläufig |  |
| other | Andere | OS.Molekulargenetik |  | (otherNeuroendocrineMarker) |  | vorläufig |  |

**`findingList/finding/examination/Synaptophysin/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/NTRK1to3/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/P40/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`findingList/finding/examination/PDL1/tpsGroup/tpsScore`** – Tumor-Proportion-Score (TPS)

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| lowerThan1% | < 1 % | OS.MolIC |  | 0 | 0 (<1%) | vorläufig |  |
| from1%To49% | 1–49 % | OS.MolIC |  | 1, 2, 3, 4 | ≥1 % … ≥25 % | vorläufig |  |
| overOrEqual50% | ≥ 50 % | OS.MolIC |  | 5, 6 | ≥50 %, ≥75 % | vorläufig |  |

**`findingList/finding/examination/PDL1/icsGroup/icsScore`** – Immun-Cell-Score (IC)

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| lowerThan1% | < 1 % | OS.MolIC |  | 0 | 0 (<1%) | vorläufig |  |
| from1%To4% | 1–4 % | OS.MolIC |  | 1 | 1 (>= 1%) | vorläufig |  |
| from5%To9% | 5–9 % | OS.MolIC |  | 2 | 2 (>= 5%) | vorläufig |  |
| overOrEqual10% | ≥ 10 % | OS.MolIC |  | 3, 4, 5, 6 | ≥10 % … | vorläufig |  |

**`findingList/finding/examination/ROS1/ros1IHC/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |
| fraglich | fraglich | OS.MolGenErgebnis |  |  |  | ungelöst | kein Gegenstück |

**`findingList/finding/examination/TTF1/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

### Immunhistochemie (`preliminaryFindingsImmunohistochemistry`)

85 Felder – 50 vorläufig, 35 ungelöst. Entscheidungen: E-9.

#### Vorläufig (31)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `pfIhcs/pfIhc/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetik) |  |
| `pfIhcs/pfIhc/biopsy/dateOfResult` | Befunddatum | MedicalDate | A | OS.Molekulargenetik → Datum (Befunddatum) | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/biopsy/resultNumber` | Befundnummer | FreeText | A | OS.Molekulargenetik → Einsendenummer | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/ALK/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/BRAF/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/BRAF/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `pfIhcs/pfIhc/IHC/CK7/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/CK7/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `pfIhcs/pfIhc/IHC/MET/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/MIB1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/NapsinA/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/NapsinA/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `pfIhcs/pfIhc/IHC/Synaptophysin/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/Synaptophysin/neuroendocrineMarker` | Neuroendokrine Marker | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) (OS.Molekulargenetik) | CD56 → NCAM1, Chromogranin → CHGA, Synaptophysin → SYP, Andere → otherNeuroendocrineMarker |
| `pfIhcs/pfIhc/IHC/Synaptophysin/otherNeuroendocrineMarker` | Bitte spezifizieren Sie "Andere" | FreeText | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) (OS.Molekulargenetik) | Freitext → Code im Genkatalog (Übersetzung nötig) |
| `pfIhcs/pfIhc/IHC/Synaptophysin/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `pfIhcs/pfIhc/IHC/NTRK1to3/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/NTRK1to3/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `pfIhcs/pfIhc/IHC/P40/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/P40/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |
| `pfIhcs/pfIhc/IHC/PDL1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/PDL1/tpsGroup/tpsScore` | Tumor-Proportion-Score (TPS) | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → TC (OS.MolIC) | TC-Score 0 → <1 %, 1–4 → 1–49 %, 5–6 → ≥50 %; alternativ aus TPS (%) ableitbar |
| `pfIhcs/pfIhc/IHC/PDL1/tpsGroup/tpsExactPercentage` | Genaue Prozentzahl | Integer | A | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → TPS | TPS (%) |
| `pfIhcs/pfIhc/IHC/PDL1/icsGroup/icsScore` | Immun-Cell-Score (IC) | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → ICScore (OS.MolIC) | IC-Score 0 → <1 %, 1 → 1–4 %, 2 → 5–9 %, 3–6 → ≥10 % |
| `pfIhcs/pfIhc/IHC/PDL1/icsGroup/icsExactPercentage` | Genaue Prozentzahl | Integer | A | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → IC | IC (%) |
| `pfIhcs/pfIhc/IHC/PDL1/cpsGroup/cpsScore` | Combined-Positive-Score (CPS) | Enumeration | D |  | ja/nein „CPS bestimmt“: abgeleitet aus CPS ausgefüllt |
| `pfIhcs/pfIhc/IHC/PDL1/cpsGroup/cpsExactNumber` | Genaue Zahl | Integer | A | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → CPS |  |
| `pfIhcs/pfIhc/IHC/PDL1/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | nicht auswertbar → UX; auswertbar → Ergebnis gesetzt (Scores ausgefüllt) |
| `pfIhcs/pfIhc/IHC/ROS1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/TTF1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (IHC-Eintrag) |  |
| `pfIhcs/pfIhc/IHC/TTF1/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX |

#### Ungelöst (34)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `pfIhcs/pfIhc/biopsy/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `pfIhcs/pfIhc/site/siteLocation` | Standort | NngmNetworkLocation | D |  | NngmNetworkLocation – allgemeine Frage Netzwerkpartner |
| `pfIhcs/pfIhc/IHC/ALK/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/ALK/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `pfIhcs/pfIhc/IHC/ALK/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX; „fraglich“ ohne Gegenstück (ungelöst) |
| `pfIhcs/pfIhc/IHC/BRAF/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/BRAF/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `pfIhcs/pfIhc/IHC/CK7/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/CK7/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `pfIhcs/pfIhc/IHC/MET/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/MET/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `pfIhcs/pfIhc/IHC/MET/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX; „fraglich“ ohne Gegenstück (ungelöst) |
| `pfIhcs/pfIhc/IHC/MET/classification` | Klassifikation | Enumeration | C |  | MET-Klassifikation 0/1+/2+/3+: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/MET/expression` | Expression high-level | Enumeration | C |  | MET-Expression ja/nein: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/MIB1/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/MIB1/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `pfIhcs/pfIhc/IHC/MIB1/result` | Ergebnis | Enumeration | C |  | Ki-67-Bereich (<20 / 20–49 / 50–80 / >80 %): als Feld im Erweiterungskatalog (E-8), aus dem exakten Wert ableitbar; Alternative: Ki-67 (%) in OS.Pathologiebefund (anderes Formular) |
| `pfIhcs/pfIhc/IHC/MIB1/exactPercentage` | Genaue Prozentzahl | Integer | C |  | Ki-67 exakt (%): bevorzugt Feld im Erweiterungskatalog (E-8); Alternative: OS.Pathologiebefund → Ki67 (%) – anderes Formular als die übrigen IHC-Marker |
| `pfIhcs/pfIhc/IHC/NapsinA/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/NapsinA/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema); nutzt hier die NTRK-Antikörperliste (vermutlich Fehler im Schema) |
| `pfIhcs/pfIhc/IHC/Synaptophysin/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/NTRK1to3/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/NTRK1to3/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `pfIhcs/pfIhc/IHC/P40/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/P40/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `pfIhcs/pfIhc/IHC/PDL1/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/PDL1/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |
| `pfIhcs/pfIhc/IHC/PDL1/tpsGroup/tpsNoPercentage` | Keine genaue Prozentzahl | Enumeration | C |  | „nicht bestimmt / nicht auswertbar“ je Score: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/PDL1/icsGroup/icsNoPercentage` | Keine genaue Prozentzahl | Enumeration | C |  | „nicht bestimmt / nicht auswertbar“ je Score: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/PDL1/cpsGroup/cpsNoPercentage` | Keine genaue Prozentzahl | Enumeration | C |  | „nicht bestimmt / nicht auswertbar“ je Score: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/ROS1/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/ROS1/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P, negativ → N, nicht auswertbar → UX; „fraglich“ ohne Gegenstück (ungelöst) |
| `pfIhcs/pfIhc/IHC/TTF1/date` | Datum | MedicalDate | C |  | kein Datum je Marker im IHC-Unterformular, nur Datum der Einsendung; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9) |
| `pfIhcs/pfIhc/IHC/TTF1/anitbody` | Antikörper | Enumeration | C |  | Antikörper: kein Feld; Vorschlag E-8: abgeleitetes IHC-Unterformular mit Erweiterungskatalog (E-9); nNGM-Feldname „anitbody“ (Schreibfehler im Schema) |

<details>
<summary>Strukturelemente (20: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `pfIhcs` | Befunde | List | Struktur |  | Liste → OS.Molekulargenetik je Befund |
| `pfIhcs/pfIhc` | Tumormaterial | ListEntry (mehrfach) | Struktur | OS.Molekulargenetik | Analysemethode = Immunhistochemie (I), je Marker ein IHC-Eintrag; [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/biopsy` | Biopsie Referenzen | FieldGroup | Struktur |  |  |
| `pfIhcs/pfIhc/site` | Netzwerkzentrum | FieldGroup | Struktur |  |  |
| `pfIhcs/pfIhc/IHC` | Untersuchungen | List | Struktur |  |  |
| `pfIhcs/pfIhc/IHC/ALK` | ALK | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = ALK (OS.Molekulargenetik) | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/BRAF` | BRAF | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = BRAF (OS.Molekulargenetik) | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/CK7` | CK7 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = CK7 (OS.Molekulargenetik) | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/MET` | MET | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = MET (OS.Molekulargenetik) | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/MIB1` | MIB1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = MKI67 (OS.Molekulargenetik) | MIB1-Antikörper = Ki-67 (MKI67); [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/NapsinA` | Napsin A | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = NAPSA (OS.Molekulargenetik) | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/Synaptophysin` | Neuroendokrine Marker | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = NCAM1 / CHGA / SYP (aus neuroendocrineMarker) (OS.Molekulargenetik) | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/NTRK1to3` | NTRK1-3 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) (OS.Molekulargenetik) | pan-TRK (NTRK1–3) hat keinen gemeinsamen Code; mögliche Umsetzung: NTRK1 mit Notiz (E-9); [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/P40` | P40 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = P40 (OS.Molekulargenetik) | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/PDL1` | PD-L1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = PDL1 (OS.Molekulargenetik) | Code PDL1, sonst sind die Score-Felder ausgeblendet; [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/PDL1/tpsGroup` | Tumor-Proportion-Score (TPS) | FieldGroup | Struktur |  |  |
| `pfIhcs/pfIhc/IHC/PDL1/icsGroup` | Immun-Cell-Score (IC) | FieldGroup | Struktur |  |  |
| `pfIhcs/pfIhc/IHC/PDL1/cpsGroup` | Combined-Positive-Score (CPS) | FieldGroup | Struktur |  |  |
| `pfIhcs/pfIhc/IHC/ROS1` | ROS1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = ROS1 (OS.Molekulargenetik) | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `pfIhcs/pfIhc/IHC/TTF1` | TTF1 | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische Immunhistochemie (Unterformular von OS.Molekulargenetik) → Gen (Protein) = TTF1 (OS.Molekulargenetik) | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |

</details>

#### Werteübersetzungen

**`pfIhcs/pfIhc/IHC/ALK/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |
| fraglich | fraglich | OS.MolGenErgebnis |  |  |  | ungelöst | kein Gegenstück |

**`pfIhcs/pfIhc/IHC/BRAF/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`pfIhcs/pfIhc/IHC/CK7/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`pfIhcs/pfIhc/IHC/MET/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |
| fraglich | fraglich | OS.MolGenErgebnis |  |  |  | ungelöst | kein Gegenstück |

**`pfIhcs/pfIhc/IHC/NapsinA/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`pfIhcs/pfIhc/IHC/Synaptophysin/neuroendocrineMarker`** – Neuroendokrine Marker

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| CD56 | CD56 | OS.Molekulargenetik |  | NCAM1 | NCAM1 | vorläufig |  |
| chromogranin | Chromogranin | OS.Molekulargenetik |  | CHGA | CHGA | vorläufig |  |
| synaptophysin | Synaptophysin | OS.Molekulargenetik |  | SYP | SYP | vorläufig |  |
| other | Andere | OS.Molekulargenetik |  | (otherNeuroendocrineMarker) |  | vorläufig |  |

**`pfIhcs/pfIhc/IHC/Synaptophysin/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`pfIhcs/pfIhc/IHC/NTRK1to3/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`pfIhcs/pfIhc/IHC/P40/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

**`pfIhcs/pfIhc/IHC/PDL1/tpsGroup/tpsScore`** – Tumor-Proportion-Score (TPS)

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| lowerThan1% | < 1 % | OS.MolIC |  | 0 | 0 (<1%) | vorläufig |  |
| from1%To49% | 1–49 % | OS.MolIC |  | 1, 2, 3, 4 | ≥1 % … ≥25 % | vorläufig |  |
| overOrEqual50% | ≥ 50 % | OS.MolIC |  | 5, 6 | ≥50 %, ≥75 % | vorläufig |  |

**`pfIhcs/pfIhc/IHC/PDL1/icsGroup/icsScore`** – Immun-Cell-Score (IC)

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| lowerThan1% | < 1 % | OS.MolIC |  | 0 | 0 (<1%) | vorläufig |  |
| from1%To4% | 1–4 % | OS.MolIC |  | 1 | 1 (>= 1%) | vorläufig |  |
| from5%To9% | 5–9 % | OS.MolIC |  | 2 | 2 (>= 5%) | vorläufig |  |
| overOrEqual10% | ≥ 10 % | OS.MolIC |  | 3, 4, 5, 6 | ≥10 % … | vorläufig |  |

**`pfIhcs/pfIhc/IHC/ROS1/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |
| fraglich | fraglich | OS.MolGenErgebnis |  |  |  | ungelöst | kein Gegenstück |

**`pfIhcs/pfIhc/IHC/TTF1/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig |  |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

### Sonstige Untersuchungen (`otherExamination`)

13 Felder – 9 vorläufig, 4 ungelöst. Entscheidungen: E-9.

#### Vorläufig (4)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetik) |  |
| `findingList/finding/examinations/examination/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Sonstige-/PCR-Analyse) |  |
| `findingList/finding/examinations/examination/gene` | Gen | FreeText | B | OS.Molekulargenetische sonstige oder PCR Analyse (Unterformular von OS.Molekulargenetik) → Gen (OS.Molekulargenetik) | nNGM Freitext → Gen-Code (Übersetzung nötig) |
| `findingList/finding/examinations/examination/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische sonstige oder PCR Analyse (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P (könnte auch Fusion F oder Amplifikation CNV sein – nNGM unterscheidet nicht), negativ → N, nicht auswertbar → UX |

#### Ungelöst (4)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/reference/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `findingList/finding/examinations/examination/name` | Bezeichnung der Untersuchung | FreeText | C |  | Bezeichnung der Untersuchung: „Andere Methode(n)“ in OS.Molekulargenetik gilt nur je Einsendung, nicht je Untersuchung; Option E-8: Feld im Erweiterungskatalog des abgeleiteten Unterformulars |
| `findingList/finding/examinations/examination/assay` | Assay | FreeText | C |  | Assay (Freitext): Bemerkung oder eigenes Feld im Erweiterungskatalog? (E-9 Frage 3) |
| `findingList/finding/examinations/examination/resultDetail` | Beschreibung der Alteration | FreeText | C | OS.Molekulargenetische sonstige oder PCR Analyse (Unterformular von OS.Molekulargenetik) → Bemerkung | Beschreibung der Alteration: Bemerkung des Eintrags ist bei Neuerfassung ausgeblendet (nur sichtbar, wenn gefüllt); Option E-8: Feld im Erweiterungskatalog des abgeleiteten Unterformulars |

<details>
<summary>Strukturelemente (5: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList` | Befunde | List | Struktur |  | Liste → OS.Molekulargenetik je Befund |
| `findingList/finding` | Tumormaterial | ListEntry (mehrfach) | Struktur | OS.Molekulargenetik | Analysemethode = Andere (A); je Untersuchung ein Eintrag Sonstige-/PCR-Analyse |
| `findingList/finding/reference` | Referenzen | FieldGroup | Struktur |  |  |
| `findingList/finding/examinations` | Untersuchungen | List | Struktur |  |  |
| `findingList/finding/examinations/examination` | Untersuchung | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische sonstige oder PCR Analyse (Unterformular von OS.Molekulargenetik) |  |

</details>

#### Werteübersetzungen

**`findingList/finding/examinations/examination/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig | ggf. F oder CNV |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

### Nicht-standard nNGM Untersuchungen (`preliminaryOtherExaminations`)

13 Felder – 9 vorläufig, 4 ungelöst. Entscheidungen: E-9.

#### Vorläufig (4)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (OS.Molekulargenetik) |  |
| `findingList/finding/examinations/examination/id` | ID des Listeneintrags | EntryId | A | → prozedur.id (Sonstige-/PCR-Analyse) |  |
| `findingList/finding/examinations/examination/gene` | Gen | FreeText | B | OS.Molekulargenetische sonstige oder PCR Analyse (Unterformular von OS.Molekulargenetik) → Gen (OS.Molekulargenetik) | nNGM Freitext → Gen-Code (Übersetzung nötig) |
| `findingList/finding/examinations/examination/result` | Ergebnis | Enumeration | B | OS.Molekulargenetische sonstige oder PCR Analyse (Unterformular von OS.Molekulargenetik) → Ergebnis (OS.MolGenErgebnis) | positiv → P (könnte auch Fusion F oder Amplifikation CNV sein – nNGM unterscheidet nicht), negativ → N, nicht auswertbar → UX |

#### Ungelöst (4)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList/finding/reference/biopsyID` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `findingList/finding/examinations/examination/name` | Bezeichnung der Untersuchung | FreeText | C |  | Bezeichnung der Untersuchung: „Andere Methode(n)“ in OS.Molekulargenetik gilt nur je Einsendung, nicht je Untersuchung; Option E-8: Feld im Erweiterungskatalog des abgeleiteten Unterformulars |
| `findingList/finding/examinations/examination/assay` | Assay | FreeText | C |  | Assay (Freitext): Bemerkung oder eigenes Feld im Erweiterungskatalog? (E-9 Frage 3) |
| `findingList/finding/examinations/examination/resultDetail` | Beschreibung der Alteration | FreeText | C | OS.Molekulargenetische sonstige oder PCR Analyse (Unterformular von OS.Molekulargenetik) → Bemerkung | Beschreibung der Alteration: Bemerkung des Eintrags ist bei Neuerfassung ausgeblendet (nur sichtbar, wenn gefüllt); Option E-8: Feld im Erweiterungskatalog des abgeleiteten Unterformulars |

<details>
<summary>Strukturelemente (5: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `findingList` | Befunde | List | Struktur |  | Liste → OS.Molekulargenetik je Befund |
| `findingList/finding` | Tumormaterial | ListEntry (mehrfach) | Struktur | OS.Molekulargenetik | Analysemethode = Andere (A); je Untersuchung ein Eintrag Sonstige-/PCR-Analyse; [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |
| `findingList/finding/reference` | Referenzen | FieldGroup | Struktur |  |  |
| `findingList/finding/examinations` | Untersuchungen | List | Struktur |  |  |
| `findingList/finding/examinations/examination` | Untersuchung | ListEntry (mehrfach) | Struktur | OS.Molekulargenetische sonstige oder PCR Analyse (Unterformular von OS.Molekulargenetik) | [Rückfrage offen] Vorbefunde vs. Befunde – gleiche Frage wie histology/diagnosticHistology |

</details>

#### Werteübersetzungen

**`findingList/finding/examinations/examination/result`** – Ergebnis

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| positiv | positiv | OS.MolGenErgebnis |  | P | Einfache Variante (Mutation / positiv) | vorläufig | ggf. F oder CNV |
| negativ | negativ | OS.MolGenErgebnis |  | N | Wildtyp (WT) / negativ | vorläufig |  |
| nicht auswertbar | nicht auswertbar | OS.MolGenErgebnis |  | UX | untersucht, kein Ergebnis | vorläufig |  |

## nNGM-spezifische Bögen

<details>
<summary><b>E-10</b> – nNGM-spezifische Bögen ohne Onkostar-Gegenstück (09.11.2026)</summary>

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

</details>

### Eckdaten der Anforderung (`diagnosticsRequest`)

23 Felder – 20 vorläufig, 3 ungelöst. Entscheidungen: E-10.

#### Vorläufig (14)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `requirementDataGroup/firstDiagnosis` | Tumordiagnose | ListEntryReference | D | NNGM.Anforderung → firstDiagnosis (Formularverweis auf OS.Diagnose) | Formularverweis speichert die prozedur.id des OS.Diagnose-Eintrags; gebaut und getestet 10.11.2026 |
| `requirementDataGroup/requirementDate` | Anforderungsdatum | MedicalDate | C | NNGM.Anforderung → requirementDate | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10) |
| `requirementDataGroup/requirementPatientStay` | Patient war / ist zum Zeitpunkt dieser Anforderung | Enumeration | C | NNGM.Anforderung → requirementPatientStay | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10) |
| `requirementDataGroup/additionalPerformerList/additionalPerformerListEntry/id` | ID des Listeneintrags | EntryId | A | NNGM.Anforderung.Behandler → prozedur.id | eigenes nNGM-Formular, gebaut und getestet 10.11.2026 (E-10) |
| `diagnosticGroup/requestType` | Typ | Enumeration | C | NNGM.Anforderung → requestType | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10) |
| `diagnosticRequirementGroup/requestedDiagnostics` | Gewünschte Diagnostik | Enumeration | C | NNGM.Anforderung → requestedDiagnostics | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10) |
| `diagnosticRequirementGroup/histologicalClarification` | Histologische Abklärung | MultipleChoice (mehrfach) | C | NNGM.Anforderung → histologicalClarification | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10) |
| `diagnosticRequirementGroup/immunohistochemistry` | Immunhistochemie | MultipleChoice (mehrfach) | C | NNGM.Anforderung → immunohistochemistry | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10) |
| `diagnosticRequirementGroup/ngsPanel` | NGS Panel | Enumeration | C | NNGM.Anforderung → ngsPanel (OS.JaNein) | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10); Katalog OS.JaNein statt NNGM.yesNo (Übersetzung beim Export, E-0 11.11.2026) |
| `diagnosticRequirementGroup/fastTrack` | Fast Track | MultipleChoice (mehrfach) | C | NNGM.Anforderung → fastTrack | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10) |
| `diagnosticRequirementGroup/liquidBiopsy` | Liquid Biopsy | MultipleChoice (mehrfach) | C | NNGM.Anforderung → liquidBiopsy | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10) |
| `diagnosticRequirementGroup/reasonMissingBiopsy` | Grund für fehlende Biopsie | Enumeration | C | NNGM.Anforderung → reasonMissingBiopsy | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10); sichtbar nur, wenn bei Liquid Biopsy keine Option gewählt ist |
| `tumorBoardRequirementGroup/tumorBoardParticipation` | Ich möchte am Tumorboard persönlich oder per Telefonkonferenz teilnehmen | Enumeration | C | NNGM.Anforderung → tumorBoardParticipation (OS.JaNein) | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10); Katalog OS.JaNein statt NNGM.yesNo (Übersetzung beim Export, E-0 11.11.2026) |
| `tumorBoardRequirementGroup/eMailAddressPhoneNumber` | Email-Adresse und/oder Telefonnummer | FreeText | C | NNGM.Anforderung → eMailAddressPhoneNumber | eigenes nNGM-Formular NNGM.Anforderung mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10); sichtbar nur bei Tumorboard-Teilnahme = Ja |

#### Ungelöst (3)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `requirementDataGroup/requester` | Anforderndes Netzwerkzentrum oder Netzwerkpartner | NngmNetworkPartner | D | NNGM.Anforderung → requester | im Formular NNGM.Anforderung vorläufig als Freitext; Abbildung der nNGM-Netzwerkpartner/-standorte offen (allgemeine Frage) |
| `requirementDataGroup/performer` | Durchführendes Netzwerkzentrum | NngmNetworkLocation | D | NNGM.Anforderung → performer | im Formular NNGM.Anforderung vorläufig als Freitext; Abbildung der nNGM-Netzwerkpartner/-standorte offen (allgemeine Frage) |
| `requirementDataGroup/additionalPerformerList/additionalPerformerListEntry/additionalPerformer` | Zusätzlicher Behandler | NngmNetworkPartner | D | NNGM.Anforderung.Behandler → additionalPerformer | im Formular NNGM.Anforderung.Behandler vorläufig als Freitext; Abbildung der nNGM-Netzwerkpartner/-standorte offen (allgemeine Frage) |

<details>
<summary>Strukturelemente (6: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `requirementDataGroup` | Eckdaten der Anforderung | FieldGroup | Struktur | NNGM.Anforderung | Abschnitt/Feldgruppe bzw. Unterformular im eigenen nNGM-Formular (E-10) |
| `requirementDataGroup/additionalPerformerList` | Zusätzlichen Behandler anlegen | List | Struktur | NNGM.Anforderung | Abschnitt/Feldgruppe bzw. Unterformular im eigenen nNGM-Formular (E-10) |
| `requirementDataGroup/additionalPerformerList/additionalPerformerListEntry` | Zusätzlicher Behandler | ListEntry (mehrfach) | Struktur | NNGM.Anforderung.Behandler | Abschnitt/Feldgruppe bzw. Unterformular im eigenen nNGM-Formular (E-10) |
| `diagnosticGroup` | Diagnostik | FieldGroup | Struktur | NNGM.Anforderung | Abschnitt/Feldgruppe bzw. Unterformular im eigenen nNGM-Formular (E-10) |
| `diagnosticRequirementGroup` | Diagnostikanforderungen | FieldGroup | Struktur | NNGM.Anforderung | Abschnitt/Feldgruppe bzw. Unterformular im eigenen nNGM-Formular (E-10) |
| `tumorBoardRequirementGroup` | Anforderung Molekulares Tumorboard | FieldGroup | Struktur | NNGM.Anforderung | Abschnitt/Feldgruppe bzw. Unterformular im eigenen nNGM-Formular (E-10) |

</details>

#### Werteübersetzungen

**`diagnosticRequirementGroup/ngsPanel`** – NGS Panel

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNein |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNein |  | 0 | Nein | bestätigt | Export-Übersetzung |

**`tumorBoardRequirementGroup/tumorBoardParticipation`** – Ich möchte am Tumorboard persönlich oder per Telefonkonferenz teilnehmen

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNein |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNein |  | 0 | Nein | bestätigt | Export-Übersetzung |

### MURIPEDIA Therapie Information (`assessment`)

11 Felder – 11 vorläufig. Entscheidungen: E-10.

#### Vorläufig (7)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `assessmentDetail/archiveCodeList/archiveCode/id` | ID des Listeneintrags | EntryId | A | NNGM.MURIPEDIA-Archivierungscode → prozedur.id | eigenes nNGM-Formular, gebaut und getestet 10.11.2026 (E-10) |
| `assessmentDetail/archiveCodeList/archiveCode/creationDate` | Erstelldatum | MedicalDate | C | NNGM.MURIPEDIA-Archivierungscode → creationDate | eigenes nNGM-Formular NNGM.MURIPEDIA-Archivierungscode mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10) |
| `assessmentDetail/archiveCodeList/archiveCode/nngmArchiveCode` | Archivierungscode (MURIPEDIA) für nNGM-Datenbank | FreeText | C | NNGM.MURIPEDIA-Archivierungscode → nngmArchiveCode | eigenes nNGM-Formular NNGM.MURIPEDIA-Archivierungscode mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10) |
| `assessmentDetail/recommendationDetail/approvedTargetedTherapy` | Zugelassene zielgerichtete Therapie | Enumeration | C | NNGM.Therapieinformation → approvedTargetedTherapy (OS.JaNein) | eigenes nNGM-Formular NNGM.Therapieinformation mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10); Katalog OS.JaNein statt NNGM.yesNo (Übersetzung beim Export, E-0 11.11.2026) |
| `assessmentDetail/recommendationDetail/clinicalStudy` | Klinische Studie | Enumeration | C | NNGM.Therapieinformation → clinicalStudy (OS.JaNein) | eigenes nNGM-Formular NNGM.Therapieinformation mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10); Katalog OS.JaNein statt NNGM.yesNo (Übersetzung beim Export, E-0 11.11.2026) |
| `assessmentDetail/recommendationDetail/offLabelTherapy` | Off-Label-Therapie | Enumeration | C | NNGM.Therapieinformation → offLabelTherapy (OS.JaNein) | eigenes nNGM-Formular NNGM.Therapieinformation mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10); Katalog OS.JaNein statt NNGM.yesNo (Übersetzung beim Export, E-0 11.11.2026) |
| `assessmentDetail/recommendationDetail/mtbPresentation` | Vorstellung bei molekularem Tumorboard | Enumeration | C | NNGM.Therapieinformation → mtbPresentation (OS.JaNein) | eigenes nNGM-Formular NNGM.Therapieinformation mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10); evtl. aus OS.Tumorkonferenz ableitbar – prüfen; Katalog OS.JaNein statt NNGM.yesNo (Übersetzung beim Export, E-0 11.11.2026) |

<details>
<summary>Strukturelemente (4: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `assessmentDetail` | Klinische Information | FieldGroup | Struktur | NNGM.Therapieinformation | Abschnitt/Feldgruppe bzw. Unterformular im eigenen nNGM-Formular (E-10) |
| `assessmentDetail/archiveCodeList` | Archivierungscodes (MURIPEDIA) | List | Struktur | NNGM.Therapieinformation | Abschnitt/Feldgruppe bzw. Unterformular im eigenen nNGM-Formular (E-10) |
| `assessmentDetail/archiveCodeList/archiveCode` | Archivierungscode (MURIPEDIA) | ListEntry (mehrfach) | Struktur | NNGM.MURIPEDIA-Archivierungscode | Abschnitt/Feldgruppe bzw. Unterformular im eigenen nNGM-Formular (E-10) |
| `assessmentDetail/recommendationDetail` | Klinische Information für: | FieldGroup | Struktur | NNGM.Therapieinformation | Abschnitt/Feldgruppe bzw. Unterformular im eigenen nNGM-Formular (E-10) |

</details>

#### Werteübersetzungen

**`assessmentDetail/recommendationDetail/approvedTargetedTherapy`** – Zugelassene zielgerichtete Therapie

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNein |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNein |  | 0 | Nein | bestätigt | Export-Übersetzung |

**`assessmentDetail/recommendationDetail/clinicalStudy`** – Klinische Studie

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNein |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNein |  | 0 | Nein | bestätigt | Export-Übersetzung |

**`assessmentDetail/recommendationDetail/offLabelTherapy`** – Off-Label-Therapie

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNein |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNein |  | 0 | Nein | bestätigt | Export-Übersetzung |

**`assessmentDetail/recommendationDetail/mtbPresentation`** – Vorstellung bei molekularem Tumorboard

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNein |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNein |  | 0 | Nein | bestätigt | Export-Übersetzung |

### Therapieinformation (`TherapyInformation`)

4 Felder – 4 vorläufig. Entscheidungen: E-10.

#### Vorläufig (4)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `information` | Therapieinformation | FreeText | C | NNGM.Therapieinformation → information | eigenes nNGM-Formular NNGM.Therapieinformation mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10) |
| `wasHelpful` | Therapieinformation war hilfreich | Enumeration | C | NNGM.Therapieinformation → wasHelpful (OS.JaNeinUnbekannt) | eigenes nNGM-Formular NNGM.Therapieinformation mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10); Katalog OS.JaNeinUnbekannt statt NNGM.yesNoUnknown (Übersetzung beim Export, E-0 11.11.2026) |
| `wasImplemented` | Therapieinformation wurde umgesetzt | Enumeration | C | NNGM.Therapieinformation → wasImplemented (OS.JaNeinUnbekannt) | eigenes nNGM-Formular NNGM.Therapieinformation mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10); Katalog OS.JaNeinUnbekannt statt NNGM.yesNoUnknown (Übersetzung beim Export, E-0 11.11.2026) |
| `reasonForNonexecution` | Grund für die Nichtumsetzung | Enumeration | C | NNGM.Therapieinformation → reasonForNonexecution | eigenes nNGM-Formular NNGM.Therapieinformation mit nNGM-Codes, gebaut und getestet 10.11.2026 (E-10); sichtbar nur bei umgesetzt = Nein |

#### Werteübersetzungen

**`wasHelpful`** – Therapieinformation war hilfreich

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNeinUnbekannt |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNeinUnbekannt |  | 0 | Nein | bestätigt | Export-Übersetzung |
| unknown | Unbekannt | OS.JaNeinUnbekannt |  | 9 | Unbekannt | bestätigt | Export-Übersetzung |

**`wasImplemented`** – Therapieinformation wurde umgesetzt

| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |
|---|---|---|---|---|---|---|---|
| yes | Ja | OS.JaNeinUnbekannt |  | 1 | Ja | bestätigt | Export-Übersetzung |
| no | Nein | OS.JaNeinUnbekannt |  | 0 | Nein | bestätigt | Export-Übersetzung |
| unknown | Unbekannt | OS.JaNeinUnbekannt |  | 9 | Unbekannt | bestätigt | Export-Übersetzung |

### Patientenportal (`nngmPortal`)

1 Felder – 1 ungelöst. Entscheidungen: E-10.

#### Ungelöst (1)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `wishedNngmPortal` | Ist die Nutzung des Patientenportals durch den Patienten (weiterhin) gewünscht? | Enumeration | C |  | nNGM-spezifisch, kein Gegenstück in Onkostar; Kandidat Feld in einem nNGM-Fall- bzw. Patientenformular ohne OS-Basis (E-8) |

### IMPALUX (`impalux`)

62 Felder – 62 ungelöst. Entscheidungen: E-10.

#### Ungelöst (50)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `cohort` | Kohorte | Enumeration | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog); OS.Studie kennt keine Kohorte, Katalog OS.Studien in der Instanz leer |
| `diagnosticsList/diagnosticsListEntry/id` | ID des Listeneintrags | EntryId | A | → prozedur.id | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder |
| `diagnosticsList/diagnosticsListEntry/tumorMaterial` | Tumormaterial | ListEntryReference |  |  | Verweis auf tumorMaterial/specimen – Umsetzung offen (E-3: Unterformular von OS.Molekulargenetik / Abgleich über Eingangsnummer / eigenes Formular); Option E-8: Verweis auf das Material im abgeleiteten Befundformular (E-3 Weg B/C) |
| `diagnosticsList/diagnosticsListEntry/samplingLocation` | Ort der Probenentnahme | Terminology | B | OS.Molekulargenetik (Option B) → ICDO3Lokalisation (ICD-O-3 Lokalisation) | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder: ICD-O-3 Lokalisation, sichtbar nur bei Probe aus LK/Metastase/Normalgewebe |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexDate` | Datum | MedicalDate | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexMaterialAvailability` | Materialverfügbarkeit | Enumeration | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexRemarks` | Bemerkungen | FreeText | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexReasonNoDiagnostics` | Grund für nicht ausgelöste Diagnostik | Enumeration | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexOtherReasonNoDiagnostics` | Bitte spezifizieren Sie "Sonstige". | FreeText | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/her2Group/her2StainingPattern` | Färbemuster | MultipleChoice (mehrfach) | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/her2Group/her2PositiveCellRatio` | Anteil positiver Zellen | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/her2Group/her2PredominantIntensity` | Vorherrschende Intensität | Enumeration | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/her2Group/her2ImmunoReactiveScore` | Immunoreaktiver Score für HER2 | Enumeration | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/cmetGroup/cmetStainingPattern` | Färbemuster | MultipleChoice (mehrfach) | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/cmetGroup/cmetHScore` | H-Score | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/cmetGroup/cmetNoExpression` | Prozentualer Anteil ohne Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/cmetGroup/cmetWeakExpression` | Prozentualer Anteil mit schwacher Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/cmetGroup/cmetModerateExpression` | Prozentualer Anteil mit mäßiger Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/cmetGroup/cmetStrongExpression` | Prozentualer Anteil mit starker Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/prameGroup/prameStainingPattern` | Färbemuster | MultipleChoice (mehrfach) | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/prameGroup/prameHScore` | H-Score | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/prameGroup/prameNoExpression` | Prozentualer Anteil ohne Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/prameGroup/prameWeakExpression` | Prozentualer Anteil mit schwacher Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/prameGroup/prameModerateExpression` | Prozentualer Anteil mit mäßiger Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/prameGroup/prameStrongExpression` | Prozentualer Anteil mit starker Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/dll3Group/dll3StainingPattern` | Färbemuster | MultipleChoice (mehrfach) | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/dll3Group/dll3HScore` | H-Score | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/dll3Group/dll3NoExpression` | Prozentualer Anteil ohne Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/dll3Group/dll3WeakExpression` | Prozentualer Anteil mit schwacher Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/dll3Group/dll3ModerateExpression` | Prozentualer Anteil mit mäßiger Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/dll3Group/dll3StrongExpression` | Prozentualer Anteil mit starker Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/trop2Group/trop2StainingPattern` | Färbemuster | MultipleChoice (mehrfach) | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/trop2Group/trop2HScore` | H-Score | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/trop2Group/trop2NoExpression` | Prozentualer Anteil ohne Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/trop2Group/trop2WeakExpression` | Prozentualer Anteil mit schwacher Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/trop2Group/trop2ModerateExpression` | Prozentualer Anteil mit mäßiger Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/trop2Group/trop2StrongExpression` | Prozentualer Anteil mit starker Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/mageA4Group/mageA4StainingPattern` | Färbemuster | MultipleChoice (mehrfach) | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/mageA4Group/mageA4HScore` | H-Score | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/mageA4Group/mageA4NoExpression` | Prozentualer Anteil ohne Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/mageA4Group/mageA4WeakExpression` | Prozentualer Anteil mit schwacher Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/mageA4Group/mageA4ModerateExpression` | Prozentualer Anteil mit mäßiger Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/mageA4Group/mageA4StrongExpression` | Prozentualer Anteil mit starker Expression | Integer | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/rnaSeqGroup/rnaSeqDate` | Datum | MedicalDate | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/rnaSeqGroup/rnaSeqMaterialAvailability` | Materialverfügbarkeit | Enumeration | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/rnaSeqGroup/rnaSeqRemarks` | Bemerkungen | FreeText | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/rnaSeqGroup/rnaSeqReasonNoDiagnostics` | Grund für nicht ausgelöste Diagnostik | Enumeration | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/rnaSeqGroup/rnaSeqOtherReasonNoDiagnostics` | Bitte spezifizieren Sie "Sonstige". | FreeText | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/hlaDiagnosticsGroup/hlaDate` | Datum | MedicalDate | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |
| `diagnosticsList/diagnosticsListEntry/hlaDiagnosticsGroup/hlaFindings` | Befund | FreeText | C |  | Studiendaten ohne Gegenstück in Onkostar; Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder (dieses Feld bei B im Erweiterungskatalog) |

<details>
<summary>Strukturelemente (12: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `diagnosticsList` | IMPALUX Diagnostik | List | Struktur |  | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder |
| `diagnosticsList/diagnosticsListEntry` | IMPALUX Diagnostik | ListEntry (mehrfach) | Struktur |  | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup` | multiplexGroup | FieldGroup | Struktur |  | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup` | multiplexPanelGroup | FieldGroup | Struktur |  | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/her2Group` | her2Group | FieldGroup | Struktur | OS.Molekulargenetische Immunhistochemie (Option B) → Gen (Protein) = ERBB2 (OS.Molekulargenetik) | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder: Marker als IHC-Eintrag (Protein ERBB2), Messwerte im Erweiterungskatalog (E-8) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/cmetGroup` | cmetGroup | FieldGroup | Struktur | OS.Molekulargenetische Immunhistochemie (Option B) → Gen (Protein) = MET (OS.Molekulargenetik) | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder: Marker als IHC-Eintrag (Protein MET), Messwerte im Erweiterungskatalog (E-8) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/prameGroup` | prameGroup | FieldGroup | Struktur | OS.Molekulargenetische Immunhistochemie (Option B) → Gen (Protein) = PRAME (OS.Molekulargenetik) | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder: Marker als IHC-Eintrag (Protein PRAME), Messwerte im Erweiterungskatalog (E-8) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/dll3Group` | dll3Group | FieldGroup | Struktur | OS.Molekulargenetische Immunhistochemie (Option B) → Gen (Protein) = DLL3 (OS.Molekulargenetik) | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder: Marker als IHC-Eintrag (Protein DLL3), Messwerte im Erweiterungskatalog (E-8) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/trop2Group` | trop2Group | FieldGroup | Struktur | OS.Molekulargenetische Immunhistochemie (Option B) → Gen (Protein) = TACSTD2 (OS.Molekulargenetik) | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder: Marker als IHC-Eintrag (Protein TACSTD2), Messwerte im Erweiterungskatalog (E-8) |
| `diagnosticsList/diagnosticsListEntry/multiplexGroup/multiplexPanelGroup/mageA4Group` | mageA4Group | FieldGroup | Struktur | OS.Molekulargenetische Immunhistochemie (Option B) → Gen (Protein) = MAGEA4 (OS.Molekulargenetik) | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder: Marker als IHC-Eintrag (Protein MAGEA4), Messwerte im Erweiterungskatalog (E-8) |
| `diagnosticsList/diagnosticsListEntry/rnaSeqGroup` | rnaSeqGroup | FieldGroup | Struktur |  | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder |
| `diagnosticsList/diagnosticsListEntry/hlaDiagnosticsGroup` | hlaDiagnosticsGroup | FieldGroup | Struktur |  | Lösung offen (E-10): A) ganzer Bogen als eigenes Studienformular NNGM.IMPALUX; B) Teilzuordnung auf OS-Felder |

</details>

### Zustimmungen nNGM (`consents`)

167 Felder – 167 ungelöst. Entscheidungen: E-10.

#### Ungelöst (130)

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `participationDeclarationList/participationDeclaration/id` | ID des Listeneintrags | EntryId | A | → prozedur.id | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `participationDeclarationList/participationDeclaration/participationDeclarationChangeReason` | Grund der Änderung | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `participationDeclarationList/participationDeclaration/participationDeclarationWithdrawalDate` | Datum des Widerrufs | Date | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `participationDeclarationList/participationDeclaration/participationDeclarationSigned` | Der Patient hat alle vorgesehenen Unterschriften hinterlegt. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `participationDeclarationList/participationDeclaration/participationDeclarationSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `treatmentContractList/treatmentContract/id` | ID des Listeneintrags | EntryId | A | → prozedur.id | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `treatmentContractList/treatmentContract/treatmentContractChangeReason` | Grund der Änderung | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `treatmentContractList/treatmentContract/treatmentContractWithdrawalDate` | Datum des Widerrufs | Date | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `treatmentContractList/treatmentContract/treatmentContractSigned` | Der Patient hat einen Behandlungsvertrag unterschrieben. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `treatmentContractList/treatmentContract/treatmentContractSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/id` | ID des Listeneintrags | EntryId | A | → prozedur.id | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2ChangeReason` | Grund der Änderung | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2WithdrawalDate` | Datum des Widerrufs | Date | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2PolicyRule1aGroup/consent2_2PolicyRule1aSigned` | Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2PolicyRule1aGroup/consent2_2PolicyRule1aDateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2PolicyRule1bGroup/consent2_2PolicyRule1bSigned` | Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2PolicyRule1bGroup/consent2_2PolicyRule1bDateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2PolicyRule2Group/consent2_2PolicyRule2Signed` | Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2PolicyRule2Group/consent2_2PolicyRule2DateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWPISigned` | Weitergabe pseudonymisierter krankheitsbezogener Daten (MDAT) innerhalb des nNGM und an kooperierende Partner - Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWPIDateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWPSigned` | Weitergabe von MDAT und Resttumorproben innerhalb des nNGM und an kooperierende Partner - Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWPDateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWDSigned` | Weitergabe pseudonymisierter krankheitsbezogener Daten (MDAT) in ein Drittland - Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWDDateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWRSigned` | Weitergabe von MDAT und Resttumorproben in ein Drittland - Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWRDateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWPKSigned` | Weitergabe pseudonymisierter krankheitsbezogener Daten (MDAT) zur kommerziellen Nutzung - Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWPKDateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWKSigned` | Weitergabe von MDAT und Resttumorproben zur kommerziellen Nutzung - Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleWKDateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleKWSigned` | Kontaktaufnahme des nNGM-Zentrums zu einem späteren Zeitpunkt zur Gewinnung weiterer Informationen über den Behandlungsverlauf - Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleKWDateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleKESigned` | Kontaktaufnahme des nNGM-Zentrums zum Zweck des Einschlusses in eine mögliche infrage kommende neue Studie - Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleKEDateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleRandomSigned` | Rückmeldung wichtiger gesundheitsrelevanter Ergebnisse (Zufallsfunde) - Unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup/consent2_2PolicyRuleRandomDateTime` | Datum der Patientenunterschrift | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/id` | ID des Listeneintrags | EntryId | A | → prozedur.id | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0ChangeReason` | Grund der Änderung | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0WithdrawalDate` | Datum des Widerrufs | Date | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule1Group/consent4_0PolicyRule1Consented` | Pflichtangabe für Teil 1 der Einwilligungserklärung: Ist der Patient mit den Inhalten gemäß den Ziffern 1 - 7 einverstanden? | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule1Group/consent4_0PolicyRule1Signed` | Patient / gesetzlicher Vertreter (Vorsorgebevollmächtigter) hat unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule1Group/consent4_0PolicyRule1SignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2ProcessingGroup/consent4_0PolicyRule2ProcessingConsented` | 1.1 - 1.3 Der Patient willigt in die Erhebung, Verarbeitung, Speicherung und wissenschaftliche Nutzung seiner Patientendaten wie in Punkt 1.1 bis 1.3 der Einwilligungserklärung und im Teil 1 der Patienteninformation beschrieben, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2ProcessingGroup/consent4_0PolicyRule2ProcessingSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2HealthInsuranceGroup/consent4_0PolicyRule2RetrospectiveHealthInsuranceConsented` | 2.1 Der Patient willigt rückwirkend für die Daten der vergangenen 10 Kalenderjahre, sowie in die Übermittlung seiner Versicherungsnummer an die nNGM-Geschäftsstelle bzw. eine beauftragte Treuhandstelle, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2HealthInsuranceGroup/consent4_0PolicyRule2RetrospectiveHealthInsuranceSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2HealthInsuranceGroup/consent4_0PolicyRule2HealthInsuranceConsented` | 2.2 Der Patient willigt ab dem Datum seiner Unterschrift für die Daten über einen Zeitraum von 10 Kalenderjahren, sowie in die Übermittlung seiner Versicherungsnummer an die nNGM-Geschäftsstelle bzw. eine beauftragte Treuhandstelle, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2HealthInsuranceGroup/consent4_0PolicyRule2HealthInsuranceSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2BioMaterialsGroup/consent4_0PolicyRule2BiomaterialsConsented` | 3.1 – 3.2 Der Patient willigt in die Gewinnung, Lagerung und wissenschaftliche Nutzung seiner Biomaterialien (Gewebe und Blut), wie in Punkt 3.1 bis 3.2 der Einwilligungserklärung und im Teil 2 der Patienteninformation beschrieben, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2BioMaterialsGroup/consent4_0PolicyRule2BiomaterialsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2BioMaterialsGroup/consent4_0PolicyRule2BiomaterialsMdatConsented` | Der Patient stimmt der Weitergabe seiner krankheitsbezogenen Daten (MDAT) und, bei Einwilligung zu Punkt 2 der Patienteninformation, Biomaterialien für Forschungszwecke in ein Drittland zu. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2BioMaterialsGroup/consent4_0PolicyRule2BiomaterialsMdatSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2BioMaterialsGroup/consent4_0PolicyRule2BiomaterialsCommercialMdatConsented` | Der Patient stimmt der kommerziellen Nutzung seiner krankheitsbezogenen Daten (MDAT) und, bei Einwilligung zu Punkt 2 der Patienteninformation, Biomaterialien für Forschungszwecke zu. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2BioMaterialsGroup/consent4_0PolicyRule2BiomaterialsCommercialMdatSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2ContactGroup/consent4_0PolicyRule2ContactConsented` | 4.1 Der Patient willigt ein, dass er von der behandelnden Einrichtung erneut kontaktiert werden darf, um gegebenenfalls zusätzliche für wissenschaftliche Fragen relevante Informationen [falls zutreffend: oder Biomaterialien] zur Verfügung zu stellen, um über neue Forschungsvorhaben/Studien informiert zu werden, und/oder um seine Einwilligung in die Verknüpfung seiner Patientendaten mit medizinischen Informationen aus anderen Datenbanken einzuholen (siehe Punkt 4.1 im Teil 2 der Patienteninformation). | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2ContactGroup/consent4_0PolicyRule2ContactSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2ContactGroup/consent4_0PolicyRule2ContactAdditionalFindingsConsented` | 4.2 Der Patient willigt ein, dass er von der behandelnden Einrichtung wieder kontaktiert werden darf, um über medizinische Zusatzbefunde informiert zu werden (siehe Punkt 4.2 im Teil 2 der Patienteninformation). | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2ContactGroup/consent4_0PolicyRule2ContactAdditionalFindingsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2RequiredGroup/consent4_0PolicyRule2RequiredConsented` | Ist der Patient mit den Inhalten gemäß den Ziffern 1 - 6 einverstanden? | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2RequiredGroup/consent4_0PolicyRule2RequiredSigned` | Patient / gesetzlicher Vertreter (Vorsorgebevollmächtigter) hat unterschrieben | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2RequiredGroup/consent4_0PolicyRule2RequiredSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/id` | ID des Listeneintrags | EntryId | A | → prozedur.id | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1ChangeReason` | Grund der Änderung | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1WithdrawalDate` | Datum des Widerrufs | Date | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2ProcessingGroup/consent4_1PolicyRule2ProcessingConsented` | 1.1 - 1.3 Der Patient willigt in die Erhebung, Verarbeitung, Speicherung und wissenschaftliche Nutzung seiner Patientendaten wie in Punkt 1.1 bis 1.3 dieser Einwilligungserklärung und in der Patienteninformation beschrieben, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2ProcessingGroup/consent4_1PolicyRule2ProcessingSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2HealthInsuranceGroup/consent4_1PolicyRule2RetrospectiveHealthInsuranceConsented` | 2.1 Der Patient willigt rückwirkend für die Daten der vergangenen 10 Kalenderjahre, sowie in die Übermittlung seiner Versicherungsnummer an die nNGM-Geschäftsstelle bzw. eine beauftragte Treuhandstelle, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2HealthInsuranceGroup/consent4_1PolicyRule2RetrospectiveHealthInsuranceSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2HealthInsuranceGroup/consent4_1PolicyRule2HealthInsuranceConsented` | 2.2 Der Patient willigt ab dem Datum seiner Unterschrift für die Daten über einen Zeitraum von 10 Kalenderjahren, sowie in die Übermittlung seiner Versicherungsnummer an die nNGM-Geschäftsstelle bzw. eine beauftragte Treuhandstelle, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2HealthInsuranceGroup/consent4_1PolicyRule2HealthInsuranceSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2BioMaterialsGroup/consent4_1PolicyRule2BiomaterialsConsented` | 3.1 – 3.2 Der Patient willigt in die Gewinnung, Lagerung und wissenschaftliche Nutzung seiner Biomaterialien (Gewebe und Blut), wie in Punkt 3.1 bis 3.2 der Einwilligungserklärung und im Teil 2 der Patienteninformation beschrieben, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2BioMaterialsGroup/consent4_1PolicyRule2BiomaterialsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2BioMaterialsGroup/consent4_1PolicyRule2BiomaterialsMdatConsented` | Der Patient stimmt der Weitergabe seiner krankheitsbezogenen Daten (MDAT) und, bei Einwilligung zu Punkt 3 der Patienteninformation, Biomaterialien für Forschungszwecke in ein Drittland zu. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2BioMaterialsGroup/consent4_1PolicyRule2BiomaterialsMdatSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2BioMaterialsGroup/consent4_1PolicyRule2BiomaterialsCommercialMdatConsented` | Der Patient stimmt der kommerziellen Nutzung seiner krankheitsbezogenen Daten (MDAT) und, bei Einwilligung zu Punkt 3 der Patienteninformation, Biomaterialien für Forschungszwecke zu. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2BioMaterialsGroup/consent4_1PolicyRule2BiomaterialsCommercialMdatSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2ContactGroup/consent4_1PolicyRule2ContactConsented` | 4.1 Der Patient willigt ein, dass er von der behandelnden Einrichtung erneut kontaktiert werden darf, um gegebenenfalls zusätzliche für wissenschaftliche Fragen relevante Informationen [falls zutreffend: oder Biomaterialien] zur Verfügung zu stellen, um über neue Forschungsvorhaben/Studien informiert zu werden, und/oder um seine Einwilligung in die Verknüpfung seiner Patientendaten mit medizinischen Informationen aus anderen Datenbanken einzuholen (siehe Punkt 4.1 der Patienteninformation). | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2ContactGroup/consent4_1PolicyRule2ContactSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2ContactGroup/consent4_1PolicyRule2ContactAdditionalFindingsConsented` | 4.2 Der Patient willigt ein, dass er von der behandelnden Einrichtung wieder kontaktiert werden darf, um über medizinische Zusatzbefunde informiert zu werden (siehe Punkt 4.2 der Patienteninformation). | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2ContactGroup/consent4_1PolicyRule2ContactAdditionalFindingsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent1_6d/id` | ID des Listeneintrags | EntryId | A | → prozedur.id | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2ProcessingGroup/consent1_6dPolicyRule2ProcessingConsented` | 1.1 - 1.3 Der Patient willigt in die Erhebung, Verarbeitung, Speicherung und wissenschaftliche Nutzung seiner Patientendaten wie in Punkt 1.1 bis 1.3 der Einwilligungserklärung und Punkt 1 der Patienteninformation beschrieben, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2ProcessingGroup/consent1_6dPolicyRule2ProcessingSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2HealthInsuranceGroup/consent1_6dPolicyRule2RetrospectiveHealthInsuranceConsented` | 2.1 Der Patient willigt rückwirkend für die Daten der vergangenen 5 Kalenderjahre, sowie in die Übermittlung seiner Krankenversicherungs-Nummer an die zuständige Stelle, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2HealthInsuranceGroup/consent1_6dPolicyRule2RetrospectiveHealthInsuranceSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2HealthInsuranceGroup/consent1_6dPolicyRule2HealthInsuranceConsented` | 2.2 Der Patient willigt ab dem Datum seiner Unterschrift für die Daten über einen Zeitraum von 5 Jahren, sowie in die Übermittlung seiner Krankenversicherungs-Nummer an die zuständige Stelle, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2HealthInsuranceGroup/consent1_6dPolicyRule2HealthInsuranceSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2BioMaterialsGroup/consent1_6dPolicyRule2BiomaterialsConsented` | 3.1 - 3.3 Der Patient willigt in die Gewinnung, Lagerung und wissenschaftliche Nutzung seiner Biomaterialien (Gewebe und Körperflüssigkeiten), wie in Punkt 3.1 bis 3.3 der Einwilligungserklärung und Punkt 3 der Patienteninformation beschrieben, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2BioMaterialsGroup/consent1_6dPolicyRule2BiomaterialsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2BioMaterialsGroup/consent1_6dPolicyRule2AdditionalBiomaterialsConsented` | Falls zutreffend: Der Patient willigt der Entnahme geringer zusätzlicher Mengen von Biomaterial bei einer sowieso stattfindenden Routine-Blutentnahme oder -Punktion in den unter Punkt 3.2 der Patienteninformation beschriebenen Grenzen ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2BioMaterialsGroup/consent1_6dPolicyRule2AdditionalBiomaterialsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2ContactGroup/consent1_6dPolicyRule2ContactConsented` | 4.1 Der Patient willigt ein, dass er von der behandelnden Einrichtung erneut kontaktiert werden darf, um gegebenenfalls zusätzliche für wissenschaftliche Fragen relevante Informationen [falls zutreffend: oder Biomaterialien] zur Verfügung zu stellen, um über neue Forschungsvorhaben/Studien informiert zu werden, und/oder um seine Einwilligung in die Verknüpfung seiner Patientendaten mit medizinischen Informationen aus anderen Datenbanken einzuholen (siehe Punkt 4.1 der Patienteninformation). | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2ContactGroup/consent1_6dPolicyRule2ContactSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2ContactGroup/consent1_6dPolicyRule2ContactAdditionalFindingsConsented` | 4.2 Der Patient willigt ein, dass er von der behandelnden Einrichtung wieder kontaktiert werden darf, um über medizinische Zusatzbefunde informiert zu werden (siehe Punkt 4.2 der Patienteninformation). | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2ContactGroup/consent1_6dPolicyRule2ContactAdditionalFindingsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dWithdrawn` | Wurde die Einwilligung widerrufen? | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dWithdrawalDate` | Datum des Widerrufs | Date | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/id` | ID des Listeneintrags | EntryId | A | → prozedur.id | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ProcessingGroup/consent1_7_2PolicyRule2ProcessingConsented` | 1.1 - 1.3 Der Patient willigt in die Erhebung, Verarbeitung, Speicherung und wissenschaftliche Nutzung seiner Patientendaten wie in Punkt 1.1 bis 1.3 der Einwilligungserklärung und Punkt 1 der Patienteninformation beschrieben, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ProcessingGroup/consent1_7_2PolicyRule2ProcessingSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ProcessingGroup/consent1_7_2PolicyRule2RetrospectiveProcessingConsented` | Falls zutreffend: Der Patient willigt in die Verarbeitung und wissenschaftliche Nutzung seiner Patientendaten, die im Rahmen früherer Behandlungen erhoben wurden, wie in Punkt 1.1 bis 1.3 der Einwilligungserklärung und Punkt 1 der Patienteninformation beschrieben, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ProcessingGroup/consent1_7_2PolicyRule2RetrospectiveProcessingSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ProcessingGroup/consent1_7_2PolicyRule2ThirdCountryProcessingConsented` | Falls zutreffend: Der Patient stimmt der Übermittlung seiner Patientendaten in Länder, bei denen von der Europäischen Kommission kein angemessenes Datenschutzniveau festgestellt wurde, zu. Er wurde über die möglichen Risiken einer solchen Übermittlung aufgeklärt (Punkt 1.3 in der Patienteninformation). | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ProcessingGroup/consent1_7_2PolicyRule2ThirdCountryProcessingSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2HealthInsuranceGroup/consent1_7_2PolicyRule2RetrospectiveHealthInsuranceConsented` | 2.1 Der Patient willigt rückwirkend für die Daten der vergangenen 5 Kalenderjahre, sowie in die Übermittlung seiner Krankenversicherungs-Nummer an die zuständige Stelle, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2HealthInsuranceGroup/consent1_7_2PolicyRule2RetrospectiveHealthInsuranceSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2HealthInsuranceGroup/consent1_7_2PolicyRule2HealthInsuranceConsented` | 2.2 Der Patient willigt ab dem Datum seiner Unterschrift für die Daten über einen Zeitraum von 5 Jahren, sowie in die Übermittlung seiner Krankenversicherungs-Nummer an die zuständige Stelle, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2HealthInsuranceGroup/consent1_7_2PolicyRule2HealthInsuranceSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2BioMaterialsGroup/consent1_7_2PolicyRule2BiomaterialsConsented` | 3.1 – 3.2 Der Patient willigt in die Gewinnung, Lagerung und wissenschaftliche Nutzung seiner Biomaterialien (Gewebe und Körperflüssigkeiten), wie in Punkt 3.1 bis 3.3 der Einwilligungserklärung und Punkt 3 der Patienteninformation beschrieben, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2BioMaterialsGroup/consent1_7_2PolicyRule2BiomaterialsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2BioMaterialsGroup/consent1_7_2PolicyRule2AdditionalBiomaterialsConsented` | Falls zutreffend: Der Patient willigt der Entnahme geringer zusätzlicher Mengen von Biomaterial bei einer sowieso stattfindenden Routine-Blutentnahme oder -Punktion in den unter Punkt 3.20 der Patienteninformation beschriebenen Grenzen ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2BioMaterialsGroup/consent1_7_2PolicyRule2AdditionalBiomaterialsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2BioMaterialsGroup/consent1_7_2PolicyRule2RetrospectiveBiomaterialsConsented` | Falls zutreffend: Der Patient willigt in die Verarbeitung und wissenschaftliche Nutzung seiner Biomaterialien, die im Rahmen früherer Behandlungen gewonnen wurden, wie in Punkt 3.1 bis 3.3 der Einwilligungserklärung und Punkt 3 der Patienteninformation beschrieben, ein. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2BioMaterialsGroup/consent1_7_2PolicyRule2RetrospectiveBiomaterialsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2BioMaterialsGroup/consent1_7_2PolicyRule2ThirdCountryBiomaterialsConsented` | Falls zutreffend: Seine Einwilligung umfasst auch die Weitergabe seiner Biomaterialien in Länder, bei denen von der Europäischen Kommission kein angemessenes Datenschutzniveau festgestellt wurde. Der Patient wurde über die möglichen Risiken einer solchen Weitergabe aufgeklärt (Punkt 1.3 in der Patienteninformation). | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2BioMaterialsGroup/consent1_7_2PolicyRule2ThirdCountryBiomaterialsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ContactGroup/consent1_7_2PolicyRule2ContactConsented` | 4.1 Der Patient willigt ein, dass er von der behandelnden Einrichtung erneut kontaktiert werden darf, um gegebenenfalls zusätzliche für wissenschaftliche Fragen relevante Informationen [falls zutreffend: oder Biomaterialien] zur Verfügung zu stellen, um über neue Forschungsvorhaben/Studien informiert zu werden, und/oder um seine Einwilligung in die Verknüpfung seiner Patientendaten mit medizinischen Informationen aus anderen Datenbanken einzuholen (siehe Punkt 4.1 der Patienteninformation). | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ContactGroup/consent1_7_2PolicyRule2ContactSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ContactGroup/consent1_7_2PolicyRule2ContactAdditionalFindingsConsented` | 4.2 Der Patient willigt ein, dass er von der behandelnden Einrichtung wieder kontaktiert werden darf, um über medizinische Zusatzbefunde informiert zu werden (siehe Punkt 4.2 der Patienteninformation). | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ContactGroup/consent1_7_2PolicyRule2ContactAdditionalFindingsSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2Withdrawn` | Wurde die Einwilligung widerrufen? | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2WithdrawalDate` | Datum des Widerrufs | Date | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/otherConsent/id` | ID des Listeneintrags | EntryId | A | → prozedur.id | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/otherConsent/otherConsentChangeReason` | Grund der Änderung | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/otherConsent/otherConsentWithdrawalDate` | Datum des Widerrufs | Date | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/otherConsent/otherConsentName` | Bezeichnung (+Version) der (lokalen) Einwilligungserklärung | FreeText | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/otherConsent/otherConsentSignedDate` | Datum der Patientenunterschrift / gesetzlicher Vertreter (Vorsorgebevollmächtigter) | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/otherConsent/otherConsentValidityDuration` | Geltungsdauer | MedicalDate | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/otherConsent/otherConsentComplete` | Alle vorgesehenen Kreuze wurden mit "Ja" beantwortet. | Enumeration | C |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |

<details>
<summary>Strukturelemente (37: Listen, Gruppen, Listeneinträge)</summary>

| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |
|---|---|---|---|---|---|
| `participationDeclarationList` | Teilnahmeerklärungen | List | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `participationDeclarationList/participationDeclaration` | Teilnahmeerklärung | ListEntry (mehrfach) | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `treatmentContractList` | Behandlungsverträge | List | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `treatmentContractList/treatmentContract` | Behandlungsvertrag | ListEntry (mehrfach) | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList` | Einwilligungserklärungen | List | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2` | Einwilligungserklärung 2.2 | ListEntry | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2PolicyRule1aGroup` | Teil 1a: Molekularpathologische Diagnostik im nNGM | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2PolicyRule1bGroup` | Teil 1b: Überregionale Beratung und Studiensuche im nNGM | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2PolicyRule2Group` | Teil 2: Forschung im nNGM | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent2_2/consent2_2StatusResearchGroup` | Status der Einwilligungserklärung des Patienten - Forschungszwecke | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0` | Einwilligungserklärung 4.0 | ListEntry | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule1Group` | Teil 1: Molekularpathologische Diagnostik und Beratung im nNGM (notwendig im Behandlungskontext) | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group` | Teil 2: Forschung im Rahmen des nNGM (freiwillig zur Unterstützung der Forschung) | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2ProcessingGroup` | 1. Erhebung, Verarbeitung und wissenschaftliche Nutzung seiner Patientendaten | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2HealthInsuranceGroup` | 2. Übertragung und wissenschaftliche Nutzung seiner Krankenkassendaten | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2BioMaterialsGroup` | 3. Gewinnung, Lagerung und wissenschaftliche Nutzung seiner Biomaterialien | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2ContactGroup` | 4. Möglichkeit einer erneuten Kontaktaufnahme | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_0/consent4_0PolicyRule2Group/consent4_0PolicyRule2RequiredGroup` | Pflichtfeld für Teil 2 der Einwilligungserklärung: | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1` | Einwilligungserklärung 4.1 | ListEntry | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group` | Einwilligung zur Forschung | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2ProcessingGroup` | 1. Erhebung, Verarbeitung und wissenschaftliche Nutzung seiner Patientendaten | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2HealthInsuranceGroup` | 2. Übertragung und wissenschaftliche Nutzung seiner Krankenkassendaten | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2BioMaterialsGroup` | 3. Gewinnung, Lagerung und wissenschaftliche Nutzung seiner Biomaterialien | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent4_1/consent4_1PolicyRule2Group/consent4_1PolicyRule2ContactGroup` | 4. Möglichkeit einer erneuten Kontaktaufnahme | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |
| `consentList/consent1_6d` | Broad Consent 1.6d | ListEntry | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group` | Einwilligung zur Forschung | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2ProcessingGroup` | 1. Erhebung, Verarbeitung und wissenschaftliche Nutzung seiner Patientendaten, wie in der Patienteninformation beschrieben | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2HealthInsuranceGroup` | Falls zutreffend: 2. Übertragung und wissenschaftliche Nutzung seiner Krankenkassendaten | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2BioMaterialsGroup` | Falls zutreffend: 3. Gewinnung, Lagerung und wissenschaftliche Nutzung seiner Biomaterialien (Gewebe und Körperflüssigkeiten), wie in der Patienteninformation beschrieben | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_6d/consent1_6dPolicyRule2Group/consent1_6dPolicyRule2ContactGroup` | 4. Möglichkeit einer erneuten Kontaktaufnahme | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2` | Broad Consent 1.7.2 | ListEntry | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group` | Einwilligung zur Forschung | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ProcessingGroup` | 1. Erhebung, Verarbeitung und wissenschaftliche Nutzung seiner Patientendaten, wie in der Patienteninformation beschrieben | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2HealthInsuranceGroup` | Falls zutreffend: 2. Übertragung und wissenschaftliche Nutzung seiner Krankenkassendaten | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2BioMaterialsGroup` | 3. Gewinnung, Lagerung und wissenschaftliche Nutzung seiner Biomaterialien (Gewebe und Körperflüssigkeiten), wie in der Patienteninformation beschrieben | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/consent1_7_2/consent1_7_2PolicyRule2Group/consent1_7_2PolicyRule2ContactGroup` | 4. Möglichkeit einer erneuten Kontaktaufnahme | FieldGroup | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10); Broad Consent (MII): ggf. Übernahme aus einem Einwilligungsmanagement (z. B. gICS) statt Doppelerfassung – offene Frage E-10 |
| `consentList/otherConsent` | Andere (lokale) Einwilligung | ListEntry (mehrfach) | Struktur |  | nNGM-Einwilligung, kein Gegenstück (OS.Einwilligung nur LKR/Tudok/PCO); Kandidat eigenes Formular NNGM.Einwilligung, je Dokument/Version ein Abschnitt bzw. Unterformular (E-10) |

</details>
