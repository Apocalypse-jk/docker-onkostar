# nNGM → Onkostar Mapping

Ziel: Jedes Feld des nNGM-Datensatzes bekommt einen festen Platz in der Onkostar-Datenbank – in einem
bestehenden Onkostar-Formular, einem eigenen nNGM-Formular oder über ein Plugin.

**Grundlage ist das nNGM-eCRF-Importschema** `nngm_schema/schema.xml` (XSD, Version 1.39.1.1139) – es beschreibt
genau das Format, in das ein Export aus Onkostar passen muss. Die Excel-Datensatzbeschreibung
(`nngm_datensatz/*.xlsx`) dient nur noch als Ergänzung (Gruppen-Labels, FHIR-Hinweise, Definitionen).

## Dateien

| Datei | Inhalt | Wer pflegt |
|---|---|---|
| **`MAPPING.md`** | **Zentrales Mapping-Dokument**: Gesamtstand, Grundsatzentscheidungen, offene Fragen, je Bogen alle Felder nach Status mit Bemerkungen und Werteübersetzungen | Skript (`mapping-dokument.mjs`) |
| `feld-mapping.csv` | **Arbeitsdatei**: eine Zeile je nNGM-Feld mit Vorschlag und Entscheidung | Vorschläge: Skript, Entscheidung: Team |
| `typ-mapping.csv` | nNGM-Feldtyp → Onkostar-Datentyp/Formularelement | Team (steuert die Vorschläge) |
| `werte-mapping.csv` | nNGM-Code → Onkostar-Code je Feld (für Kategorie B) | Team |
| `entscheidungen.md` | Grundsatzentscheidungen, Erkenntnisse, offene Fragen | Team |
| `vorschlaege/formulare.csv` | je nNGM-Instrument die passendsten Onkostar-Formulare | Skript |
| `vorschlaege/merkmalskataloge.csv` | je nNGM-Werteliste der passendste Onkostar-Merkmalskatalog | Skript |
| `nngm-datensatz/*.csv` | nNGM-Datensatz aus dem **Schema** (Instrumente, Felder mit Typ/Pflicht/Mehrfach, Wertelisten), ergänzt aus Excel | Skript |
| `nngm-excel/*.csv` | Excel-Datensatzbeschreibung als CSV (nur noch Ergänzung, enthält auch die DigiNet-Bögen) | Skript |
| `onkostar-bestand/*.csv` | Formulare, Formularfelder, Datenkataloge, Merkmalskataloge (+ Werte) der Onkostar-DB | Skript |

Alle CSV-Dateien: Semikolon-getrennt, UTF-8 – lassen sich direkt in Excel öffnen.

## Kategorien

| Kategorie | Bedeutung |
|---|---|
| **A** | Vorhandenes Onkostar-Feld passt direkt (Typ und ggf. Werteliste) |
| **B** | Vorhandenes Feld passt, aber Werte müssen übersetzt werden (Werte-Mapping nötig) |
| **C** | Kein passendes Feld → neues Feld in einem nNGM-Formular |
| **D** | Braucht Plugin-Logik (Netzwerkpartner, automatisch befüllte Werte, Berechnungen) |
| **X** | Wird nicht übernommen |
| Struktur | Gruppe/Liste – wird zu Abschnitt bzw. Unterformular, keine eigene Datenspalte |

## Vorgehen

1. **Bogen auswählen** – mit den Kernbögen anfangen (Diagnose, Histologie, Tumorstadium, NGS-Panel, Therapien).
2. **Formular entscheiden** – in `vorschlaege/formulare.csv` nachsehen, welches Onkostar-Formular passt, und die
   Entscheidung in `entscheidungen.md` festhalten (bestehendes OS-Formular erweitern oder eigenes nNGM-Formular?).
3. **Felder prüfen** – in `feld-mapping.csv` nach `nngm_instrument` filtern und je Zeile die Spalten
   `kategorie`, `os_formular`, `os_datenkatalog`, `os_feld`, `os_merkmalskatalog`, `plugin`, `status`, `kommentar` füllen.
   Vorschlag übernehmen, korrigieren oder verwerfen. Mit `vorschlag_sicherheit = hoch` anfangen.
4. **Status setzen** – `offen` (noch nicht besprochen), `bestätigt` (stimmt), `vorläufig` (stimmt evtl.,
   Restfrage im Kommentar), `unvollständig` (Ziel stimmt, deckt aber nicht alle nNGM-Werte ab – Lücken in
   `werte-mapping.csv`), `ungelöst` (Lösung muss noch gefunden werden).
   Wartet eine Entscheidung auf eine Antwort von außen, beginnt der Kommentar mit **`[Rückfrage offen]`**;
   die Frage selbst steht in `entscheidungen.md` unter „Gestellte Rückfragen“. Eintragen per
   `node mapping/tools/entscheidung.mjs <nngm_schluessel> status=bestätigt os_feld=… kommentar=…`
   (prüft erlaubte Spalten, Status und Kategorien).

### Spalten in `feld-mapping.csv`

- `nngm_*` – Beschreibung des nNGM-Felds. `nngm_schluessel` (Instrument/Pfad/Feld) ist eindeutig und dient als ID.
- `kategorie_vorschlag`, `vorschlag_*` – automatisch berechnet, **werden bei jedem Lauf überschrieben**.
  `vorschlag_alternativen` enthält die nächstbesten Kandidaten.
- `kategorie` … `kommentar` – **von Hand gepflegt, bleiben beim erneuten Ausführen erhalten**.

## Skripte

Voraussetzung: Node.js ≥ 18 und der laufende MariaDB-Container (`docker compose up -d mariadb`).
Keine weiteren Pakete nötig.

```sh
node mapping/tools/nngm-excel.mjs            # Excel → nngm-excel/*.csv (neueste .xlsx in nngm_datensatz/)
node mapping/tools/nngm-schema.mjs           # Schema (+ Excel-Ergänzung) → nngm-datensatz/*.csv
node mapping/tools/onkostar-bestand.mjs      # Onkostar-DB → onkostar-bestand/*.csv
node mapping/tools/mapping-vorschlaege.mjs   # beides → vorschlaege/*.csv und feld-mapping.csv
node mapping/tools/onkostar-eintraege.mjs 2  # gespeicherte Werte eines (Test-)Patienten anzeigen
node mapping/tools/mapping-dokument.mjs      # MAPPING.md aus feld-/werte-mapping.csv und entscheidungen.md neu erzeugen
```

Erneut ausführen, wenn eine neue Schema-Version kommt oder in Onkostar Formulare angelegt/geändert wurden.
Zeilen, die es im neuen Datensatz nicht mehr gibt, meldet das Skript als Warnung (sie entfallen dann aus
`feld-mapping.csv` – vorher auf Entscheidungen prüfen).

Typen aus dem Schema (Spalte `typ`): `Enumeration`, `MultipleChoice` (mehrere Werte), `Terminology` (Code aus
einer nNGM-Terminologie wie ICD-O-3, ATC, Gene), `ListEntryReference` (Verweis auf einen Listeneintrag eines
anderen Bogens), `EntryId` (ID je Listeneintrag zum Reidentifizieren), `MedicalDate`, `FreeText`, `Integer`,
`Decimal`, `Nngm*` (Netzwerkpartner/-standorte). Hinweis: Im XSD sind **alle** Datenfelder Pflicht
(kein `minOccurs="0"`) – die Spalte `pflicht` taugt daher nicht zur Unterscheidung.

Verbindung zur DB über Umgebungsvariablen anpassbar: `OS_DB_CONTAINER`, `OS_DB_USER`, `OS_DB_PASSWORD`, `OS_DB_NAME`.

### Wie die Vorschläge entstehen

- **Wertelisten**: Jeder nNGM-Wert wird über Code und Label mit den Werten aller Merkmalskataloge verglichen
  (auch „ECOG 0 – …“ ↔ Code `0`). Bevorzugt werden Kataloge aus OS-Standardformularen.
- **Felder**: Ähnlichkeit der Labels (inkl. Zerlegung deutscher Komposita), Kontext (Bogen/Gruppe ↔
  Formular/Abschnitt), verträglicher Datentyp laut `typ-mapping.csv` und passende Werteliste.
  OS-Standardformulare werden vor Lungen-spezifischen und diese vor Formularen anderer Entitäten bevorzugt.
- **Formulare**: das Onkostar-Formular, in dem die meisten guten Feldtreffer eines Bogens liegen.

Die Vorschläge sind ein Startpunkt, keine Entscheidung. Erfahrungswerte aus Stichproben:
Sicherheit „hoch“ ist meist richtig, „mittel“ etwa zur Hälfte, „niedrig“ eher ein Hinweis, wo man suchen kann.
Begriffe, die das Skript nicht als gleich erkennt, können in `mapping-vorschlaege.mjs` unter `SYNONYMS` ergänzt werden.

## Onkostar-Datenmodell (Kurzfassung)

- **Formular** (`data_form`) zeigt Felder (`data_form_entry`) an; die Daten liegen in **Datenkatalogen**.
- Datenkatalog `X` → Tabelle `dk_x`, Feld `Y` → Spalte `y` (jeweils kleingeschrieben).
  - Auswahlfelder: zusätzlich `y_propcat_version` (Version des Merkmalskatalogs)
  - Datumsfelder: zusätzlich `y_acc` (Genauigkeit, z. B. nur Monat/Jahr)
  - Mehrfachauswahl: eigene Tabelle `dk_x_merkmale` mit einer Zeile je Wert (`eintrag_id`, `feldname`, `feldwert`)
- Gemeinsame Spalten jedes Formulareintrags (Patient, Datum, Status) stehen in `prozedur`; `dk_x.id` = `prozedur.id`.
- **Unterformulare** sind eigene Prozeduren: `prozedur.hauptprozedur_id` → übergeordnete Prozedur,
  `prozedur.data_form_entry_id` → das Unterformular-Feld im Hauptformular (z. B. „Sequenzierung“ in OS.Molekulargenetik).
- **Erkrankung**: `erkrankung` (ICD-10, Histologie, Lokalisation, Diagnosedatum) ist über `erkrankung_prozedur`
  mit allen Prozeduren verknüpft – auch mit Unterformularen.
- **Merkmalskataloge** (`property_catalogue`) sind versionierte Wertelisten
  (`property_catalogue_version`, `property_catalogue_version_entry`). `y_propcat_version` speichert
  `property_catalogue_version.id`, also die konkrete Katalogversion (z. B. 1804 = ICD-10 GM Version 16).
- Gespeichert wird immer der **Code** des Katalogwerts (`C34.9`, `8010/3`, `U`), nicht der Text.
- **Formularverweise** (`formReference`) speichern die `prozedur.id` des referenzierten Eintrags.
- **Teildaten**: `y_acc` = `exact`, `unk_d` (Tag unbekannt → 15.), `unk_m` (nur Jahr → 15.07.), `unk_y` (Jahr unbekannt, Datum ist nur Platzhalter), `est_d`/`est_m`/`est_y` (Tag/Monat/Jahr geschätzt).
  Details in `entscheidungen.md`.

Wo die Werte eines Testpatienten gelandet sind, zeigt `node mapping/tools/onkostar-eintraege.mjs <patient_id>`.
