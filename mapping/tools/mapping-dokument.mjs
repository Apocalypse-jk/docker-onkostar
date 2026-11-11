// Erzeugt mapping/MAPPING.md – das zentrale Mapping-Dokument – aus feld-mapping.csv, werte-mapping.csv und
// entscheidungen.md. Nach jeder Änderung an diesen Dateien neu ausführen:
//   node mapping/tools/mapping-dokument.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { MAPPING_DIR, readCsv } from './lib.mjs';

const felder = readCsv(resolve(MAPPING_DIR, 'feld-mapping.csv'));
const werte = readCsv(resolve(MAPPING_DIR, 'werte-mapping.csv'));
const instrumente = readCsv(resolve(MAPPING_DIR, 'nngm-datensatz', 'instrumente.csv'));
const entscheidungen = readFileSync(resolve(MAPPING_DIR, 'entscheidungen.md'), 'utf8').replace(/\r\n/g, '\n');

const STATUS = ['bestätigt', 'vorläufig', 'unvollständig', 'ungelöst', 'offen'];
const STATUS_TEXT = {
  bestätigt: 'Zuordnung stimmt',
  vorläufig: 'stimmt vermutlich, Restfrage im Kommentar',
  unvollständig: 'Ziel stimmt, deckt aber nicht alle nNGM-Werte ab',
  ungelöst: 'Lösung muss noch gefunden werden',
  offen: 'noch nicht besprochen',
};
// Themengruppen: Bögen und die zugehörigen Entscheidungsabschnitte aus entscheidungen.md
const GRUPPEN = [
  { titel: 'Stammdaten, Vitalstatus und Fall', e: ['E-7'], boegen: ['nngm-case', 'patient', 'healthCoverage', 'vitalStatus', 'smokerStatus', 'ecog'] },
  { titel: 'Diagnose, Stadium und Histologie', e: ['E-1', 'E-2'], boegen: ['tumorDiagnosis', 'tumorStage', 'histology', 'diagnosticHistology'] },
  { titel: 'Tumormaterial', e: ['E-3'], boegen: ['tumorMaterial'] },
  { titel: 'Therapien', e: ['E-4', 'E-5', 'E-6'], boegen: ['systemicTherapy', 'operationTherapy', 'radioTherapy'] },
  { titel: 'Verlauf und Molekularpathologie', e: ['E-9'], boegen: ['progressRezidiv', 'lungPanel', 'ngsFusion', 'fastTrack', 'liquidBiopsy', 'resistanceTesting', 'ishFish', 'immunohistochemistry', 'preliminaryFindingsImmunohistochemistry', 'otherExamination', 'preliminaryOtherExaminations'] },
  { titel: 'nNGM-spezifische Bögen', e: ['E-10'], boegen: ['diagnosticsRequest', 'assessment', 'TherapyInformation', 'nngmPortal', 'impalux', 'consents'] },
];

// ---------------------------------------------------------------------------
// Helfer

const statusOf = (r) => r.status || 'offen';
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
// wie GitHub/VS Code: Kleinbuchstaben, Satzzeichen weg, jedes Leerzeichen → '-'
const anker = (s) => s.toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, '').replace(/ /g, '-');
const zaehle = (rows) => Object.fromEntries(STATUS.map((s) => [s, rows.filter((r) => statusOf(r) === s).length]));
const label = (name) => instrumente.find((i) => i.name === name)?.label ?? name;
const istStruktur = (r) => r.kategorie === 'Struktur' || (!r.kategorie && ['List', 'ListEntry', 'FieldGroup', 'Table', 'TableEntry'].includes(r.nngm_typ));
const relPfad = (r) => r.nngm_schluessel.slice(r.nngm_instrument.length + 1);
const ziel = (r) => [r.os_formular, r.os_feld && `→ ${r.os_feld}`, r.os_merkmalskatalog && `(${r.os_merkmalskatalog})`].filter(Boolean).join(' ');

/** Abschnitt „## <Titel>“ aus entscheidungen.md, Überschriften um `tiefer` Ebenen tiefer gesetzt */
function abschnitt(start, tiefer = 1, nurUnter = null) {
  const lines = entscheidungen.split('\n');
  const i = lines.findIndex((l) => l.startsWith(start));
  if (i < 0) throw new Error(`Abschnitt „${start}“ fehlt in entscheidungen.md`);
  const level = start.match(/^#+/)[0].length;
  let j = i + 1;
  while (j < lines.length && !(lines[j].match(/^#+ /) && lines[j].match(/^#+/)[0].length <= level)) j++;
  let body = lines.slice(nurUnter ? i : i + 1, j);
  if (nurUnter) body = body.slice(1);
  return body.map((l) => (l.match(/^#+ /) ? '#'.repeat(tiefer) + l : l)).join('\n').trim();
}
const eTitel = (e) => entscheidungen.split('\n').find((l) => l.startsWith(`## ${e}:`)).replace(/^## /, '').replace(/\s{2,}\(.*\)$/, '').trim();
const eDatum = (e) => (entscheidungen.split('\n').find((l) => l.startsWith(`## ${e}:`)).match(/\(([^)]*)\)\s*$/) || [])[1] ?? '';

// ---------------------------------------------------------------------------
// Dokument

const out = [];
const heute = new Date().toISOString().slice(0, 10);
const gesamt = zaehle(felder);
out.push(`# nNGM → Onkostar: Mapping

Zentrales Mapping-Dokument: wie jedes Feld des nNGM-Datensatzes in Onkostar abgebildet wird, was entschieden ist
und was noch offen ist.

> **Erzeugt** am ${heute} mit \`node mapping/tools/mapping-dokument.mjs\` aus \`feld-mapping.csv\`,
> \`werte-mapping.csv\` und \`entscheidungen.md\`. Nicht von Hand bearbeiten – Änderungen in den Quelldateien
> vornehmen (Feldentscheidungen per \`node mapping/tools/entscheidung.mjs\`) und das Dokument neu erzeugen.

Grundlage: nNGM-eCRF-Importschema \`nngm_schema/schema.xml\` (Version 1.39.1.1139), Onkostar 2.14.4.

## Inhalt

- [Gesamtstand](#gesamtstand)
- [Legende](#legende)
- [Generelle Informationen und Fragen](#generelle-informationen-und-fragen)
${GRUPPEN.map((g) => `- [${g.titel}](#${anker(g.titel)})\n${g.boegen.map((b) => `  - [${label(b)} (\`${b}\`)](#${anker(`${label(b)} ${b}`)})`).join('\n')}`).join('\n')}

## Gesamtstand

| Status | Felder | Anteil |
|---|---:|---:|
${STATUS.map((s) => `| ${s} | ${gesamt[s]} | ${Math.round((gesamt[s] / felder.length) * 100)} % |`).join('\n')}
| **gesamt** | **${felder.length}** | |

| Bogen | Felder | bestätigt | vorläufig | unvollständig | ungelöst | offen | Entscheidung |
|---|---:|---:|---:|---:|---:|---:|---|
${GRUPPEN.flatMap((g) => g.boegen.map((b) => {
  const z = zaehle(felder.filter((r) => r.nngm_instrument === b));
  const n = felder.filter((r) => r.nngm_instrument === b).length;
  return `| [${label(b)}](#${anker(`${label(b)} ${b}`)}) | ${n} | ${STATUS.map((s) => z[s] || '').join(' | ')} | ${g.e.join(', ')} |`;
})).join('\n')}

## Legende

**Status**

| Status | Bedeutung |
|---|---|
${STATUS.map((s) => `| ${s} | ${STATUS_TEXT[s]} |`).join('\n')}

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

- Jedes nNGM-Feld bekommt in \`feld-mapping.csv\` Kategorie, Onkostar-Ziel (Formular, Datenkatalog, Feld,
  Merkmalskatalog), Status und Bemerkung. Werteübersetzungen stehen in \`werte-mapping.csv\`.
- **Richtung:** Das Mapping beschreibt den Weg Onkostar → nNGM (Export ins nNGM-Importformat).
- **Erfassung:** OS-Standardformulare als Basis, nNGM-Formulare erben davon (E-8); nNGM-Ausprägungen für neue Felder
  (E-0); nNGM-spezifische Bögen als eigene Formulare (E-10).
- Werkzeuge und Datenmodell: siehe \`mapping/README.md\`, OSC-Format: \`osc_exports/OSC-FORMAT.md\`.

### Grundsatzentscheidungen

#### ${eTitel('E-8')} (${eDatum('E-8')})

${abschnitt('## E-8:', 2)}

#### ${eTitel('E-0')} (${eDatum('E-0')})

${abschnitt('## E-0:', 2)}

#### ${eTitel('E-11')} (${eDatum('E-11')})

${abschnitt('## E-11:', 2)}

### Gestellte Rückfragen

${abschnitt('## Gestellte Rückfragen', 2)}

### Allgemeine offene Fragen

${abschnitt('## Offene Fragen', 2)}
`);

// ---------------------------------------------------------------------------
// Bögen

const werteVon = (key) => werte.filter((w) => w.nngm_schluessel === key);
const zeilen = (rows) => rows.map((r) => `| \`${cell(relPfad(r))}\` | ${cell(r.nngm_label)} | ${cell(r.nngm_typ)}${r.nngm_mehrfach === 'ja' ? ' (mehrfach)' : ''} | ${cell(r.kategorie)} | ${cell(ziel(r))} | ${cell(r.kommentar)} |`).join('\n');
const KOPF = '| Feld | Label | nNGM-Typ | Kat. | Onkostar-Ziel | Bemerkung |\n|---|---|---|---|---|---|';

for (const g of GRUPPEN) {
  out.push(`## ${g.titel}\n`);
  for (const e of g.e) {
    out.push(`<details>\n<summary><b>${e}</b> – ${cell(eTitel(e).replace(/^E-\d+: /, ''))} (${eDatum(e)})</summary>\n\n${abschnitt(`## ${e}:`, 3)}\n\n</details>\n`);
  }
  for (const b of g.boegen) {
    const rows = felder.filter((r) => r.nngm_instrument === b);
    const z = zaehle(rows);
    const daten = rows.filter((r) => !istStruktur(r));
    const struktur = rows.filter(istStruktur);
    out.push(`### ${label(b)} (\`${b}\`)\n`);
    out.push(`${rows.length} Felder – ${STATUS.filter((s) => z[s]).map((s) => `${z[s]} ${s}`).join(', ')}. Entscheidungen: ${g.e.join(', ')}.\n`);
    for (const s of STATUS) {
      const teil = daten.filter((r) => statusOf(r) === s);
      if (!teil.length) continue;
      out.push(`#### ${s[0].toUpperCase() + s.slice(1)} (${teil.length})\n\n${KOPF}\n${zeilen(teil)}\n`);
    }
    if (struktur.length) {
      out.push(`<details>\n<summary>Strukturelemente (${struktur.length}: Listen, Gruppen, Listeneinträge)</summary>\n\n${KOPF}\n${zeilen(struktur)}\n\n</details>\n`);
    }
    const mitWerten = rows.filter((r) => werteVon(r.nngm_schluessel).length);
    if (mitWerten.length) {
      out.push(`#### Werteübersetzungen\n`);
      for (const r of mitWerten) {
        out.push(`**\`${relPfad(r)}\`** – ${cell(r.nngm_label)}\n\n| nNGM-Code | nNGM-Label | Onkostar-Katalog | Version | Onkostar-Code | Onkostar-Text | Status | Bemerkung |\n|---|---|---|---|---|---|---|---|\n${werteVon(r.nngm_schluessel).map((w) => `| ${cell(w.nngm_code)} | ${cell(w.nngm_label)} | ${cell(w.os_merkmalskatalog)} | ${cell(w.os_version)} | ${cell(w.os_code)} | ${cell(w.os_text)} | ${cell(w.status)} | ${cell(w.kommentar)} |`).join('\n')}\n`);
      }
    }
  }
}

const fehlend = [...new Set(felder.map((r) => r.nngm_instrument))].filter((i) => !GRUPPEN.some((g) => g.boegen.includes(i)));
if (fehlend.length) throw new Error(`Bögen ohne Gruppe: ${fehlend.join(', ')}`);
const verwaist = [...new Set(werte.map((w) => w.nngm_schluessel))].filter((k) => !felder.some((r) => r.nngm_schluessel === k));
if (verwaist.length) console.warn(`Warnung: Werteübersetzungen ohne Feld: ${verwaist.join(', ')}`);

const text = out.join('\n').replace(/\n{3,}/g, '\n\n');
writeFileSync(resolve(MAPPING_DIR, 'MAPPING.md'), text);
console.log(`mapping/MAPPING.md (${(text.length / 1024).toFixed(0)} KB, ${felder.length} Felder, ${werte.length} Werteübersetzungen)`);
