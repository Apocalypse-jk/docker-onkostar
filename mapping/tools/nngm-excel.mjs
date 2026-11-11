// Liest die nNGM-Datensatzbeschreibung (Excel) und schreibt sie als CSV nach mapping/nngm-excel/.
// Nur noch Ergänzung zum Schema (nngm-schema.mjs): Gruppen-Labels, FHIR-Hinweise, Definitionen.
//   node mapping/tools/nngm-excel.mjs [pfad/zur/datei.xlsx]
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { MAPPING_DIR, REPO_DIR, readXlsx, writeCsv } from './lib.mjs';

const OUT = resolve(MAPPING_DIR, 'nngm-excel');
const SRC_DIR = resolve(REPO_DIR, 'nngm_datensatz');
const src = process.argv[2] ?? resolve(SRC_DIR, readdirSync(SRC_DIR).filter((f) => f.endsWith('.xlsx')).sort().pop());
console.log(`Lese ${src} ...`);
const sheets = readXlsx(src);

// Die ersten beiden Zeilen jedes Blatts sind Überschriften
const body = (name) => sheets[name].slice(2).filter((r) => r.some(Boolean));

// --- Visiten -----------------------------------------------------------------
const visits = body('Visits').map((r) => ({
  id: r[1], code: r[2], typ: r[3], label: r[4], sichtbar: r[5], editierbar: r[6],
}));

// --- Instrumente und ihre Visiten ---------------------------------------------
const instruments = body('Instruments').map((r) => ({ id: r[1], name: r[2], label: r[3], observation: r[4] }));
const visitsOf = new Map();
for (const r of body('Instrument Relations')) {
  if (!visitsOf.has(r[5])) visitsOf.set(r[5], []);
  visitsOf.get(r[5]).push(r[2]);
}

// --- Data Dictionary -----------------------------------------------------------
const dictionary = body('Data Dictionary').map((r) => ({ typ: r[1], code: r[2], label: r[3], anmerkung: r[4] }));
const dictCount = new Map();
for (const d of dictionary) dictCount.set(d.typ, (dictCount.get(d.typ) ?? 0) + 1);

// --- Felder ----------------------------------------------------------------------
// In "Data Fields" stehen Instrumente nur mit Label, das nicht eindeutig ist (z. B. zweimal "Histologie").
// Jedes Instrument bildet aber genau einen zusammenhängenden Block, in derselben Reihenfolge wie im Blatt
// "Instruments" – darüber wird der k-te Block eines Labels dem k-ten Instrument mit diesem Label zugeordnet.
const instrumentsByLabel = new Map();
for (const i of instruments) {
  if (!instrumentsByLabel.has(i.label)) instrumentsByLabel.set(i.label, []);
  instrumentsByLabel.get(i.label).push(i);
}
const visitByLabel = new Map(visits.map((v) => [v.label, v]));

const fields = [];
let blockKey = null, owner = null;
const blocksSeen = new Map();
body('Data Fields').forEach((r, idx) => {
  const [refType, refLabel] = r;
  const key = refType + '|' + refLabel;
  if (key !== blockKey) {
    blockKey = key;
    const k = blocksSeen.get(key) ?? 0;
    blocksSeen.set(key, k + 1);
    if (refType === 'InstrumentDefinition') {
      const inst = instrumentsByLabel.get(refLabel)?.[k];
      if (!inst) throw new Error(`Kein Instrument für Block "${refLabel}" (#${k + 1})`);
      owner = { name: inst.name, visiten: visitsOf.get(inst.name) ?? [] };
    } else if (refType === 'VisitDefinition') {
      const v = visitByLabel.get(refLabel);
      owner = { name: v?.code ?? refLabel, visiten: [v?.code ?? refLabel] };
    } else {
      owner = { name: 'patient', visiten: [] };
    }
  }
  const definition = (r[7] ?? '').replace(/\s*\r?\n\s*/g, ' | ');
  let dict = '', dictSource = '';
  const dd = definition.match(/data dictionary type:\s*([^\s|]+)/)?.[1];
  // "items" verweist bei Autocomplete auf eine ValueSet-URL oder einen Data-Dictionary-Typ
  const items = definition.match(/items:\s*([^\s|]+)/)?.[1];
  const collection = definition.match(/collection:\s*([^\s|]+)/)?.[1];
  const ref = dd ?? items;
  if (ref && dictCount.has(ref)) { dict = ref; dictSource = 'data-dictionary'; }
  else if (ref) { dict = ref; dictSource = /^https?:/.test(dict) ? 'fhir-valueset' : 'unbekannt'; }
  else if (collection) { dict = collection; dictSource = 'nngm-terminologie'; }
  fields.push({
    nr: idx + 1,
    referenz_typ: refType,
    instrument: owner.name,
    instrument_label: refLabel,
    visiten: owner.visiten.join(', '),
    parent: r[2] === '-' ? '' : r[2],
    feld: r[4],
    label: r[5],
    typ: r[6],
    dictionary: dict,
    dictionary_quelle: dictSource,
    anzahl_werte: dictSource === 'data-dictionary' ? dictCount.get(dict) : '',
    definition,
    fhir: r[8],
    fragen: r[9],
    mtb: r[10],
  });
});

// Pfad und Wiederholbarkeit aus der Parent-Kette innerhalb des Instruments.
// Feldnamen wie "date" kommen mehrfach vor (je Marker-Gruppe); Eltern stehen aber immer vor ihren
// Kindern, daher ist der Parent die nächste vorangehende Zeile mit diesem Namen im selben Instrument.
const REPEATING = new Set(['List', 'ListEntry', 'Table', 'TableEntry']);
fields.forEach((f, i) => {
  for (let j = i - 1; j >= 0 && fields[j].instrument === f.instrument; j--) {
    if (fields[j].feld === f.parent) { f.parentRow = fields[j]; break; }
  }
  if (f.parent && !f.parentRow) console.warn(`  Warnung: Parent "${f.parent}" von ${f.instrument}/${f.feld} nicht gefunden`);
});
for (const f of fields) {
  const path = [];
  let repeating = false;
  for (let p = f.parentRow; p; p = p.parentRow) {
    path.unshift(p.feld);
    if (REPEATING.has(p.typ)) repeating = true;
  }
  f.pfad = path.join(' > ');
  f.wiederholbar = repeating ? 'ja' : 'nein';
  f.schluessel = [f.instrument, ...path, f.feld].join('/');
}
const keys = new Set(fields.map((f) => f.schluessel));
if (keys.size !== fields.length) console.warn(`  Warnung: ${fields.length - keys.size} Schlüssel sind nicht eindeutig`);

const fieldCount = new Map();
for (const f of fields) fieldCount.set(f.instrument, (fieldCount.get(f.instrument) ?? 0) + 1);
for (const i of instruments) {
  i.visiten = (visitsOf.get(i.name) ?? []).join(', ');
  i.anzahl_felder = fieldCount.get(i.name) ?? 0;
}

writeCsv(resolve(OUT, 'visiten.csv'), ['id', 'code', 'typ', 'label', 'sichtbar', 'editierbar'], visits);
writeCsv(resolve(OUT, 'instrumente.csv'), ['id', 'name', 'label', 'observation', 'visiten', 'anzahl_felder'], instruments);
writeCsv(resolve(OUT, 'felder.csv'),
  ['nr', 'schluessel', 'referenz_typ', 'instrument', 'instrument_label', 'visiten', 'pfad', 'parent', 'feld', 'label', 'typ',
    'wiederholbar', 'dictionary', 'dictionary_quelle', 'anzahl_werte', 'definition', 'fhir', 'fragen', 'mtb'], fields);
writeCsv(resolve(OUT, 'dictionary.csv'), ['typ', 'code', 'label', 'anmerkung'], dictionary);
console.log('Fertig.');
