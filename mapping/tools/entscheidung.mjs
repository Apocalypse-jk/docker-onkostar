// Trägt eine Mapping-Entscheidung in die Hand-Spalten von feld-mapping.csv ein.
//   node mapping/tools/entscheidung.mjs <nngm_schluessel> spalte=wert [spalte=wert ...]
//   node mapping/tools/entscheidung.mjs tumorDiagnosis/diagnosisList/diagnosis/diagnosisDate status=bestätigt kategorie=A
// Erlaubte Spalten: kategorie, os_formular, os_datenkatalog, os_feld, os_merkmalskatalog, plugin, status, kommentar
import { resolve } from 'node:path';
import { MAPPING_DIR, readCsv, writeCsv } from './lib.mjs';

const COLUMNS = ['kategorie', 'os_formular', 'os_datenkatalog', 'os_feld', 'os_merkmalskatalog', 'plugin', 'status', 'kommentar'];
const STATUS = ['offen', 'bestätigt', 'vorläufig', 'unvollständig', 'ungelöst'];
const KATEGORIEN = ['A', 'B', 'C', 'D', 'X', 'Struktur'];

const [key, ...assignments] = process.argv.slice(2);
if (!key || !assignments.length) throw new Error('Aufruf: entscheidung.mjs <nngm_schluessel> spalte=wert ...');
const path = resolve(MAPPING_DIR, 'feld-mapping.csv');
const rows = readCsv(path);
const row = rows.find((r) => r.nngm_schluessel === key);
if (!row) throw new Error(`Schlüssel nicht gefunden: ${key}`);

for (const a of assignments) {
  const i = a.indexOf('=');
  const col = a.slice(0, i), value = a.slice(i + 1);
  if (!COLUMNS.includes(col)) throw new Error(`Spalte "${col}" nicht erlaubt (${COLUMNS.join(', ')})`);
  if (col === 'status' && !STATUS.includes(value)) throw new Error(`Status "${value}" nicht erlaubt (${STATUS.join(', ')})`);
  if (col === 'kategorie' && value && !KATEGORIEN.includes(value)) throw new Error(`Kategorie "${value}" nicht erlaubt`);
  row[col] = value;
}
writeCsv(path, Object.keys(rows[0]), rows);
console.log(`${key}: ${COLUMNS.filter((c) => row[c]).map((c) => `${c}=${row[c]}`).join(' | ')}`);
