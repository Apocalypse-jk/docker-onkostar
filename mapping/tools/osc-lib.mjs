// Gemeinsame Bausteine für OSC-Generatoren (osc-nngm-formular.mjs, osc-ableitung.mjs):
// Vorlagen aus von Onkostar geschriebenen Exporten, XML-Helfer, nNGM-Merkmalskataloge und die Umsetzung einer
// nNGM-Feldliste in Datenkatalog-Felder, Formular-Einträge und Datumsregeln. Siehe osc_exports/OSC-FORMAT.md.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { MAPPING_DIR, REPO_DIR, readCsv } from './lib.mjs';

export const ORDNER = 'nNGM';                     // Ordner in der BENUTZER Bibliothek
export const KATALOG_GUELTIG_AB = '2000-01-01Z';  // damit auch ältere Einträge den Katalog nutzen können
export const SID = '9401';

// ---------------------------------------------------------------------------
// Vorlagen aus Onkostar-Exporten

export const read = (p) => readFileSync(resolve(REPO_DIR, p), 'utf8');
const OS_EXPORT = read('osc_exports/2026-10-19_09-33-57_089_f_export-16.osc');      // OS.UntersuchungEinzel
const MINI_EXPORT = read('osc_exports/2026-10-23_13-34-17_522_f_export-22.osc');    // MiniTest, von Onkostar geschrieben

export function block(xml, tag, marker) {
  const re = new RegExp(`[ \\t]*<${tag}(?:\\s[^>]*)?>(?:(?!<${tag}[\\s>])[\\s\\S])*?</${tag}>`, 'g');
  const found = [...xml.matchAll(re)].map((m) => m[0]).filter((b) => b.includes(marker));
  if (!found.length) throw new Error(`Vorlage <${tag}> mit "${marker}" nicht gefunden`);
  return found[0];
}
const dfEntries = (xml) => xml.slice(xml.indexOf('<DataForm>'));
const dcEntries = (xml) => xml.slice(xml.indexOf('<DataCatalogue>\n'), xml.indexOf('<DataForm>'));

export const T = {
  pc: block(MINI_EXPORT, 'PropertyCatalogue', '<Name>MINI2.Ergebnis</Name>'),
  dcHeader: MINI_EXPORT.slice(MINI_EXPORT.indexOf('<DataCatalogue>\n'), MINI_EXPORT.indexOf('<Entries>', MINI_EXPORT.indexOf('<DataCatalogue>\n'))),
  dcCatalogue: block(dcEntries(MINI_EXPORT), 'Entry', '<Name>Ergebnis</Name>'),
  dcText: block(dcEntries(MINI_EXPORT), 'Entry', '<Name>Testfeld</Name>'),
  dcLongtext: block(dcEntries(MINI_EXPORT), 'Entry', '<Name>Bemerkung</Name>'),
  dcDate: block(dcEntries(MINI_EXPORT), 'Entry', '<Name>Untersuchungsdatum</Name>'),
  feCombobox: block(dfEntries(MINI_EXPORT), 'Entry', '<Name>Ergebnis</Name>'),
  feCheckbox: block(dfEntries(MINI_EXPORT), 'Entry', '<Name>Probe</Name>'),
  feTextfield: block(dfEntries(MINI_EXPORT), 'Entry', '<Name>Testfeld</Name>'),
  feTextarea: block(dfEntries(MINI_EXPORT), 'Entry', '<Name>Bemerkung</Name>'),
  feDate: block(dfEntries(MINI_EXPORT), 'Entry', '<Name>Untersuchungsdatum</Name>'),
  fePropcatLookup: block(dfEntries(OS_EXPORT), 'Entry', '<Name>UntersuchungGrob</Name>'),
  feSection: block(dfEntries(OS_EXPORT), 'Entry', '<Name>Bereich1</Name>'),
  dfHeader: (() => { const s = MINI_EXPORT.indexOf('<DataForm>'); return MINI_EXPORT.slice(s, MINI_EXPORT.indexOf('<Entries>', s)); })(),
  dfFooter: MINI_EXPORT.slice(MINI_EXPORT.indexOf('<Haeufigkeiten'), MINI_EXPORT.indexOf('</DataForm>')),
};
// Unterformular- und Formularverweis-Vorlagen nur bei Bedarf aus dem (großen) Export von OS.Systemische Therapie laden
let sysExport;
const sysDataForm = () => { sysExport ??= read('osc_exports/2026-11-05_13-25-43_184_f_export-25.osc'); return sysExport.slice(sysExport.lastIndexOf('\n      <DataForm>')); };
const sysDataCatalogue = () => { sysDataForm(); return [...sysExport.matchAll(/\n {6}<DataCatalogue>[\s\S]*?\n {6}<\/DataCatalogue>/g)].map((m) => m[0]).find((b) => b.slice(0, 400).includes('<Name>Systemtherapie</Name>')); };
const feSubform = () => block(sysDataForm(), 'Entry', '<Name>SubstanzenList</Name>');
const feFormReference = () => block(sysDataForm(), 'Entry', '<Type>formReference</Type>');
const dcFormReference = () => block(sysDataCatalogue(), 'Entry', '<Type>formReference</Type>');

// ---------------------------------------------------------------------------
// XML-Helfer

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Setzt den Inhalt des ersten <tag> im Block (auch <tag/> und <tag></tag>). Fehler, wenn der Tag fehlt. */
export function set(xml, tag, value) {
  const re = new RegExp(`<${tag}>[\\s\\S]*?</${tag}>|<${tag}\\s*/>`);
  if (!re.test(xml)) throw new Error(`Tag <${tag}> fehlt in Vorlage`);
  return xml.replace(re, `<${tag}>${value}</${tag}>`);
}
export const remove = (xml, tag) => xml.replace(new RegExp(`\\s*<${tag}>[\\s\\S]*?</${tag}>`, 'g'), '');
export const withAttr = (xml, attr) => xml.replace(/<Entry(?:\s[^>]*)?>/, attr ? `<Entry ${attr}>` : '<Entry>');
export function ordner(xml, typ) {
  return xml.replace(/<Ordner>[\s\S]*?<\/Ordner>/, `<Ordner>
            <Bibliothek>
               <Name>BENUTZER Bibliothek</Name>
            </Bibliothek>
            <Name>${ORDNER}</Name>
            <Typ>${typ}</Typ>
         </Ordner>`);
}
/** Gemeinsame Felder: neue GUID, Revision 1, SID */
export const fresh = (xml) => set(set(set(xml, 'GUID', randomUUID()), 'Revision', '1'), 'SID', SID);

// ---------------------------------------------------------------------------
// nNGM-Daten

export const allFields = readCsv(resolve(MAPPING_DIR, 'nngm-datensatz', 'felder.csv'));
const instrumentRows = readCsv(resolve(MAPPING_DIR, 'nngm-datensatz', 'instrumente.csv'));
export const instrumentLabel = (name) => instrumentRows.find((i) => i.name === name)?.label ?? name;
const dictionary = readCsv(resolve(MAPPING_DIR, 'nngm-datensatz', 'dictionary.csv'));
export const valuesOf = (typ) => dictionary.filter((d) => d.typ === typ);
export const catalogName = (dict) => 'NNGM.' + dict;
const def = (f, key) => f.definition?.match(new RegExp(`${key}:\\s*([^|]+?)\\s*(?:\\||$)`))?.[1];

export const CHOICE = new Set(['Enumeration', 'Autocomplete', 'MultipleChoice']);
// nNGM-Wertelisten, die ein OS-Standardkatalog abdeckt: Formulare nutzen den OS-Katalog, die Übersetzung in die
// nNGM-Codes passiert beim Export (E-0, Rückmeldung 11.11.2026; Übersetzung in werte-mapping.csv).
// Eigene Kataloge (NNGM.<typ>) gibt es nur für Wertelisten ohne OS-Gegenstück – mit den nNGM-Codes.
export const OS_KATALOGE = {
  yesNo: { name: 'OS.JaNein', codes: { yes: '1', no: '0' } },
  yesNoUnknown: { name: 'OS.JaNeinUnbekannt', codes: { yes: '1', no: '0', unknown: '9' } },
};
export const katalogFuer = (dict) => OS_KATALOGE[dict]?.name ?? catalogName(dict);
/** Wertelisten (nNGM-Dictionary-Typen), für die eigene NNGM-Kataloge erzeugt werden müssen */
export const dictsOf = (fields) => [...new Set(fields.filter((f) => f.dictionary && ['schema', 'data-dictionary'].includes(f.dictionary_quelle) && !OS_KATALOGE[f.dictionary]).map((f) => f.dictionary))];
/** Filterbedingung mit nNGM-Codes (feld='yes') in die Codes der verwendeten OS-Kataloge übersetzen */
const filterCodes = (condition, fields) => condition.replace(/(\w+)\s*(=|<>)\s*'([^']*)'/g, (m, feld, op, code) => {
  const os = OS_KATALOGE[fields.find((x) => x.feld === feld)?.dictionary];
  return os?.codes[code] !== undefined ? `${feld}${op}'${os.codes[code]}'` : m;
});

// ---------------------------------------------------------------------------
// Merkmalskataloge NNGM.<typ> mit den nNGM-Codes

export function katalogXml(dict) {
  const values = valuesOf(dict);
  if (!values.length) throw new Error(`Werteliste ${dict} ist leer`);
  const long = values.filter((v) => v.code.length > 64);
  if (long.length) throw new Error(`Codes länger als 64 Zeichen in ${dict}: ${long.map((v) => v.code).join(', ')}`);
  const entries = values.map((v, i) => `                  <Entry>
                     <Code>${esc(v.code)}</Code>
                     <ShortDescription>${esc(v.label.slice(0, 255))}</ShortDescription>
                     <Description>${esc(v.label)}</Description>
                     <Synonyms></Synonyms>
                     <Note>${esc(v.anmerkung)}</Note>
                     <Position>${i + 1}.0</Position>
                  </Entry>`).join('\n');
  let xml = T.pc;
  xml = set(xml, 'Name', catalogName(dict));
  xml = set(xml, 'Description', esc(`nNGM: ${dict}`));
  xml = set(xml, 'Anmerkung', esc(`Aus nNGM-Datensatzbeschreibung, Data Dictionary Typ "${dict}"`));
  xml = set(xml, 'SID', SID);
  xml = set(xml, 'GUID', randomUUID());
  xml = set(xml, 'Revision', '1');
  // Version
  xml = xml.replace(/<Version>[\s\S]*<\/Version>/, (v) => {
    v = set(v, 'ValidFrom', KATALOG_GUELTIG_AB);
    v = set(v, 'OID', esc(catalogName(dict) + '.v1'));
    v = set(v, 'Description', 'Version 1');
    v = set(v, 'GUID', randomUUID());
    v = set(v, 'Revision', '1');
    return v.replace(/<Entries>[\s\S]*<\/Entries>/, `<Entries>\n${entries}\n               </Entries>`);
  });
  return ordner(xml, 1);
}

// ---------------------------------------------------------------------------
// Feldliste → Datenkatalog-Felder, Formular-Einträge, Datumsregeln

// Plausibilitätsregeln für die Datumsgrenzen (wie von Onkostar erzeugt)
const rule = (name, suffix, message, formula) => `            <PlausibilityRule>
               <Type>2</Type>
               <Message>${message}</Message>
               <Description>__DatumGrenze_${name}_${suffix}</Description>
               <Bezeichnung>__DatumGrenze_${name}_${suffix}</Bezeichnung>
               <Formula>${formula}</Formula>
               <Active>true</Active>
               <Editable>false</Editable>
               <Valid>true</Valid>
               <Statusauswirkung>0</Statusauswirkung>
               <DataFormEntries>
                  <EntryName>${name}</EntryName>
               </DataFormEntries>
            </PlausibilityRule>`;

let sectionId = 9000;   // parentId-Zähler, eindeutig innerhalb einer Datei

/**
 * spec: { fields, datenkatalog, prozedurdatum, overrides = {}, filter = {}, startPos = 0, sectionIdStart }
 *   fields  nNGM-Feldliste (Zeilen aus felder.csv, ggf. ergänzt um FieldGroup/Subform/Zusatzfelder)
 *   startPos  Positionsversatz für Einträge der obersten Ebene (z. B. hinter den Feldern eines OS-Formulars)
 * Ergebnis: { dcXml[], feXml[], rules[], report[] }
 */
export function eintraege(spec) {
  const { fields: ffields, datenkatalog, prozedurdatum, overrides = {}, filter = {}, startPos = 0 } = spec;
  if (spec.sectionIdStart) sectionId = spec.sectionIdStart;
  const dcXml = [], feXml = [], report = [];
  const sectionIds = new Map();
  const position = new Map([['', startPos]]);   // laufende Position je Eltern-Element
  const nextPos = (parent) => { const p = (position.get(parent) ?? 0) + 1; position.set(parent, p); return `${p}.0`; };
  const listEntry = ffields.find((f) => f.typ === 'ListEntry');
  const indent = (parent) => '  '.repeat(parent ? 2 : 1);

  const kind = new Map();    // FieldGroup → 'section' | 'group'
  const alias = new Map();   // aufgelöste (zu tief verschachtelte) Gruppe → Feldgruppe darüber
  for (const f of ffields) {
    if (f.typ === 'List' || f.typ === 'ListEntry' || f.typ === 'EntryId') continue;
    // Eltern: die FieldGroup direkt über dem Feld (Listen/Listeneinträge entfallen)
    const rawParent = alias.get(f.parent) ?? f.parent;
    const parentGroup = rawParent && rawParent !== listEntry?.feld && sectionIds.has(rawParent) ? rawParent : '';

    if (f.typ === 'FieldGroup') {
      // Onkostar: Abschnitt (section) nur oben, Feldgruppe (group) nur in einem Abschnitt, nichts tiefer
      if (parentGroup && kind.get(parentGroup) === 'group') {
        alias.set(f.feld, parentGroup);
        report.push(`${indent(parentGroup)}(Gruppe ${f.label} aufgelöst in ${parentGroup})`);
        continue;
      }
      const typ = parentGroup ? 'group' : 'section';
      kind.set(f.feld, typ);
      sectionIds.set(f.feld, ++sectionId);
      let e = withAttr(T.feSection, `parentId="${sectionId}"${parentGroup ? ` parentRefId="${sectionIds.get(parentGroup)}"` : ''}`);
      e = remove(remove(e, 'Filter'), 'Scripts');
      e = set(e, 'Type', typ);
      e = set(e, 'Name', esc(f.feld));
      e = set(e, 'Description', esc(f.label));
      e = set(e, 'Position', nextPos(parentGroup));
      e = set(e, 'ElementParent', esc(parentGroup));
      feXml.push(fresh(e));
      report.push(`${indent(parentGroup)}${typ === 'section' ? 'Abschnitt ' : 'Feldgruppe'} ${f.label}`);
      continue;
    }

    if (f.typ === 'Subform') {
      let e = withAttr(feSubform(), parentGroup ? `parentRefId="${sectionIds.get(parentGroup)}"` : '');
      e = remove(e, 'Filter');
      e = set(e, 'Name', esc(f.feld));
      e = set(e, 'Description', esc(f.label));
      e = set(e, 'Position', nextPos(parentGroup));
      e = set(e, 'ElementParent', esc(parentGroup));
      e = set(e, 'ReferencedDataForm', esc(f.ref));
      feXml.push(fresh(e));
      report.push(`${indent(parentGroup)}${f.feld.padEnd(26)} Unterformular ${f.ref}`);
      continue;
    }

    const o = { typ: f.typ, ...(overrides[f.feld] ?? {}) };
    const unit = def(f, 'unit') ?? '';
    const maxLen = o.maxLength ?? (+def(f, 'maximal length') || 0);
    let dc, fe, info;
    switch (o.typ) {
      case 'Enumeration':
      case 'Autocomplete':
      case 'MultipleChoice': {
        const katalog = katalogFuer(f.dictionary);
        const anzahl = OS_KATALOGE[f.dictionary] ? Object.keys(OS_KATALOGE[f.dictionary].codes).length : valuesOf(f.dictionary).length;
        const multiple = o.typ === 'MultipleChoice';
        dc = set(T.dcCatalogue, 'PropertyCatalogue', esc(katalog));
        dc = set(dc, 'MultipleChoice', String(multiple));
        // Mehrfachauswahl als Checkboxen; Einfachauswahl: große Wertelisten mit Suchdialog, kleine als Auswahlliste
        fe = multiple ? T.feCheckbox : anzahl > 20 ? T.fePropcatLookup : T.feCombobox;
        info = `${multiple ? 'Mehrfachauswahl' : anzahl > 20 ? 'Suchdialog' : 'Auswahl'} ${katalog} (${anzahl} Werte)`;
        break;
      }
      case 'FreeText':
        if (maxLen && maxLen <= 255) {
          dc = set(T.dcText, 'MaxLength', String(maxLen));
          fe = T.feTextfield;
          info = `Text (max. ${maxLen})`;
        } else {
          dc = T.dcLongtext;
          fe = T.feTextarea;
          info = 'Langtext';
        }
        break;
      case 'MedicalDate':
      case 'Date': {
        // Teildatum nur, wenn das nNGM-Muster JJJJ-MM oder JJJJ zulässt (z. B. „(\d{4}-\d{2}-\d{2}|\d{4}-\d{2})“)
        const pattern = f.definition?.match(/pattern: (\([^)]*\))/)?.[1] ?? '';   // enthält selbst „|“, daher nicht def()
        const partial = o.typ === 'MedicalDate' && (!pattern || /\\d\{4\}(-\\d\{2\})?(\||\))|UK/.test(pattern));
        dc = set(T.dcDate, 'DateUnknownAllowed', String(partial));
        dc = set(dc, 'DateEstimatedAllowed', 'false');
        fe = T.feDate;
        info = partial ? 'Datum (Tag/Monat unbekannt erlaubt)' : 'Datum';
        break;
      }
      case 'Decimal':
      case 'Integer':
        dc = set(set(T.dcText, 'Type', o.typ === 'Decimal' ? 'decimal' : 'integer'), 'MaxLength', '0');
        fe = T.feTextfield;
        info = `${o.typ === 'Decimal' ? 'Dezimalzahl' : 'Ganzzahl'}${unit ? ' in ' + unit : ''}`;
        break;
      case 'FormReference':
        // Formularverweis: speichert die prozedur.id des gewählten Eintrags; Zielformular per Name und GUID
        dc = dcFormReference();
        fe = withAttr(feFormReference(), '');
        fe = set(fe, 'ReferencedDataForm', esc(o.formular));
        fe = set(fe, 'AnzeigeAuswahl', esc(o.anzeige ?? ''));
        fe = fe.replace(/<DataFormReferences>[\s\S]*?<\/DataFormReferences>/, (r) => set(set(set(r, 'Name', esc(o.formular)), 'GUID', o.guid), 'Revision', '1'));
        info = `Formularverweis auf ${o.formular}`;
        break;
      default:
        throw new Error(`Typ ${o.typ} (${f.feld}) nicht abgebildet`);
    }
    if (!CHOICE.has(o.typ)) dc = remove(dc, 'PropertyCatalogue');

    // Datenkatalog-Feld
    dc = withAttr(dc, '');
    dc = set(dc, 'Name', esc(f.feld));
    dc = set(dc, 'NameExport', esc(f.feld));
    dc = set(dc, 'Description', esc(f.label));
    dc = set(dc, 'ScaleUnit', esc(unit));
    dc = set(dc, 'Position', '0.0');
    dc = set(dc, 'Note', esc(f.zusatz ? `Onkostar-Feld, kein nNGM-Feld: ${f.hinweis ?? ''}` : `nNGM: ${f.schluessel}`));
    dcXml.push(fresh(dc));

    // Formular-Eintrag
    const isDate = o.typ === 'MedicalDate' || o.typ === 'Date';
    fe = withAttr(fe, parentGroup ? `parentRefId="${sectionIds.get(parentGroup)}"` : '');
    fe = remove(remove(remove(fe, 'Filter'), 'Scripts'), 'Vorschlagskategorie');
    fe = set(fe, 'Name', esc(f.feld));
    fe = set(fe, 'Description', esc(f.label));
    fe = set(fe, 'Position', nextPos(parentGroup));
    fe = set(fe, 'DataCatalogueEntry', esc(f.feld));
    fe = set(fe, 'DataCatalogueEntryTable', esc(datenkatalog));
    fe = set(fe, 'ElementParent', esc(parentGroup));
    fe = set(fe, 'ProcedureDateStatus', f.feld === prozedurdatum ? 'date' : 'none');
    fe = set(fe, 'Mandatory', 'false');
    fe = set(fe, 'Hinweis', esc(o.hinweis ?? f.hinweis ?? ''));
    // Datumsgrenzen: nicht vor Geburt (1), nicht nach Tod (3), nicht in der Zukunft
    fe = set(fe, 'DateValidFrom', isDate ? '1' : '0');
    fe = set(fe, 'DateValidTo', isDate ? '3' : '0');
    fe = set(fe, 'DateValidFuture', isDate ? 'false' : 'true');
    const condition = filter[f.feld] && filterCodes(filter[f.feld], ffields);
    if (condition) {
      const refs = [...new Set([...condition.matchAll(/([A-Za-z_]\w*)\s*(?:=|<>|->)/g)].map((m) => m[1]))];
      const filterXml = `
               <Filter>
                  <Condition>${esc(condition)}</Condition>
                  <Valid>true</Valid>
                  <RefEntries>
${refs.map((r) => `                     <RefEntry>${r}</RefEntry>`).join('\n')}
                  </RefEntries>
               </Filter>`;
      fe = fe.replace(/(<Datenart>[^<]*<\/Datenart>)/, `$1${filterXml}`);
    }
    feXml.push(fresh(fe));
    report.push(`${indent(parentGroup)}${f.feld.padEnd(26)} ${info}${f.feld === prozedurdatum ? '  [Prozedurdatum]' : ''}${condition ? '  [sichtbar wenn ' + condition.slice(0, 40) + (condition.length > 40 ? '…' : '') + ']' : ''}`);
  }

  const dateFields = ffields.filter((f) => ['MedicalDate', 'Date'].includes(overrides[f.feld]?.typ ?? f.typ));
  const rules = dateFields.flatMap((f) => [
    rule(f.feld, 'GueltigVon', 'Das Datum liegt vor dem Geburtsdatum', `dateBeforeOrEquals(patientData.getBirthdate(), ${f.feld})`),
    rule(f.feld, 'GueltigBis', 'Das Datum liegt nach dem Sterbedatum', `dateAfterOrEquals(patientData.getDeathdate(), ${f.feld})`),
    rule(f.feld, 'GueltigZukunft', 'Das Datum liegt in der Zukunft', `dateAfterOrEquals(getNow(), ${f.feld})`),
  ]);
  return { dcXml, feXml, rules, report };
}
