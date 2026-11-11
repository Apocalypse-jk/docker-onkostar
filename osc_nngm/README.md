# nNGM-Formulare als OSC

Importierbare Onkostar-Formulare für nNGM-Bögen, erzeugt aus der nNGM-Datensatzbeschreibung:

```sh
node mapping/tools/osc-nngm-formular.mjs radioTherapy   # → osc_nngm/NNGM.Strahlentherapie.osc
```

Vorher müssen `mapping/nngm-datensatz/*.csv` aktuell sein (`node mapping/tools/nngm-schema.mjs`).
Hintergrund zum Dateiformat und Import-Verhalten: `osc_exports/OSC-FORMAT.md`.

## Import

Im Formulareditor importieren, **immer mit „Merkmalskataloge überschreiben“**. Laut Hersteller für die Entwicklung
immer aktivieren: Die Option betrifft die komplexen Merkmalskataloge, die ohne sie zwar beim ersten Import angelegt,
bei späteren Importen aber möglicherweise nicht mehr aktualisiert werden. Unsere Dateien enthalten nur eigene
`NNGM.*`-Kataloge; OS-Kataloge werden nur über den Namen referenziert und sind nicht in der Datei.

**Danach Formularrechte vergeben** – OSC-Dateien enthalten keine Rechte, ohne sie erscheint das Formular
für niemanden in der Formularauswahl beim Patienten. Wie bei den OS-Formularen: „OS.Formulare“ und
„Dokumentare“ alle Rechte, „OS.FormularLesend“ nur anzeigen.

⚠️ In der lokalen Instanz (2.14.4) ließen sich die Rechte eines Formulars nur **einmal** ändern; weitere
Änderungen wurden nicht gespeichert. Abhilfe: Formular löschen, neu importieren und die Rechte direkt
vollständig vergeben. Das Formular bekommt dabei eine neue ID (Datenkatalog und Kataloge bleiben). Ein erneuter Import derselben Datei
aktualisiert Formular, Datenkatalog und Kataloge (Zuordnung über die Namen). Felder, die in einer neuen Fassung
fehlen, verschwinden nur aus dem Formular – das Datenkatalog-Feld (und seine Spalte) bleibt bestehen.

## Abbildungsentscheidungen

| nNGM | Onkostar | Begründung |
|---|---|---|
| Liste (z. B. „Strahlentherapien“) mit Listeneintrag | **ein Formulareintrag je Listeneintrag** | Jeder Onkostar-Formulareintrag ist eine Prozedur mit Datum und Erkrankungsbezug; mehrere Strahlentherapien = mehrere Einträge. Kein Hauptformular mit Unterformular nötig. |
| FieldGroup | Abschnitt (`section`) oben, Feldgruppe (`group`) im Abschnitt, tiefer aufgelöst | Onkostar kennt keine Abschnitte in Abschnitten |
| Liste innerhalb eines Bogens | Unterformular (`<Unterformular>`-Block, subform-Eintrag) | Unterformulare brauchen kein Datum (E-11) |
| Enumeration / Autocomplete | Auswahlliste; ab 20 Werten Suchdialog | Autocomplete mit `selectAll: no` als Einfachauswahl umgesetzt |
| Werteliste mit OS-Gegenstück (ja/nein, ja/nein/unbekannt) | **OS-Katalog** `OS.JaNein` (1/0) bzw. `OS.JaNeinUnbekannt` (1/0/9) | Übersetzung in nNGM-Codes beim Export (E-0, 11.11.2026); Filter werden automatisch übersetzt |
| Werteliste ohne OS-Gegenstück | eigener Merkmalskatalog `NNGM.<typ>` mit **nNGM-Codes** | kein Eingriff in OS-Standardkataloge. Gültig ab 01.01.2000. |
| MedicalDate | Datum, Teildatum nur wenn das nNGM-Muster es erlaubt | Datumsgrenzen: nicht vor Geburt, nicht nach Tod, nicht in der Zukunft |
| Bogen ohne Datum | Onkostar-eigenes Datumsfeld (Prozedurdatum), beim Export weglassen | E-11 |
| FreeText | Text bis 255 Zeichen (`textfield`), sonst Langtext | `maximal length` aus der Definition |
| Decimal / Integer | Zahl mit Einheit (`unit`, z. B. Gy) | |
| Feldnamen | nNGM-Feldnamen (z. B. `therapyStart` → Spalte `therapystart`) | 1:1 rückverfolgbar; Herkunft zusätzlich in der Notiz jedes Datenkatalog-Felds |

Ordner: `nNGM` in der BENUTZER Bibliothek. Kategorie (Diagnose/Therapie/Beobachtung/Fragebogen → `Category`
-1/-2/-3/-4 an Formular und Datenkatalog): wie in der Konfiguration des Instruments. **Menü: eigene Kategorie
„nNGM“** für alle nNGM-Formulare (E-11). Die Menükategorie muss vor dem Import in der Datenbank existieren:
`INSERT INTO data_form_menu_category (name, position, column) VALUES ('nNGM', '3', '1')` (lokal angelegt 11.11.2026).

**Umstellung 11.11.2026 (ja/nein-Kataloge, Menü):** Gespeicherte Testwerte in Ja/Nein-Feldern (`yes`/`no` aus den
früheren `NNGM.yesNo`-Katalogen) passen nach dem erneuten Import nicht mehr zum neuen Katalog (`1`/`0`) – in den
Testeinträgen neu auswählen.

## NNGM.Therapieinformation (assessment + TherapyInformation)

Eigenes nNGM-Formular ohne OS-Basis (`mapping/entscheidungen.md`, E-10):

```sh
node mapping/tools/osc-nngm-formular.mjs therapieinformation   # → osc_nngm/NNGM.Therapieinformation.osc
```

- Hauptformular `NNGM.Therapieinformation` (Datenkatalog `NNGMTherapieinformation`), Kategorie Therapie, Menü „nNGM“:
  - **Datum** – Onkostar-eigenes Feld (Prozedurdatum), weil keiner der beiden Bögen ein Datum hat
  - Abschnitt „MURIPEDIA Therapie Information – Klinische Information“: Unterformular Archivierungscodes,
    Feldgruppe „Klinische Information für:“ mit zugelassener zielgerichteter Therapie, Studie, Off-Label,
    Vorstellung MTB (je `OS.JaNein`)
  - Abschnitt „Therapieinformation“: Therapieinformation (Langtext), hilfreich / umgesetzt (`OS.JaNeinUnbekannt`),
    Grund für die Nichtumsetzung (`NNGM.systemischeTherapieGrundNichtumsetzung`, 8 Werte) – **nur sichtbar bei
    „umgesetzt = Nein“** (Filter `wasImplemented='no'`, ergänzt 10.11.2026, nicht aus dem nNGM-Schema)
- Unterformular `NNGM.MURIPEDIA-Archivierungscode` (Datenkatalog `NNGMArchivierungscode`): Erstelldatum
  (vollständiges Datum, Prozedurdatum) und Archivierungscode – ein Eintrag je Code.
- Generator-Erweiterungen dafür: mehrere Instrumente in einem Formular, verschachtelte Liste → Unterformular
  (`<Unterformular>`-Block wie im Onkostar-Export), Abschnitt/Feldgruppe nach Onkostar-Regel (Abschnitt nur oben,
  Feldgruppe nur im Abschnitt), Teildatum nur wenn das nNGM-Muster es erlaubt.
- **Import:** mit „Merkmalskataloge überschreiben“ (siehe oben); danach Rechte für **beide** Formulare vergeben.
- **Getestet** (10.11.2026, `xmlImportReport-29`): Formulare 751/750, Abschnitte, Feldgruppe im Abschnitt und
  Unterformular wie erzeugt. Testeintrag Patient 3: Prozedur 24 (Hauptformular, Werte mit nNGM-Codes in
  `dk_nngmtherapieinformation`), Prozedur 25 (Archivierungscode, Unterformular von 24, in `dk_nngmarchivierungscode`),
  beide der Erkrankung zugeordnet. Filter für den Nichtumsetzungsgrund danach ergänzt und per erneutem Import
  übernommen: das Feld erscheint erst bei „umgesetzt = Nein“.

## NNGM.Anforderung (diagnosticsRequest)

Eigenes nNGM-Formular ohne OS-Basis (`mapping/entscheidungen.md`, E-10):

```sh
node mapping/tools/osc-nngm-formular.mjs anforderung   # → osc_nngm/NNGM.Anforderung.osc
```

- Hauptformular `NNGM.Anforderung` (Datenkatalog `NNGMAnforderung`), Kategorie Beobachtung, Menü „nNGM“
  Prozedurdatum = Anforderungsdatum (Teildatum erlaubt wie bei nNGM).
- Abschnitte wie im nNGM-Bogen: Eckdaten der Anforderung, Diagnostik, Diagnostikanforderungen (Mehrfachauswahlen für
  histologische Abklärung, IHC, Fast Track, Liquid Biopsy), Anforderung Molekulares Tumorboard. 9 `NNGM.*`-Kataloge.
- **Tumordiagnose** (`firstDiagnosis`, nNGM-Verweis auf `tumorDiagnosis`) → **Formularverweis auf OS.Diagnose**
  (Auswahl zeigt „Diagnosedatum – ICD-10“; gespeichert wird die `prozedur.id` des Diagnose-Eintrags).
- **Netzwerkpartner/-standort** (`requester`, `performer`, `additionalPerformer`): vorläufig Freitext (wie
  `executionCenter` der Strahlentherapie), Abbildung der nNGM-Netzwerkpartner noch offen.
- Unterformular `NNGM.Anforderung.Behandler` (Datenkatalog `NNGMAnforderungBehandler`): ein Eintrag je zusätzlichem
  Behandler.
- Generator-Erweiterung: Feldtyp Formularverweis (`typ: 'FormReference'` mit Zielformular, GUID und Anzeige;
  Vorlage aus dem Export von OS.Systemische Therapie).
- **Filter** (eigene Ergänzung, nicht aus dem nNGM-Schema): E-Mail/Telefon nur bei Tumorboard-Teilnahme = Ja;
  Grund für fehlende Biopsie nur, wenn bei Liquid Biopsy **keine** Option angekreuzt ist
  (`liquidBiopsy->isEmpty()`, Schreibweise wie in OS-Formularen; am 11.11.2026 umgedreht und in der Oberfläche
  geprüft). Umstellung auf `OS.JaNein` und Menü „nNGM“ für alle drei Formulare importiert und getestet (11.11.2026).
- **Import:** mit „Merkmalskataloge überschreiben“; danach Rechte für **beide** Formulare.
- **Getestet** (10.11.2026, `xmlImportReport-31`): Formulare und Felder angelegt. Warnung beim Unterformular
  „Behandler“: ohne Prozedurdatum steht es nicht für die Tumordokumentation zur Verfügung – bei Unterformularen
  üblich (OS.Substanz hat ebenfalls kein Datum). Testeintrag Patient 3: Prozedur 26 – Formularverweis
  `firstDiagnosis = 16` (OS.Diagnose), Mehrfachauswahlen mit nNGM-Codes in `dk_nngmanforderung_merkmale`;
  Prozedur 27 = zusätzlicher Behandler (Unterformular von 26). Filter danach ergänzt, per erneutem Import
  übernommen und in der Oberfläche geprüft – beide funktionieren.

## NNGM.Systemische Therapie (abgeleitet von OS.Systemische Therapie)

Abgeleitetes, verknüpftes Formular („OS-Formular als Basis, nNGM erbt davon“, `mapping/entscheidungen.md`, E-8):

```sh
node mapping/tools/osc-ableitung.mjs systemicTherapy   # → osc_nngm/NNGM.Systemische Therapie.osc
```

- Kopie von OS.Systemische Therapie (alle Felder, Filter, Plausibilitätsregeln, Unterformulare per Name), neue
  GUIDs, Ansichten entfernt. Datenkataloge: **`Systemtherapie`** (gemeinsam mit dem OS-Formular) und
  **`NNGMSystemtherapie`** (nNGM-Ergänzungen mit nNGM-Codes).
- **Verknüpft mit OS.Systemische Therapie** (`<VerknuepftGUID>` in der Datei, kein manueller Schritt). Ohne
  Verknüpfung bieten Formularverweise auf OS.Systemische Therapie (z. B. „Systemtherapie 1“ in
  OS.Strahlentherapie) den nNGM-Eintrag nicht an, mit Verknüpfung schon. Zusammenfassungen und Skripte stehen nur im
  geerbten INHERIT-Block. In der Formularverwaltung **nicht** „Automatisch zuordnen“ klicken (NullPointerException).
- **nNGM-Zusatzfelder** (alle Kategorie-C-Felder der Systemtherapie, E-4) aus dem nNGM-Datensatz, mit derselben
  Logik wie die eigenen nNGM-Formulare erzeugt (`osc-lib.mjs`), in vier Abschnitten hinter den OS-Feldern:
  - **Therapiefreie Zeit / Best Supportive Care:** ja/nein, Grund, Freitext „Anderer“, Start, Ende
  - **Therapieempfehlung:** auf Basis einer Empfehlung, weitere Angaben, durchführende Einrichtung, Datum
  - **Therapielinie und Studie:** Liniennummer, Off-Label-Use, Erhaltungstherapie, Studienteilnahme, Name,
    Register, Studien-ID, genetische Einschlussvariante
  - **Response:** Datum des besten Ansprechens, Beurteilung nach (RECIST / behandelnder Arzt)
- **Filter** (eigene Ergänzung): BSC-Grund und -Zeitraum nur bei BSC = ja, Freitext nur bei Grund „Anderer“;
  Empfehlungsdetails nur bei gewählter Empfehlung ≠ nein; Studienangaben nur bei Studienteilnahme = ja.
- **Import:** mit „Merkmalskataloge überschreiben“ (die Datei enthält nur `NNGM.*`-Kataloge; OS-Kataloge,
  Basis-Datenkatalog und Unterformulare werden nur per Name referenziert).
- **Getestet** (05.11.2026, erste Fassung mit 3 Testfeldern im Abschnitt „nNGM-Ergänzungen“): Formular 749,
  Prozedur 19 – Basiswerte in `dk_systemtherapie`, nNGM-Werte in `dk_nngmsystemtherapie`, Unterformular, Skripte,
  Erkrankungszuordnung und Verknüpfung funktionieren. Die frühere Ausweichdatei `-voll.osc` (kompletter OS-Export)
  wird nicht mehr erzeugt.
- **Vollständige Fassung** (10.11.2026, 19 Zusatzfelder): noch nicht importiert. Beim Import verschwindet der alte
  Abschnitt „nNGM-Ergänzungen“; seine drei Felder stehen dann im Abschnitt „Therapielinie und Studie“ (gespeicherte
  Werte bleiben, sie liegen im Datenkatalog).

## NNGM.Strahlentherapie (radioTherapy)

**Gelöscht (10.11.2026):** Eigenständiges Formular (E-0 Weg 1), nach der Entscheidung für die Vererbung (E-8) in
Onkostar gelöscht; bei Bedarf als von OS.Strahlentherapie abgeleitetes, verknüpftes Formular neu erstellen
(`osc-ableitung.mjs`). Datenkatalog `NNGMStrahlentherapie` (Tabelle `dk_nngmstrahlentherapie` mit den Testdaten von
Prozedur 18) und die `NNGM.*`-Kataloge bestehen weiter. Die OSC-Datei wurde ebenfalls entfernt; neu erzeugen mit
`node mapping/tools/osc-nngm-formular.mjs radioTherapy`.

- Datenkatalog `NNGMStrahlentherapie` → Tabelle `dk_nngmstrahlentherapie`, 15 Felder in 6 Abschnitten,
  7 Merkmalskataloge (`NNGM.radiationTarget` mit 99 Zielgebieten …).
- Prozedurdatum = Therapiebeginn. Menü und Kategorie „Therapie“ (beim ersten Import noch „Beobachtung“, korrigiert).
- **Import getestet** (23.10.2026, lokale Instanz, `xmlImportReport-23`): Formular (ID 747), Datenkatalog,
  alle 15 Felder, 6 Abschnitte, 7 Kataloge, 3 Filter und 6 Datumsregeln wie erzeugt in der Datenbank;
  Tabelle `dk_nngmstrahlentherapie` mit allen Spalten (`_acc` für Datumsfelder, `_propcat_version` für Auswahlen,
  `double` für Dosen, `varchar(200)` für Bemerkungen).
- **Erfassung getestet** (Testpatient 3, Prozedur 18, Formular-ID 748 nach erneutem Import): alle Werte mit
  nNGM-Codes gespeichert (`therapeuticintention = other`, `boostexecuted = sequentialBoost`,
  `radiationtarget = 4.10_upperAbdomen` über den Suchdialog), Dosen als Zahl, Teildatum `therapystart_acc = unk_d`,
  Therapiebeginn als Prozedurdatum übernommen, Eintrag der Erkrankung zugeordnet. Rechte: „Dokumentare“ alle,
  „OS.Formulare“ und „OS.FormularLesend“ nur anzeigen. **Filter funktionieren** im Formular: „Sonstiges“ und
  die Boostdosis-Felder erscheinen erst nach Auswahl der passenden Option.
- Später (noch nicht relevant): Plausibilitätsregeln „Therapieende nicht vor Therapiebeginn“ und „Therapiebeginn
  nicht vor Diagnosedatum“ als Warnung – im Test ließ sich eine Strahlentherapie 2013 zu einer Diagnose von 2026
  speichern.
- **Ergänzt** (nicht aus dem Datensatz, sondern naheliegend): „Sonstiges“ zur Intention nur sichtbar bei
  Intention = Sonstiges; Boostdosis-Felder nur sichtbar, wenn ein Boost durchgeführt wurde.
- **Abweichung vom Schema** (das importierte Formular wurde noch aus der Excel-Datei erzeugt): Laut Schema sind
  `radiationTarget` und `endOfRadiotherapy` **Mehrfachauswahlen**, `otherTherapeuticIntention` hat max. 200 Zeichen.
  Der Generator erzeugt das inzwischen so; vor einem erneuten Import klären, wie Onkostar die Umstellung eines
  bestehenden Einfachauswahl-Felds auf Mehrfachauswahl behandelt (Werte wandern nach `dk_…_merkmale`).
- **Offen:**
  - `executionCenter` (nNGM-Typ `NngmNetworkLocation`) ist vorläufig ein Freitextfeld – Abbildung der
    nNGM-Netzwerkstandorte (Katalog, Organisationseinheit oder Plugin) noch zu entscheiden.
  - `therapyEnd` hat in nNGM „can be ongoing“; in Onkostar heißt ein leeres Enddatum „laufend“.
  - Die nNGM-Wertelisten enthalten in den Labels die oBDS-Codes („K = kurativ“). Sollen die Daten auch in
    die Krebsregistermeldung einfließen, wäre ein Mapping auf die OS-Standardkataloge
    (z. B. `OS.Therapieintention`) bzw. die Nutzung von `OS.Strahlentherapie` zu prüfen.
