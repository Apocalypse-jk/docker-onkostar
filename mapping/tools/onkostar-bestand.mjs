// Exportiert Formulare, Datenkataloge und Merkmalskataloge aus der Onkostar-Datenbank
// nach mapping/onkostar-bestand/*.csv.
//   node mapping/tools/onkostar-bestand.mjs
import { resolve } from 'node:path';
import { MAPPING_DIR, query, writeCsv } from './lib.mjs';

const OUT = resolve(MAPPING_DIR, 'onkostar-bestand');
// Große Terminologien (ICD, OPS, ...) werden nur gezählt, nicht mit allen Werten exportiert.
const MAX_WERTE = 2000;

console.log('Lese Onkostar-Metadaten ...');

// Aktuelle Version je Merkmalskatalog = höchste aktive Versionsnummer
const pcVersions = query(`
  SELECT pc.id pc_id, pcv.id version_id, pcv.version_number, pcv.valid_from,
         (SELECT COUNT(*) FROM property_catalogue_version_entry e WHERE e.property_version_id = pcv.id) anzahl_werte
  FROM property_catalogue pc
  JOIN property_catalogue_version pcv ON pcv.datacatalog_id = pc.id
  WHERE pcv.version_number = (SELECT MAX(x.version_number) FROM property_catalogue_version x
                              WHERE x.datacatalog_id = pc.id AND x.aktiv = 1)`);
const currentVersion = new Map(pcVersions.map((v) => [v.pc_id, v]));

const columns = new Set(query(`
  SELECT CONCAT(table_name, '.', column_name) c FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name LIKE 'dk\\_%'`).map((r) => r.c.toLowerCase()));

// --- Datenkatalog-Felder -----------------------------------------------------
const dcEntries = query(`
  SELECT dce.id, dc.name datenkatalog, dce.name feld, dce.description beschreibung, dce.type typ,
         pc.name merkmalskatalog, dce.is_multiple_choice mehrfachauswahl, dce.max_length max_laenge,
         dce.range_from wert_von, dce.range_until wert_bis, dce.scale_unit einheit, dce.is_active aktiv,
         (SELECT GROUP_CONCAT(DISTINCT f.name ORDER BY f.name SEPARATOR ', ')
            FROM data_form_entry e JOIN data_form f ON f.id = e.data_form_id
           WHERE e.data_catalogue_entry_id = dce.id) verwendet_in_formularen
  FROM data_catalogue_entry dce
  JOIN data_catalogue dc ON dc.id = dce.data_catalogue_id
  LEFT JOIN property_catalogue pc ON pc.id = dce.property_catalogue_version_entry_id
  ORDER BY dc.name, dce.position, dce.id`);
for (const e of dcEntries) {
  e.tabelle = 'dk_' + e.datenkatalog.toLowerCase();
  e.spalte = e.feld.toLowerCase();
  if (e.mehrfachauswahl === '1') {
    // Mehrfachauswahl: eine Zeile je Wert in dk_<katalog>_merkmale (eintrag_id, feldname, feldwert)
    e.tabelle += '_merkmale';
    e.spalte = `feldwert (feldname='${e.feld}')`;
    e.spalte_vorhanden = columns.has(`${e.tabelle}.feldwert`) ? 'ja' : 'nein';
  } else {
    e.spalte_vorhanden = columns.has(`${e.tabelle}.${e.spalte}`) ? 'ja' : 'nein';
  }
}
writeCsv(resolve(OUT, 'datenkatalog-felder.csv'),
  ['id', 'datenkatalog', 'feld', 'beschreibung', 'typ', 'merkmalskatalog', 'mehrfachauswahl', 'max_laenge',
    'wert_von', 'wert_bis', 'einheit', 'aktiv', 'tabelle', 'spalte', 'spalte_vorhanden', 'verwendet_in_formularen'],
  dcEntries);

// --- Datenkataloge ------------------------------------------------------------
const catalogues = query(`
  SELECT dc.id, dc.name, dc.description beschreibung, dc.is_active aktiv,
         (SELECT COUNT(*) FROM data_catalogue_entry x WHERE x.data_catalogue_id = dc.id) anzahl_felder,
         (SELECT GROUP_CONCAT(f.name ORDER BY f.name SEPARATOR ', ')
            FROM data_form_data_catalogue dfdc JOIN data_form f ON f.id = dfdc.data_form_id
           WHERE dfdc.data_catalogue_id = dc.id) formulare
  FROM data_catalogue dc ORDER BY dc.name`);
const tables = new Set([...columns].map((c) => c.split('.')[0]));
for (const c of catalogues) {
  c.tabelle = 'dk_' + c.name.toLowerCase();
  c.tabelle_vorhanden = tables.has(c.tabelle) ? 'ja' : 'nein';
}
writeCsv(resolve(OUT, 'datenkataloge.csv'),
  ['id', 'name', 'beschreibung', 'aktiv', 'anzahl_felder', 'tabelle', 'tabelle_vorhanden', 'formulare'], catalogues);

// --- Formulare ----------------------------------------------------------------
const forms = query(`
  SELECT f.id, f.name, f.description beschreibung, f.is_active aktiv, f.formular_version version,
         mc.name menue_kategorie,
         (SELECT GROUP_CONCAT(dc.name ORDER BY dc.name SEPARATOR ', ')
            FROM data_form_data_catalogue x JOIN data_catalogue dc ON dc.id = x.data_catalogue_id
           WHERE x.data_form_id = f.id) datenkataloge,
         (SELECT COUNT(*) FROM data_form_entry e WHERE e.data_form_id = f.id AND e.data_catalogue_entry_id IS NOT NULL) anzahl_datenfelder,
         (SELECT GROUP_CONCAT(DISTINCT u.name ORDER BY u.name SEPARATOR ', ')
            FROM data_form_entry e JOIN data_form u ON u.id = e.referenced_data_form
           WHERE e.data_form_id = f.id AND e.type = 'subform') unterformulare,
         (SELECT GROUP_CONCAT(DISTINCT p.name ORDER BY p.name SEPARATOR ', ')
            FROM data_form_entry e JOIN data_form p ON p.id = e.data_form_id
           WHERE e.referenced_data_form = f.id AND e.type = 'subform') unterformular_von
  FROM data_form f
  LEFT JOIN data_form_menu_category mc ON mc.id = f.df_menu_category_id
  ORDER BY f.name`);
writeCsv(resolve(OUT, 'formulare.csv'),
  ['id', 'name', 'beschreibung', 'aktiv', 'version', 'menue_kategorie', 'datenkataloge', 'anzahl_datenfelder',
    'unterformulare', 'unterformular_von'], forms);

// --- Formular-Felder (Layout: Abschnitte, Gruppen, Unterformulare, Datenfelder) ---
const formEntries = query(`
  SELECT e.id, f.name formular, e.element_parent_id parent_id, e.position, e.type typ, e.name feld,
         e.description label, e.is_active aktiv, e.is_mandatory pflicht, dce.id datenkatalog_feld_id,
         dc.name datenkatalog, dce.name datenkatalog_feld, dce.type datenkatalog_typ, pc.name merkmalskatalog,
         rf.name referenziertes_formular
  FROM data_form_entry e
  JOIN data_form f ON f.id = e.data_form_id
  LEFT JOIN data_catalogue_entry dce ON dce.id = e.data_catalogue_entry_id
  LEFT JOIN data_catalogue dc ON dc.id = dce.data_catalogue_id
  LEFT JOIN property_catalogue pc ON pc.id = dce.property_catalogue_version_entry_id
  LEFT JOIN data_form rf ON rf.id = e.referenced_data_form
  ORDER BY f.name, e.position, e.id`);
const byId = new Map(formEntries.map((e) => [e.id, e]));
const dcById = new Map(dcEntries.map((e) => [e.id, e]));
for (const e of formEntries) {
  const path = [];
  for (let p = byId.get(e.parent_id); p && path.length < 10; p = byId.get(p.parent_id)) path.unshift(p.label || p.feld);
  e.bereich = path.join(' > ');
  const dce = dcById.get(e.datenkatalog_feld_id);
  if (dce) {
    e.tabelle = dce.tabelle;
    e.spalte = dce.spalte;
  }
}
writeCsv(resolve(OUT, 'formular-felder.csv'),
  ['id', 'formular', 'bereich', 'position', 'typ', 'feld', 'label', 'aktiv', 'pflicht', 'datenkatalog',
    'datenkatalog_feld', 'datenkatalog_typ', 'merkmalskatalog', 'referenziertes_formular', 'tabelle', 'spalte'],
  formEntries);

// --- Merkmalskataloge -----------------------------------------------------------
const propCats = query(`
  SELECT pc.id, pc.name, pc.description beschreibung, pc.standard,
         (SELECT COUNT(*) FROM property_catalogue_version v WHERE v.datacatalog_id = pc.id) anzahl_versionen,
         (SELECT COUNT(*) FROM data_catalogue_entry dce WHERE dce.property_catalogue_version_entry_id = pc.id) verwendet_in_feldern
  FROM property_catalogue pc ORDER BY pc.name`);
for (const pc of propCats) {
  const v = currentVersion.get(pc.id);
  pc.aktuelle_version = v?.version_number ?? '';
  pc.gueltig_ab = v?.valid_from ?? '';
  pc.anzahl_werte = v?.anzahl_werte ?? 0;
  pc.werte_exportiert = v && +v.anzahl_werte <= MAX_WERTE ? 'ja' : 'nein';
}
writeCsv(resolve(OUT, 'merkmalskataloge.csv'),
  ['id', 'name', 'beschreibung', 'standard', 'anzahl_versionen', 'aktuelle_version', 'gueltig_ab', 'anzahl_werte',
    'werte_exportiert', 'verwendet_in_feldern'], propCats);

const exportIds = pcVersions.filter((v) => +v.anzahl_werte <= MAX_WERTE).map((v) => v.version_id);
const values = exportIds.length ? query(`
  SELECT pc.name merkmalskatalog, pcv.version_number version, e.code, e.shortdesc kurztext, e.description beschreibung,
         e.parent_code, e.position
  FROM property_catalogue_version_entry e
  JOIN property_catalogue_version pcv ON pcv.id = e.property_version_id
  JOIN property_catalogue pc ON pc.id = pcv.datacatalog_id
  WHERE pcv.id IN (${exportIds.join(',')})
  ORDER BY pc.name, e.position, e.code`) : [];
writeCsv(resolve(OUT, 'merkmalskatalog-werte.csv'),
  ['merkmalskatalog', 'version', 'code', 'kurztext', 'beschreibung', 'parent_code', 'position'], values);

console.log('Fertig.');
