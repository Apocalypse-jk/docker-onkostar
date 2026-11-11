// Erzeugt eine importierbare OSC-Datei für ein eigenes nNGM-Formular (Merkmalskataloge + Datenkatalog + Formular,
// ggf. Unterformulare) aus einem oder mehreren nNGM-Instrumenten.
//   node mapping/tools/osc-nngm-formular.mjs radioTherapy
//   node mapping/tools/osc-nngm-formular.mjs therapieinformation
//
// Grundlage: mapping/nngm-datensatz/*.csv (aus dem nNGM-Schema, siehe nngm-schema.mjs).
// Vorlagen für die XML-Blöcke stammen aus von Onkostar selbst geschriebenen Exporten (osc_exports/),
// siehe osc_exports/OSC-FORMAT.md. Pro Formular steuert ein Eintrag in INSTRUMENTS Namen und Sonderfälle.
//
// Abbildung:
//   - Ein Eintrag der obersten nNGM-Liste (z. B. eine Strahlentherapie) = ein Onkostar-Formulareintrag.
//     Die Liste selbst wird nicht als Unterformular nachgebaut; mehrere Einträge = mehrere Formulare je Erkrankung.
//   - Eine Liste innerhalb des Formulars (verschachtelte Liste) → eigenes Unterformular, im Hauptformular als
//     subform-Eintrag; ein Listeneintrag = ein Unterformular-Eintrag.
//   - Mehrere Instrumente in einem Formular: je Instrument ein Abschnitt mit dessen Label.
//   - FieldGroup → Abschnitt (section), Felder darin per parentId/parentRefId.
//   - Wertelisten werden als eigene Merkmalskataloge NNGM.<typ> mit den nNGM-Codes angelegt,
//     damit ein Export ins nNGM-Format keine Werteübersetzung braucht.
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { REPO_DIR } from './lib.mjs';
import { T, esc, set, ordner, fresh, allFields, instrumentLabel, catalogName, OS_KATALOGE, dictsOf, katalogXml, eintraege } from './osc-lib.mjs';


const INSTRUMENTS = {
  radioTherapy: {
    formular: 'NNGM.Strahlentherapie',
    titel: 'nNGM Strahlentherapie',
    datenkatalog: 'NNGMStrahlentherapie',          // → Tabelle dk_nngmstrahlentherapie
    // Felder, deren Typ von der Standardabbildung abweicht
    overrides: {
      executionCenter: { typ: 'FreeText', maxLength: 255,
        hinweis: 'Vorläufig Freitext – Abbildung des nNGM-Netzwerkstandorts (NngmNetworkLocation) noch offen' },
    },
    // Sichtbarkeitsbedingungen (Onkostar-Filtersyntax, Feldnamen = nNGM-Feldnamen)
    filter: {
      otherTherapeuticIntention: "therapeuticIntention='other'",
      boostDoseInTotalDose: "boostExecuted='yes' or boostExecuted='simultaneousIntegrated' or boostExecuted='sequentialBoost' or boostExecuted='concomitantBoost'",
      boostDose: "boostExecuted='yes' or boostExecuted='simultaneousIntegrated' or boostExecuted='sequentialBoost' or boostExecuted='concomitantBoost'",
    },
    prozedurdatum: 'therapyStart',                 // Datum, das als Prozedurdatum gilt
    kategorie: 'Therapie',
    menue: { name: 'nNGM', position: '3.0', column: '1' },   // eigene Menükategorie (E-11)
  },
  therapieinformation: {
    instrumente: ['assessment', 'TherapyInformation'],
    formular: 'NNGM.Therapieinformation',
    titel: 'nNGM Therapieinformation',
    datenkatalog: 'NNGMTherapieinformation',
    // Onkostar-eigene Felder ohne nNGM-Gegenstück (beide Bögen haben kein Datum)
    zusatzfelder: [
      { feld: 'Datum', label: 'Datum', typ: 'Date', hinweis: 'Datum des Eintrags in Onkostar (kein nNGM-Feld)' },
    ],
    prozedurdatum: 'Datum',
    filter: {
      reasonForNonexecution: "wasImplemented='no'",
    },
    unterformulare: {
      archiveCodeList: { formular: 'NNGM.MURIPEDIA-Archivierungscode', titel: 'MURIPEDIA-Archivierungscode', datenkatalog: 'NNGMArchivierungscode', prozedurdatum: 'creationDate' },
    },
    kategorie: 'Therapie',
    menue: { name: 'nNGM', position: '3.0', column: '1' },   // eigene Menükategorie (E-11)
  },
  anforderung: {
    instrumente: ['diagnosticsRequest'],
    formular: 'NNGM.Anforderung',
    titel: 'nNGM Anforderung',
    datenkatalog: 'NNGMAnforderung',
    overrides: {
      // Verweis auf den Bogen Tumordiagnose → Eintrag von OS.Diagnose (GUID des OS-Standardformulars)
      firstDiagnosis: { typ: 'FormReference', formular: 'OS.Diagnose', guid: '649652f3-d708-11e5-b199-0050568f1add',
        anzeige: '{Diagnosedatum} - {ICD10}', hinweis: 'Verweis auf die Tumordiagnose (OS.Diagnose)' },
      requester: { typ: 'FreeText', maxLength: 255,
        hinweis: 'Vorläufig Freitext – Abbildung der nNGM-Netzwerkpartner (NngmNetworkPartner) noch offen' },
      performer: { typ: 'FreeText', maxLength: 255,
        hinweis: 'Vorläufig Freitext – Abbildung der nNGM-Netzwerkstandorte (NngmNetworkLocation) noch offen' },
      additionalPerformer: { typ: 'FreeText', maxLength: 255,
        hinweis: 'Vorläufig Freitext – Abbildung der nNGM-Netzwerkpartner (NngmNetworkPartner) noch offen' },
    },
    prozedurdatum: 'requirementDate',
    filter: {
      eMailAddressPhoneNumber: "tumorBoardParticipation='yes'",
      reasonMissingBiopsy: 'liquidBiopsy->isEmpty()',    // Mehrfachauswahl: keine Option gewählt
    },
    unterformulare: {
      additionalPerformerList: { formular: 'NNGM.Anforderung.Behandler', titel: 'Zusätzlicher Behandler', datenkatalog: 'NNGMAnforderungBehandler' },
    },
    kategorie: 'Beobachtung',
    menue: { name: 'nNGM', position: '3.0', column: '1' },   // eigene Menükategorie (E-11)
  },
};

// Formular-/Datenkatalog-Kategorie in der Konfiguration (Category in OSC, data_form.category)
const KATEGORIEN = { Diagnose: '-1', Therapie: '-2', Beobachtung: '-3', Fragebogen: '-4' };

const cfgName = process.argv[2];
const cfg = INSTRUMENTS[cfgName];
if (!cfg) throw new Error(`Unbekannte Konfiguration "${cfgName}". Konfiguriert: ${Object.keys(INSTRUMENTS).join(', ')}`);
const category = KATEGORIEN[cfg.kategorie];
if (!category) throw new Error(`Unbekannte Kategorie "${cfg.kategorie}", erlaubt: ${Object.keys(KATEGORIEN).join(', ')}`);
const instrumentNames = cfg.instrumente ?? [cfgName];

// ---------------------------------------------------------------------------
// nNGM-Daten

// Felder aller Instrumente; bei mehreren Instrumenten bekommt jedes einen Abschnitt mit seinem Label. Besteht ein
// Instrument nur aus einer umschließenden Gruppe, wird diese Gruppe der Abschnitt (Onkostar kennt keine Abschnitte
// in Abschnitten).
let fields = [];
for (const name of instrumentNames) {
  const own = allFields.filter((f) => f.instrument === name);
  if (!own.length) throw new Error(`Keine Felder für ${name}`);
  const top = own.filter((f) => !f.parent);
  if (instrumentNames.length > 1 && top.length === 1 && top[0].typ === 'FieldGroup') {
    fields.push({ ...top[0], label: `${instrumentLabel(name)} – ${top[0].label}` }, ...own.filter((f) => f !== top[0]));
  } else if (instrumentNames.length > 1) {
    const section = `${name}Bereich`;
    fields.push({ feld: section, label: instrumentLabel(name), typ: 'FieldGroup', pfad: '', parent: '', instrument: name });
    fields.push(...own.map((f) => (f.parent ? f : { ...f, parent: section })));
  } else fields.push(...own);
}
const zusatz = (cfg.zusatzfelder ?? []).map((z) => ({ ...z, pfad: '', parent: '', definition: '', schluessel: '(Onkostar-Feld)', zusatz: true }));
fields = [...zusatz, ...fields];
const doppelt = fields.map((f) => f.feld).filter((n, i, a) => a.indexOf(n) !== i && !['id'].includes(n));
if (doppelt.length) throw new Error(`Feldnamen nicht eindeutig über die Instrumente: ${doppelt.join(', ')}`);

// EntryId (ID des Listeneintrags) entspricht der Prozedur-ID und braucht kein eigenes Feld
const STRUCTURE = new Set(['List', 'ListEntry', 'FieldGroup', 'EntryId']);
const unsupported = fields.filter((f) => !STRUCTURE.has(f.typ) && !cfg.overrides?.[f.feld]?.typ &&
  !['Enumeration', 'Autocomplete', 'MultipleChoice', 'FreeText', 'MedicalDate', 'Date', 'Decimal', 'Integer'].includes(f.typ));
if (unsupported.length) throw new Error('Typen ohne Abbildung: ' + unsupported.map((f) => `${f.feld}:${f.typ}`).join(', '));
if (fields.some((f) => f.typ === 'Table' || f.typ === 'TableEntry')) throw new Error('Tabellen werden noch nicht unterstützt');

// Verschachtelte Listen → Unterformulare
const subformSpecs = [];
for (const list of fields.filter((f) => f.typ === 'List' && f.pfad)) {
  const sub = cfg.unterformulare?.[list.feld];
  if (!sub) throw new Error(`Verschachtelte Liste ${list.feld}: in INSTRUMENTS.${cfgName}.unterformulare konfigurieren`);
  const listPath = `${list.pfad} > ${list.feld}`;
  const entry = fields.find((f) => f.typ === 'ListEntry' && f.pfad === listPath);
  const entryPath = `${listPath} > ${entry.feld}`;
  const inside = fields.filter((f) => f.pfad === entryPath || f.pfad.startsWith(entryPath + ' > '));
  if (inside.some((f) => f.typ === 'List')) throw new Error(`Liste in Liste (${list.feld}) wird noch nicht unterstützt`);
  subformSpecs.push({ list, ...sub, fields: inside.map((f) => (f.parent === entry.feld ? { ...f, parent: '' } : f)) });
  const drop = new Set([list, entry, ...inside]);
  fields = fields.flatMap((f) => (f === list ? [{ ...f, typ: 'Subform', ref: sub.formular }] : drop.has(f) ? [] : [f]));
}

// ---------------------------------------------------------------------------
// Merkmalskataloge (für Haupt- und Unterformulare)

const usedDicts = dictsOf([...fields, ...subformSpecs.flatMap((s) => s.fields)]);
const catalogXml = usedDicts.map(katalogXml);

// ---------------------------------------------------------------------------
// Datenkatalog und Formular (bzw. Unterformular) aus einer Feldliste

function buildForm(spec) {
  const { fields: ffields, datenkatalog, formular, titel, prozedurdatum, beschreibung, istUnterformular } = spec;
  const { dcXml, feXml, rules, report } = eintraege({ fields: ffields, datenkatalog, prozedurdatum, overrides: cfg.overrides, filter: cfg.filter });

  let dcHead = T.dcHeader;
  dcHead = set(dcHead, 'Name', esc(datenkatalog));
  dcHead = set(dcHead, 'NameExport', esc(datenkatalog));
  dcHead = set(dcHead, 'Category', category);
  dcHead = set(dcHead, 'Description', esc(beschreibung));
  dcHead = set(dcHead, 'Note', esc('Erzeugt mit mapping/tools/osc-nngm-formular.mjs'));
  dcHead = fresh(dcHead);
  const dataCatalogue = ordner(`${dcHead}<Entries>\n${dcXml.join('\n')}
         </Entries>
         <Ordner></Ordner>
      </DataCatalogue>`, 2);

  const tag = istUnterformular ? 'Unterformular' : 'DataForm';
  let dfHead = T.dfHeader.replace('<DataForm>', `<${tag}>`);
  dfHead = set(dfHead, 'DataCatalogue', esc(datenkatalog));
  dfHead = set(dfHead, 'Category', category);
  dfHead = set(dfHead, 'Name', esc(formular));
  dfHead = set(dfHead, 'Version', '1');
  dfHead = set(dfHead, 'MenuEntry', esc(titel));
  dfHead = set(dfHead, 'Title', esc(titel));
  dfHead = set(dfHead, 'Description', esc(beschreibung));
  dfHead = set(dfHead, 'Kontext', '2');
  dfHead = set(dfHead, 'hatUnterformulare', String(ffields.some((f) => f.typ === 'Subform')));
  dfHead = fresh(dfHead);
  let dfFoot = ordner(T.dfFooter, 3);
  dfFoot = istUnterformular
    ? dfFoot.replace(/\s*<MenuCategory>[\s\S]*?<\/MenuCategory>/, '')   // Unterformulare stehen in keinem Menü
    : dfFoot.replace(/<MenuCategory>[\s\S]*?<\/MenuCategory>/, `<MenuCategory>
            <name>${cfg.menue.name}</name>
            <position>${cfg.menue.position}</position>
            <column>${cfg.menue.column}</column>
         </MenuCategory>`);
  const dataForm = `${dfHead}<Entries>\n${feXml.join('\n')}
         </Entries>
         <PlausibilityRules>
${rules.join('\n')}
         </PlausibilityRules>
         ${dfFoot.trim()}
      </${tag}>`;
  return { formular, datenkatalog, dataCatalogue, dataForm, report };
}

// ---------------------------------------------------------------------------
// Unterformulare und Hauptformular

const labelText = instrumentNames.map(instrumentLabel).join(' + ');
const subforms = subformSpecs.map((s) => buildForm({
  fields: s.fields, datenkatalog: s.datenkatalog, formular: s.formular, titel: s.titel, prozedurdatum: s.prozedurdatum,
  beschreibung: `nNGM ${s.list.label} (${s.list.schluessel}) – Unterformular von ${cfg.formular}, ein Eintrag je Listeneintrag`,
  istUnterformular: true,
}));
const firstEntry = fields.find((f) => f.typ === 'ListEntry');
const main = buildForm({
  fields, datenkatalog: cfg.datenkatalog, formular: cfg.formular, titel: cfg.titel, prozedurdatum: cfg.prozedurdatum,
  beschreibung: `nNGM ${labelText} (${instrumentNames.join(', ')})${firstEntry ? ` – ein Eintrag je ${firstEntry.label}` : ''}`,
});

const today = new Date().toISOString().slice(0, 10);
const osc = `<?xml version="1.0" encoding="UTF-8"?>
<OnkostarEditor>
   <InfoXML>
      <DatumXML>${today}Z</DatumXML>
      <Name>OnkoStar</Name>
      <Version>2.14.4</Version>
   </InfoXML>
   <Editor>
${catalogXml.join('\n')}
${[...subforms, main].map((f) => `      ${f.dataCatalogue.trim()}`).join('\n')}
${subforms.map((f) => `      ${f.dataForm.trim()}`).join('\n')}
      ${main.dataForm.trim()}
   </Editor>
</OnkostarEditor>
`.replace(/\n\n+/g, '\n');

// ---------------------------------------------------------------------------
// Selbstprüfung: Verweise und Eindeutigkeit (der Import prüft das nicht)

const problems = [];
const catalogNames = new Set([...usedDicts.map(catalogName), ...Object.values(OS_KATALOGE).map((k) => k.name)]);   // OS-Kataloge stehen nicht in der Datei
for (const f of [...subforms, main]) {
  for (const m of f.dataCatalogue.matchAll(/<PropertyCatalogue>([^<]*)<\/PropertyCatalogue>/g)) if (!catalogNames.has(m[1])) problems.push(`${f.formular}: Katalog ${m[1]} fehlt`);
  const dcNames = [...f.dataCatalogue.matchAll(/<Entry>\s*(?:<PropertyCatalogue>[^<]*<\/PropertyCatalogue>\s*)?<Name>([^<]*)<\/Name>/g)].map((m) => m[1]);
  for (const m of f.dataForm.matchAll(/<DataCatalogueEntry>([^<]+)<\/DataCatalogueEntry>/g)) if (!dcNames.includes(m[1])) problems.push(`${f.formular}: Datenkatalog-Feld ${m[1]} fehlt`);
  for (const m of f.dataForm.matchAll(/<DataCatalogueEntryTable>([^<]+)<\/DataCatalogueEntryTable>/g)) if (m[1] !== f.datenkatalog) problems.push(`${f.formular}: falscher Datenkatalog ${m[1]}`);
  const feNames = [...f.dataForm.matchAll(/<Entry[^>]*>\s*<Type>[^<]*<\/Type>\s*<Name>([^<]*)<\/Name>/g)].map((m) => m[1]);
  if (new Set(feNames).size !== feNames.length) problems.push(`${f.formular}: Formular-Einträge nicht eindeutig`);
  for (const m of f.dataForm.matchAll(/<RefEntry>([^<]*)<\/RefEntry>/g)) if (!feNames.includes(m[1])) problems.push(`${f.formular}: Filter verweist auf unbekanntes Feld ${m[1]}`);
  if ((f.dataForm.match(/<ProcedureDateStatus>date</g) || []).length > 1) problems.push(`${f.formular}: mehr als ein Prozedurdatum`);
  if (f.formular.length > 50 || f.datenkatalog.length > 50) problems.push(`${f.formular}: Name länger als 50 Zeichen`);
}
for (const m of main.dataForm.matchAll(/<Type>subform<\/Type>[\s\S]*?<ReferencedDataForm>([^<]*)<\/ReferencedDataForm>/g)) if (!subforms.some((s) => s.formular === m[1])) problems.push(`Unterformular ${m[1]} fehlt`);
const guids = [...osc.matchAll(/<GUID>([^<]*)<\/GUID>/g)].map((m) => m[1]);
if (new Set(guids).size !== guids.length) problems.push('GUIDs nicht eindeutig');
if (/<DateValidFrom>(?!0<|1<)/.test(osc) || /<DateValidTo>(?!0<|3<)/.test(osc)) problems.push('Ungültige Datumsgrenze');
if (problems.length) throw new Error('Selbstprüfung fehlgeschlagen:\n  ' + problems.join('\n  '));

const outDir = resolve(REPO_DIR, 'osc_nngm');
mkdirSync(outDir, { recursive: true });
const out = resolve(outDir, `${cfg.formular}.osc`);
writeFileSync(out, osc, 'utf8');
console.log(`${out.slice(REPO_DIR.length + 1)}`);
console.log(`  Merkmalskataloge: ${usedDicts.map(catalogName).join(', ')}`);
for (const f of [main, ...subforms]) {
  console.log(`  ${subforms.includes(f) ? 'Unterformular' : 'Formular'} ${f.formular}, Datenkatalog ${f.datenkatalog} (Tabelle dk_${f.datenkatalog.toLowerCase()})`);
  console.log(f.report.join('\n'));
}
