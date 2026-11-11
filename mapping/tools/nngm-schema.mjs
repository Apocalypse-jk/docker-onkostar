// Liest das nNGM-eCRF-Importschema (XSD) und schreibt den Datensatz nach mapping/nngm-datensatz/.
//   node mapping/tools/nngm-schema.mjs [pfad/zur/schema.xml]
//
// Das Schema ist die maßgebliche Quelle (siehe entscheidungen.md). Ergänzt wird aus der Excel-Ableitung
// (mapping/nngm-excel/felder.csv, falls vorhanden): Labels von Gruppen, FHIR-Hinweise, Fragen, Definitionen.
// Ausgabe im selben Format wie früher aus der Excel-Datei, plus Schema-Spalten (pflicht, mehrfach, …).
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { MAPPING_DIR, REPO_DIR, readCsv, writeCsv } from './lib.mjs';

const SRC = process.argv[2] ?? resolve(REPO_DIR, 'nngm_schema', 'schema.xml');
const OUT = resolve(MAPPING_DIR, 'nngm-datensatz');
console.log(`Lese ${SRC} ...`);
const xsdText = readFileSync(SRC, 'utf8');

// ---------------------------------------------------------------------------
// Minimaler XML-Parser (für XSD ausreichend: Elemente, Attribute, Text, Kommentare)

function parseXml(text) {
  const root = { name: '#root', attrs: {}, children: [], text: '' };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<(\/?)([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
  const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
  for (const m of text.matchAll(re)) {
    if (m[5] !== undefined) { stack.at(-1).text += decode(m[5]); continue; }
    if (!m[2]) continue;
    if (m[1]) { stack.pop(); continue; }
    const attrs = {};
    for (const a of m[3].matchAll(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) attrs[a[1]] = decode(a[2] ?? a[3]);
    const node = { name: m[2].replace(/^xs:/, ''), attrs, children: [], text: '' };
    stack.at(-1).children.push(node);
    if (!m[4]) stack.push(node);
  }
  return root;
}
const kids = (n, name) => n.children.filter((c) => c.name === name);
const kid = (n, name) => n.children.find((c) => c.name === name);
const docOf = (n) => (kid(kid(n, 'annotation') ?? { children: [] }, 'documentation')?.text ?? '').replace(/\s+/g, ' ').trim();

const schema = kid(parseXml(xsdText), 'schema');
const version = schema.attrs.version;
const complexTypes = new Map(kids(schema, 'complexType').map((t) => [t.attrs.name, t]));
const simpleTypes = new Map(kids(schema, 'simpleType').map((t) => [t.attrs.name, t]));
const typeRef = (el) => el.attrs.type?.replace(/^tns:/, '');

/** Kind-Elemente eines komplexen Typs (sequence/choice/all, auch verschachtelt) */
function elementsOf(complexType) {
  const out = [];
  const walk = (n) => { for (const c of n.children) { if (c.name === 'element') out.push(c); else if (['sequence', 'choice', 'all', 'complexContent', 'extension'].includes(c.name)) walk(c); } };
  walk(complexType);
  return out;
}

/** Einschränkungen eines Elements: benannter oder inline simpleType */
function restrictionOf(el) {
  const st = kid(el, 'simpleType') ?? simpleTypes.get(typeRef(el));
  const r = st && kid(st, 'restriction');
  if (!r) return null;
  const facet = (n) => kid(r, n)?.attrs.value;
  return {
    base: r.attrs.base?.replace(/^xs:/, ''),
    enums: kids(r, 'enumeration').map((e) => ({ code: e.attrs.value, label: docOf(e) })),
    maxLength: facet('maxLength'), minInclusive: facet('minInclusive'), maxInclusive: facet('maxInclusive'),
    pattern: facet('pattern'), fractionDigits: facet('fractionDigits'),
  };
}

// ---------------------------------------------------------------------------
// Wertelisten: benannte Enum-Typen → Dictionary-Name wie in der Excel-Datei (RadiationTargetEnumType → radiationTarget)

const dictionary = new Map();   // name → [{code,label}]
const dictName = (typeName) => typeName.replace(/(Enum|Autocomplete)Type$/, '').replace(/^./, (c) => c.toLowerCase());
function registerDict(name, enums) {
  if (!dictionary.has(name)) dictionary.set(name, enums);
  return name;
}

// ---------------------------------------------------------------------------
// Excel-Ergänzung

const excelPath = resolve(MAPPING_DIR, 'nngm-excel', 'felder.csv');
const excel = new Map(readCsv(excelPath).map((f) => [f.schluessel, f]));
const excelInstruments = new Map(readCsv(resolve(MAPPING_DIR, 'nngm-excel', 'instrumente.csv')).map((i) => [i.name, i]));
if (!excel.size) console.warn('  Hinweis: keine Excel-Ableitung gefunden – Gruppen-Labels fehlen');

// ---------------------------------------------------------------------------
// Baum ablaufen

const fields = [];
const instruments = new Map();
const visits = new Map();

/**
 * Klassifiziert ein Element anhand der Dokumentation und des Typs.
 * Liefert { typ, label, dictionary, terminology, reference, … } oder null für reine Container (Gruppe).
 */
function classify(el) {
  const doc = docOf(el);
  const ct = complexTypes.get(typeRef(el)) ?? kid(el, 'complexType');
  let m;
  if ((m = doc.match(/^Liste: '([^']*)'/))) return { typ: 'List', label: m[1] };
  if ((m = doc.match(/^Listeneintrag: '([^']*)'/))) return { typ: 'ListEntry', label: m[1] };
  if ((m = doc.match(/^Tabelle: '([^']*)'/))) return { typ: 'Table', label: m[1] };
  if ((m = doc.match(/^Tabelleneintrag: '([^']*)'/))) return { typ: 'TableEntry', label: m[1] };
  if (el.attrs.name === 'id' && /eindeutige Id des Listeneintrags/.test(doc)) return { typ: 'EntryId', label: 'ID des Listeneintrags', leaf: true };
  if (/^Eindeutige ID des nNGM-Falles/.test(doc)) return { typ: 'EntryId', label: 'ID des nNGM-Falls', leaf: true, beschreibung: doc };
  // Labels können selbst Apostrophe enthalten ('5' Fusionspartner Exon') – daher bis zum ersten "' - "
  if ((m = doc.match(/^Datenfeld: '(.+?)' - (.*)$/))) {
    const [, label, rest] = m;
    const info = { label, leaf: true, beschreibung: rest };
    let t;
    // "terminology 'gene' based enumeration" / "… based code" / "… based list of codes" (= Mehrfachauswahl)
    if ((t = rest.match(/terminology '?(\w+)'? based (list of codes|enumeration|code)/))) {
      info.typ = 'Terminology'; info.terminology = t[1];
      if (t[2] === 'list of codes') info.mehrfach = 'ja';
    }
    else if ((t = rest.match(/entspricht der Id des zu referenzierenten Datenfeldlisteneintrag: '([^']*)' im Instrument '([^']*)'/))) {
      info.typ = 'ListEntryReference'; info.reference = `${t[2]}/${t[1]}`;
    } else if ((t = rest.match(/^Typ: (\w+)/))) info.typ = t[1];
    else info.typ = 'FreeText';
    // Werteliste: Enum-Typ direkt oder als <value> eines Autocomplete-/MultipleChoice-Typs
    const valueEl = ct && elementsOf(ct).find((e) => e.attrs.name === 'value');
    const enumEl = valueEl ?? el;
    const r = restrictionOf(enumEl);
    if (r?.enums.length) {
      const tn = typeRef(enumEl);
      info.dictionary = registerDict(tn ? dictName(tn) : `${el.attrs.name}`, r.enums);
    }
    if (valueEl) info.mehrfach = valueEl.attrs.maxOccurs === 'unbounded' ? 'ja' : 'nein';
    if (r) Object.assign(info, { maxLength: r.maxLength, min: r.minInclusive, max: r.maxInclusive, pattern: r.pattern, base: r.base });
    if (ct && !valueEl) info.struktur = elementsOf(ct).map((e) => e.attrs.name).join(','); // z. B. NngmNetworkLocation
    return info;
  }
  if (ct) return { typ: 'FieldGroup', label: '' };
  return { typ: 'Unbekannt', label: doc, leaf: true };
}

function walk(el, ctx) {
  const info = classify(el);
  const path = [...ctx.path, el.attrs.name];
  const schluessel = [ctx.instrument, ...path].join('/');
  const ex = excel.get(schluessel);
  const typ = info.typ;
  const repeating = ctx.repeating || ['ListEntry', 'TableEntry'].includes(typ);
  const definition = [
    info.maxLength && `maximal length: ${info.maxLength}`,
    info.min && `minimal: ${info.min}`, info.max && `maximal: ${info.max}`,
    info.pattern && `pattern: ${info.pattern}`,
    info.reference && `reference: ${info.reference}`,
    info.terminology && `terminology: ${info.terminology}`,
    info.struktur && `struktur: ${info.struktur}`,
  ].filter(Boolean).join(' | ');
  fields.push({
    schluessel,
    referenz_typ: ctx.instrument === 'patient' ? 'PatientDefinition' : 'InstrumentDefinition',
    instrument: ctx.instrument,
    instrument_label: ctx.instrumentLabel,
    visiten: ctx.visit,
    pfad: ctx.path.join(' > '),
    parent: ctx.path.at(-1) ?? '',
    feld: el.attrs.name,
    label: info.label || ex?.label || el.attrs.name,
    typ,
    wiederholbar: ctx.repeating ? 'ja' : 'nein',
    dictionary: info.dictionary ?? (info.terminology ? info.terminology : ''),
    dictionary_quelle: info.dictionary ? 'schema' : info.terminology ? 'nngm-terminologie' : '',
    anzahl_werte: info.dictionary ? dictionary.get(info.dictionary).length : '',
    pflicht: el.attrs.minOccurs === '0' ? 'nein' : 'ja',
    mehrfach: info.mehrfach ?? (el.attrs.maxOccurs === 'unbounded' ? 'ja' : 'nein'),
    definition: [definition, ex?.definition && `Excel: ${ex.definition}`].filter(Boolean).join(' | '),
    excel_typ: ex?.typ ?? '',
    in_excel: ex ? 'ja' : 'nein',
    fhir: ex?.fhir ?? '',
    fragen: ex?.fragen ?? '',
    mtb: ex?.mtb ?? '',
  });
  if (info.leaf) return;
  const ct = complexTypes.get(typeRef(el)) ?? kid(el, 'complexType');
  if (!ct) return;
  for (const child of elementsOf(ct)) walk(child, { ...ctx, path, repeating });
}

function walkInstrument(el, visit) {
  const name = el.attrs.name;
  const ct = complexTypes.get(typeRef(el));
  const label = docOf(el).match(/^Instrument: '([^']*)'/)?.[1] ?? excelInstruments.get(name)?.label ?? name;
  const inst = instruments.get(name) ?? { name, label, visiten: new Set(), anzahl_felder: 0 };
  if (visit) inst.visiten.add(visit);
  if (instruments.has(name)) return;    // jedes Instrument nur einmal ausgeben
  instruments.set(name, inst);
  const before = fields.length;
  for (const child of elementsOf(ct)) walk(child, { instrument: name, instrumentLabel: label, visit: visit ?? '', path: [], repeating: false });
  inst.anzahl_felder = fields.length - before;
}

const medical = complexTypes.get('MedicalDataType');
for (const el of elementsOf(medical)) {
  const t = typeRef(el);
  if (t?.endsWith('InstrumentType')) walkInstrument(el, '');
  else if (el.attrs.name === 'patient') walkInstrument(el, '');
  else {
    // Visite (z. B. nngm-case): Kind-Instrumente und eigene Felder
    const visitCode = el.attrs.name;
    const vt = complexTypes.get(t);
    visits.set(visitCode, { code: visitCode, label: docOf(el) || excelInstruments.get(visitCode)?.label || visitCode, typ: t, mehrfach: el.attrs.maxOccurs === 'unbounded' ? 'ja' : 'nein' });
    const ownFields = [];
    for (const child of elementsOf(vt)) {
      if (typeRef(child)?.endsWith('InstrumentType')) walkInstrument(child, visitCode);
      else ownFields.push(child);
    }
    if (ownFields.length) {
      const inst = { name: visitCode, label: visits.get(visitCode).label, visiten: new Set([visitCode]), anzahl_felder: 0 };
      instruments.set(visitCode, inst);
      const before = fields.length;
      for (const child of ownFields) walk(child, { instrument: visitCode, instrumentLabel: inst.label, visit: visitCode, path: [], repeating: false });
      inst.anzahl_felder = fields.length - before;
    }
  }
}
for (const f of fields) f.visiten = [...(instruments.get(f.instrument)?.visiten ?? [])].join(', ');

// ---------------------------------------------------------------------------
// Ausgabe

fields.forEach((f, i) => { f.nr = i + 1; });
const keys = new Set(fields.map((f) => f.schluessel));
if (keys.size !== fields.length) console.warn(`  Warnung: ${fields.length - keys.size} Schlüssel nicht eindeutig`);

writeCsv(resolve(OUT, 'visiten.csv'), ['code', 'label', 'typ', 'mehrfach'], [...visits.values()]);
writeCsv(resolve(OUT, 'instrumente.csv'), ['name', 'label', 'visiten', 'anzahl_felder'],
  [...instruments.values()].map((i) => ({ ...i, visiten: [...i.visiten].join(', ') })));
writeCsv(resolve(OUT, 'felder.csv'),
  ['nr', 'schluessel', 'referenz_typ', 'instrument', 'instrument_label', 'visiten', 'pfad', 'parent', 'feld', 'label', 'typ',
    'wiederholbar', 'pflicht', 'mehrfach', 'dictionary', 'dictionary_quelle', 'anzahl_werte', 'definition',
    'excel_typ', 'in_excel', 'fhir', 'fragen', 'mtb'], fields);
writeCsv(resolve(OUT, 'dictionary.csv'), ['typ', 'code', 'label', 'anmerkung'],
  [...dictionary].flatMap(([typ, values]) => values.map((v) => ({ typ, code: v.code, label: v.label, anmerkung: '' }))));

// Abgleich mit der Excel-Ableitung
const onlyExcel = [...excel.values()].filter((f) => !keys.has(f.schluessel) && f.referenz_typ === 'InstrumentDefinition');
const typeCount = {};
for (const f of fields) typeCount[f.typ] = (typeCount[f.typ] ?? 0) + 1;
console.log(`Schema-Version ${version}: ${instruments.size} Instrumente, ${fields.length} Felder, ${dictionary.size} Wertelisten`);
console.log('  Typen: ' + Object.entries(typeCount).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}=${n}`).join(', '));
console.log(`  Nur im Schema: ${fields.filter((f) => f.in_excel === 'nein').length} Felder; nur in Excel: ${onlyExcel.length} Felder`);
