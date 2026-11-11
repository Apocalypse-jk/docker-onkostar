// Zeigt die gespeicherten Formulareinträge (Prozeduren) mit allen befüllten Spalten ihrer dk_-Tabellen.
// Hilfreich, um nach dem Erfassen von Testdaten zu prüfen, wo welcher Wert in der Datenbank landet.
//   node mapping/tools/onkostar-eintraege.mjs [patient_id]
import { query } from './lib.mjs';

const patientId = process.argv[2];
if (patientId && !/^\d+$/.test(patientId)) throw new Error('patient_id muss eine Zahl sein');

const procs = query(`
  SELECT p.id, p.patient_id, p.hauptprozedur_id, p.beginndatum, p.beginnzeitpunkt_acc, f.id form_id, f.name formular,
         ue.name unterformular_feld,
         (SELECT GROUP_CONCAT(ep.erkrankung_id) FROM erkrankung_prozedur ep WHERE ep.prozedur_id = p.id) erkrankungen
  FROM prozedur p
  JOIN data_form f ON f.id = p.data_form_id
  LEFT JOIN data_form_entry ue ON ue.id = p.data_form_entry_id
  WHERE p.geloescht = 0 ${patientId ? `AND p.patient_id = ${patientId}` : ''}
  ORDER BY p.patient_id, p.id`);
const tables = new Set(query(`SELECT table_name t FROM information_schema.tables
  WHERE table_schema = DATABASE() AND table_name LIKE 'dk\\_%'`).map((r) => r.t.toLowerCase()));

for (const p of procs) {
  const parent = p.hauptprozedur_id ? `, Unterformular von ${p.hauptprozedur_id} (Feld ${p.unterformular_feld})` : '';
  console.log(`\n=== Prozedur ${p.id}: ${p.formular} – Patient ${p.patient_id}, Erkrankung ${p.erkrankungen || '-'}, ` +
    `Datum ${p.beginndatum || '-'} (${p.beginnzeitpunkt_acc || '-'})${parent}`);
  const catalogues = query(`SELECT dc.name FROM data_form_data_catalogue x
    JOIN data_catalogue dc ON dc.id = x.data_catalogue_id WHERE x.data_form_id = ${p.form_id}`);
  for (const { name } of catalogues) {
    const t = 'dk_' + name.toLowerCase();
    if (!tables.has(t)) continue;
    const row = query(`SELECT * FROM \`${t}\` WHERE id = ${p.id}`)[0];
    if (row) {
      // _propcat_version wird auch ohne Wert gesetzt – nur zusammen mit einem Wert anzeigen
      const filled = Object.entries(row).filter(([k, v]) => v !== '' && k !== 'id' &&
        !(k.endsWith('_propcat_version') && row[k.slice(0, -'_propcat_version'.length)] === ''));
      console.log(`  ${t}:`);
      for (const [k, v] of filled) console.log(`    ${k} = ${v.length > 80 ? v.slice(0, 80) + '…' : v}`);
    }
    if (tables.has(t + '_merkmale')) {
      const values = query(`SELECT feldname, feldwert FROM \`${t}_merkmale\` WHERE eintrag_id = ${p.id}`);
      if (values.length) {
        console.log(`  ${t}_merkmale:`);
        for (const v of values) console.log(`    ${v.feldname} = ${v.feldwert}`);
      }
    }
  }
}
