nNGM → Onkostar 2.14.4 · Testbericht · 05.11.2026

# nNGM-Formulare von OS-Formularen erben lassen

Für das Projektteam und den Onkostar-Hersteller. Lokale Testinstanz, nur fiktive Testpatienten.

**Kurzfassung:** Ein nNGM-Formular kann ein OS-Standardformular als Basis nutzen, ohne dass das OS-Formular verändert wird. Getestet mit `NNGM.Systemische Therapie` auf Basis von `OS.Systemische Therapie`: Die Basisdaten landen in der OS-Tabelle, die zusätzlichen nNGM-Felder in einer eigenen Tabelle, Unterformulare, Skripte und Regeln funktionieren. Erst die Onkostar-Funktion „Formular verknüpfen“ sorgt dafür, dass andere Formulare den nNGM-Eintrag wie eine OS-Therapie behandeln.

Offen ist, ob das auch für die Krebsregistermeldung, die OnkoZert-Kennzahlen und Hersteller-Updates gilt. Dazu haben wir unten drei Fragen an den Hersteller.

## Ausgangslage

Das Projektteam möchte für die nNGM-Bögen wenn möglich die bestehenden OS-Formulare als Basis verwenden. Die OS-Formulare sollen dabei nicht verändert werden. Stattdessen soll ein nNGM-Formular von ihnen erben und um die fehlenden nNGM-Felder ergänzt werden.

Beim Abgleich der systemischen Therapie fehlen in `OS.Systemische Therapie` unter anderem die Nummer der Therapielinie, Off-Label-Use und die Angabe, ob es eine Erhaltungstherapie ist. Diese drei Felder dienten als Testumfang.

## Aufbau des Testformulars

1. Kopie von `OS.Systemische Therapie` (alle 39 Felder, Filter, Skripte, Plausibilitätsregeln) unter dem Namen `NNGM.Systemische Therapie`, mit neuen GUIDs.
2. Zwei Datenkataloge: `Systemtherapie` (derselbe wie im OS-Formular) und `NNGMSystemtherapie` mit den drei nNGM-Feldern und Katalogen mit nNGM-Codes.
3. Verknüpft mit `OS.Systemische Therapie` über `<VerknuepftGUID>`. Zusammenfassungen und Skripte stehen nur im geerbten Block zwischen den INHERIT-Markierungen.
4. Import als OSC-Datei, die nur die neuen Objekte enthält, ohne „Merkmalskataloge überschreiben“. OS-Formular, OS-Datenkatalog und Unterformulare werden nur über ihren Namen referenziert.

## Ergebnisse

| Prüfung | Ergebnis | Beobachtung |
| --- | --- | --- |
| Import, OS-Formular bleibt unverändert | funktioniert | Revision von `OS.Systemische Therapie` (98) und Datenkatalog `Systemtherapie` (36) vor und nach dem Import gleich. |
| Speicherort der Daten | funktioniert | Basisfelder in `dk_systemtherapie`, nNGM-Felder in `dk_nngmsystemtherapie`, beide mit derselben ID wie die Prozedur. |
| Unterformulare, Skripte, Plausibilitätsregeln, Erkrankungszuordnung | funktioniert | Substanz als Unterformular, „beim Speichern“ setzt Datum = Beginn, ADT-Therapieart wird befüllt. |
| Formularverweis aus `OS.Strahlentherapie` („Systemtherapie 1“) ohne Verknüpfung | nicht angeboten | Die nNGM-Therapie erscheint nicht in der Auswahl, eine OS-Therapie beim selben Patienten schon. |
| Formularverweis mit Verknüpfung | funktioniert | Die nNGM-Therapie ist auswählbar und wird gespeichert. |
| Verknüpfung per OSC-Import setzen | funktioniert | `<VerknuepftGUID>` mit der GUID des OS-Formulars; Zusammenfassung und Skripte erscheinen je einmal. |
| „Automatisch zuordnen“ in der Formularverwaltung | Fehler | NullPointerException, siehe Frage 2. Das Speichern der Verknüpfung klappt trotzdem. |
| Krebsregistermeldung (oBDS), OnkoZert-Kennzahlen, Auswertungen | offen | Lokal nicht prüfbar, siehe Frage 1. |

## Was die Verknüpfung bewirkt

Beim Speichern einer Verknüpfung stellt Onkostar Zusammenfassung, große Zusammenfassung, Kalender- und E-Mail-Vorlage sowie alle Formularskripte des Basisformulars als geerbten Block voran. Eigene Ergänzungen stehen dahinter. In der OSC-Datei sieht das so aus:

```
<VerknuepftGUID>649659ef-d708-11e5-b199-0050568f1add</VerknuepftGUID>

<ScriptBeimSpeichern>
  <Code>//#### INHERIT START ####
  var status = getFieldValue('Status'); …
  //#### INHERIT END ####</Code>
</ScriptBeimSpeichern>
```

Auf Feldebene wird nichts verknüpft: `data_form_entry.verknuepft` bleibt bei allen Feldern 0, auch beim mitgelieferten Beispiel EPIC-26-POST.

## Fragen an den Hersteller

Kopiert

1. **Registermeldung und Kennzahlen:** Werden Einträge eines Formulars, das mit `OS.Systemische Therapie` verknüpft ist und dessen Datenkatalog `Systemtherapie` nutzt, bei der oBDS-Meldung an das Landeskrebsregister, bei den OnkoZert-Kennzahlen und in Auswertungen wie Einträge von `OS.Systemische Therapie` berücksichtigt? Davon hängt ab, ob nNGM-Therapien sonst im Krebsregister fehlen.
2. **Updates und „Automatisch zuordnen“:** Wie kommen Änderungen des Herstellers an `OS.Systemische Therapie` in ein verknüpftes Formular? Ist dafür „Zuordnen und aktualisieren“ gedacht? „Automatisch zuordnen“ bricht bei uns mit einer NullPointerException ab (`AbstractDataFormService.automatischZuordnen`, Zeile 333, Onkostar 2.14.4), wenn das verknüpfte Formular zusätzliche Felder aus einem eigenen Datenkatalog hat. Davon hängt ab, ob nNGM-Formulare bei jedem Onkostar-Update von Hand nachgezogen werden müssen.
3. **GUIDs der OS-Formulare:** Sind die GUIDs der OS-Standardformulare (z. B. `649659ef-d708-11e5-b199-0050568f1add` für `OS.Systemische Therapie`) in allen Onkostar-Installationen gleich? Davon hängt ab, ob eine OSC-Datei mit Verknüpfung an allen Standorten unverändert importiert werden kann.

## Für das Projektteam

- Technisch ist „OS-Formular als Basis, nNGM-Formular erbt“ umsetzbar, und zwar komplett über OSC-Dateien ohne Eingriff in die OS-Formulare.
- Die Verknüpfung ist dafür notwendig. Ohne sie behandelt Onkostar den nNGM-Eintrag nicht als Systemtherapie.
- Ob dieser Weg für alle Bögen mit OS-Gegenstück trägt, entscheidet die Antwort auf Frage 1. Falls die Registermeldung verknüpfte Formulare nicht berücksichtigt, bliebe als Ausweg ein kleines Ergänzungsformular: Erfasst wird weiter im OS-Formular, die nNGM-Zusatzfelder kommen in ein eigenes Formular mit Verweis auf den OS-Eintrag. Das kostet einen zweiten Eintrag je Therapie.

Testinstanz: Onkostar 2.14.4 in Docker, MariaDB 10. Testformular und Werkzeug liegen im Projektordner `docker-onkostar` (`osc_nngm/`, `mapping/tools/osc-ableitung.mjs`).