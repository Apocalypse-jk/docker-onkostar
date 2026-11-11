// Erzeugt aus dem OSC-Export eines OS-Formulars ein abgeleitetes, verknüpftes nNGM-Formular (E-8):
// Kopie des OS-Formulars (gleicher Basis-Datenkatalog) + eigener Erweiterungs-Datenkatalog mit den nNGM-Feldern, die
// im OS-Formular fehlen, + Verknüpfung (VerknuepftGUID), damit Onkostar es wie das OS-Formular behandelt.
//   node mapping/tools/osc-ableitung.mjs systemicTherapy
// Ergebnis: osc_nngm/<Formular>.osc – nur die neuen Objekte (nNGM-Kataloge, Erweiterungs-Datenkatalog, abgeleitetes
// Formular); Basis-Datenkatalog, OS-Kataloge und Unterformulare werden nur per Name referenziert.
// Die Zusatzfelder kommen aus dem nNGM-Datensatz (mapping/nngm-datensatz/felder.csv) und werden mit derselben Logik
// wie in osc-nngm-formular.mjs erzeugt (osc-lib.mjs).
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { REPO_DIR } from './lib.mjs';
import { SID, T, read, esc, set, ordner, fresh, allFields, dictsOf, katalogXml, eintraege } from './osc-lib.mjs';

const CONFIGS = {
  systemicTherapy: {
    export: 'osc_exports/2026-11-05_13-25-43_184_f_export-25.osc',
    basisFormular: 'OS.Systemische Therapie',
    basisDatenkatalog: 'Systemtherapie',
    formular: 'NNGM.Systemische Therapie',
    menue: 'Systemische Therapie (nNGM)',
    menueKategorie: { name: 'nNGM', position: '3.0', column: '1' },   // eigene Menükategorie (E-11)
    datenkatalog: 'NNGMSystemtherapie',
    instrument: 'systemicTherapy',
    // Abschnitte mit den nNGM-Feldern ohne Gegenstück in OS.Systemische Therapie (feld-mapping.csv, Kategorie C; E-4)
    abschnitte: [
      { name: 'nngmBSC', label: 'nNGM: Therapiefreie Zeit / Best Supportive Care',
        felder: ['noTherapy', 'noTherapyReason', 'otherNoTherapyReason', 'noTherapyStart', 'noTherapyEnde'] },
      { name: 'nngmEmpfehlung', label: 'nNGM: Therapieempfehlung',
        felder: ['basedOnRecommendation', 'furtherDetails', 'therapyExecutionCenter', 'therapyDate'] },
      { name: 'nngmLinie', label: 'nNGM: Therapielinie und Studie',
        felder: ['therapyLine', 'offLabelUse', 'isMaintainceTherapy', 'therapyLineStudyParticipation', 'therapyLineStudyName',
          'therapyLineStudyRegister', 'therapyLineStudyId', 'therapyLineInclusionGeneticVariants'] },
      { name: 'nngmResponse', label: 'nNGM: Response', felder: ['bestResponseDate', 'AssessmentBy'] },
    ],
    // Sichtbarkeit (eigene Ergänzung, nicht aus dem nNGM-Schema)
    filter: {
      noTherapyReason: "noTherapy='yes'",
      otherNoTherapyReason: "noTherapyReason='Other'",
      noTherapyStart: "noTherapy='yes'",
      noTherapyEnde: "noTherapy='yes'",
      furtherDetails: "not isEmptyString(basedOnRecommendation) and basedOnRecommendation<>'no'",
      therapyExecutionCenter: "not isEmptyString(basedOnRecommendation) and basedOnRecommendation<>'no'",
      therapyDate: "not isEmptyString(basedOnRecommendation) and basedOnRecommendation<>'no'",
      therapyLineStudyName: "therapyLineStudyParticipation='yes'",
      therapyLineStudyRegister: "therapyLineStudyParticipation='yes'",
      therapyLineStudyId: "therapyLineStudyParticipation='yes'",
      therapyLineInclusionGeneticVariants: "therapyLineStudyParticipation='yes'",
    },
  },
};

const cfgName = process.argv[2];
const cfg = CONFIGS[cfgName];
if (!cfg) throw new Error(`Unbekannte Konfiguration "${cfgName}". Vorhanden: ${Object.keys(CONFIGS).join(', ')}`);
const osExport = read(cfg.export);

const freshAll = (xml) => xml.replace(/<GUID>[^<]*<\/GUID>/g, () => `<GUID>${randomUUID()}</GUID>`)
  .replace(/<SID>[^<]*<\/SID>/g, `<SID>${SID}</SID>`).replace(/<Revision>[^<]*<\/Revision>/g, '<Revision>1</Revision>');
/** Oberste Blöcke (6 Leerzeichen eingerückt) eines Exports */
const topBlocks = (xml, tag) => [...xml.matchAll(new RegExp(`\\n {6}<${tag}>[\\s\\S]*?\\n {6}</${tag}>`, 'g'))].map((m) => m[0].slice(1));
const nameOf = (b) => b.match(/<Name>([^<]*)<\/Name>/)[1];

// ---------------------------------------------------------------------------
// nNGM-Zusatzfelder: je Abschnitt eine FieldGroup, darunter die Felder aus dem nNGM-Datensatz

const nngm = allFields.filter((f) => f.instrument === cfg.instrument);
const felder = cfg.abschnitte.flatMap((a) => [
  { feld: a.name, label: a.label, typ: 'FieldGroup', pfad: '', parent: '' },
  ...a.felder.map((name) => {
    const f = nngm.find((x) => x.feld === name);
    if (!f) throw new Error(`Feld ${name} nicht im nNGM-Bogen ${cfg.instrument}`);
    return { ...f, parent: a.name };
  }),
]);

const basis = topBlocks(osExport, 'DataForm').find((b) => nameOf(b) === cfg.basisFormular);
if (!basis) throw new Error(`Formular ${cfg.basisFormular} nicht im Export`);
const maxPos = Math.max(...[...basis.matchAll(/\n {15}<Position>([\d.]+)<\/Position>/g)].map((m) => +m[1]));
const { dcXml, feXml, rules, report } = eintraege({
  fields: felder, datenkatalog: cfg.datenkatalog, filter: cfg.filter,
  startPos: Math.ceil(maxPos), sectionIdStart: 99000,   // hinter den OS-Feldern, parentIds außerhalb des OS-Bereichs
});
const kataloge = dictsOf(felder).map(katalogXml);

// Erweiterungs-Datenkatalog
let dcHead = T.dcHeader;
dcHead = set(dcHead, 'Name', esc(cfg.datenkatalog));
dcHead = set(dcHead, 'NameExport', esc(cfg.datenkatalog));
dcHead = set(dcHead, 'Category', basis.match(/<Category>([^<]*)<\/Category>/)[1]);
dcHead = set(dcHead, 'Description', esc(`nNGM-Ergänzung zu ${cfg.basisDatenkatalog} (${cfgName})`));
dcHead = set(dcHead, 'Note', 'Erzeugt mit mapping/tools/osc-ableitung.mjs');
const dc = ordner(`${fresh(dcHead)}<Entries>\n${dcXml.join('\n')}
         </Entries>
         <Ordner></Ordner>
      </DataCatalogue>`, 2);

// ---------------------------------------------------------------------------
// Abgeleitetes Formular: Kopie des OS-Formulars, umbenannt, + Erweiterungs-Datenkatalog + Abschnitte

let df = basis;
df = df.replace(`<DataCatalogue>${cfg.basisDatenkatalog}</DataCatalogue>`,
  `<DataCatalogue>${cfg.basisDatenkatalog}</DataCatalogue>\n            <DataCatalogue>${cfg.datenkatalog}</DataCatalogue>`);
const kopfEnde = df.indexOf('<Entries>');
let kopf = df.slice(0, kopfEnde);
kopf = set(set(set(set(set(kopf, 'Name', cfg.formular), 'MenuEntry', cfg.menue), 'Title', cfg.menue),
  'Description', `Abgeleitet von ${cfg.basisFormular} (nNGM, E-8)`), 'Readonly', 'false');
kopf = set(kopf, 'Note', `Abgeleitet von ${cfg.basisFormular} mit mapping/tools/osc-ableitung.mjs; Basis-Datenkatalog ${cfg.basisDatenkatalog}, nNGM-Ergänzungen in ${cfg.datenkatalog}`);
df = kopf + df.slice(kopfEnde);
df = df.replace(/\s*<Ansichten>[\s\S]*?<\/Ansichten>/, '\n         <Ansichten/>');   // Ansichten verweisen per GUID auf das OS-Formular
df = ordner(df, 3);
if (cfg.menueKategorie) {
  const m = cfg.menueKategorie;
  df = df.replace(/<MenuCategory>[\s\S]*?<\/MenuCategory>/, `<MenuCategory>
            <name>${m.name}</name>
            <position>${m.position}</position>
            <column>${m.column}</column>
         </MenuCategory>`);
}

// Verknüpfung mit dem OS-Formular (E-8): Formularverweise auf das OS-Formular bieten dann auch Einträge des
// nNGM-Formulars an. Zusammenfassungen und Skripte erbt Onkostar zwischen INHERIT-Markierungen – sie dürfen nicht
// zusätzlich als Kopie dastehen (sonst doppelte Anzeige und doppelt ausgeführte Skripte).
const NL = '&amp;#10;';
const basisGuid = basis.match(/\n {9}<GUID>([^<]*)<\/GUID>/)[1];
const inhalt = (tag) => (basis.match(new RegExp(`\\n {9}<${tag}>([\\s\\S]*?)</${tag}>`)) || [])[1] ?? '';
for (const tag of ['Summary', 'BigSummary', 'KalenderSchnipsel', 'EmailTemplate']) {
  df = set(df, tag, `&lt;!--INHERIT START-->${NL}${inhalt(tag)}${NL}&lt;!--INHERIT END-->`);
}
const SKRIPTE = ['BeimSchliessen', 'BeimSpeichern', 'BeimNeuanlegen', 'BeimBearbeiten', 'BeimKopieren', 'BeimImport', 'BeimAnonymisieren'];
const skriptCode = (s) => (basis.match(new RegExp(`<Script${s}>\\s*<Code>([\\s\\S]*?)</Code>`)) || [])[1] ?? '';
df = df.replace(/\s*<Script\w+>[\s\S]*?<\/Script\w+>/g, '');
const skripte = SKRIPTE.map((s) => `         <Script${s}>
            <Code>//#### INHERIT START ####${NL}${skriptCode(s)}${NL}//#### INHERIT END ####</Code>
            <Valid>true</Valid>
         </Script${s}>`).join('\n');
df = df.replace(/(\n {9}<hatUnterformulare>[^<]*<\/hatUnterformulare>)/, `$1\n${skripte}`);

// alle GUIDs der Kopie neu – sonst würde das OS-Formular überschrieben; danach die neuen Einträge und Regeln anhängen
df = freshAll(df);
const entriesEnde = df.lastIndexOf('\n         </Entries>');
df = df.slice(0, entriesEnde) + '\n' + feXml.join('\n') + df.slice(entriesEnde);
df = df.replace(/\n {9}<\/PlausibilityRules>/, `\n${rules.join('\n')}\n         </PlausibilityRules>`);
df = df.replace(/(\n {9}<Revision>[^<]*<\/Revision>)(\n {9}<SeitenzahlSichtbar>)/, `$1\n         <VerknuepftGUID>${basisGuid}</VerknuepftGUID>$2`);

// ---------------------------------------------------------------------------
// Prüfungen

const probleme = [];
if (!df.includes(`<VerknuepftGUID>${basisGuid}</VerknuepftGUID>`)) probleme.push('VerknuepftGUID nicht gesetzt');
if (df.split(basisGuid).length !== 2) probleme.push('GUID des OS-Formulars außerhalb von VerknuepftGUID enthalten');
const namen = [...df.matchAll(/<Entry[^>]*>\s*<Type>[^<]*<\/Type>\s*<Name>([^<]*)<\/Name>/g)].map((m) => m[1]);
const doppelt = namen.filter((n, i) => namen.indexOf(n) !== i);
if (doppelt.length) probleme.push(`doppelte Formularfelder (Namenskonflikt mit dem OS-Formular?): ${doppelt.join(', ')}`);
const dcNamen = [...dc.matchAll(/<Entry>\s*(?:<PropertyCatalogue>[^<]*<\/PropertyCatalogue>\s*)?<Name>([^<]*)<\/Name>/g)].map((m) => m[1]);
for (const m of feXml.join('\n').matchAll(/<DataCatalogueEntry>([^<]+)<\/DataCatalogueEntry>/g)) if (!dcNamen.includes(m[1])) probleme.push(`DK-Feld ${m[1]} fehlt`);
for (const m of df.matchAll(/<RefEntry>([^<]*)<\/RefEntry>/g)) if (!namen.includes(m[1])) probleme.push(`Filter verweist auf unbekanntes Feld ${m[1]}`);
const guids = [...df.matchAll(/<GUID>([^<]*)<\/GUID>/g)].map((m) => m[1]).filter((g) => g !== basisGuid);
if (new Set(guids).size !== guids.length) probleme.push('GUIDs nicht eindeutig');
if (probleme.length) throw new Error(probleme.join('\n'));

// ---------------------------------------------------------------------------
// Ausgabe

const info = osExport.slice(0, osExport.indexOf('<Editor>')).replace(/<DatumXML>[^<]*<\/DatumXML>/, `<DatumXML>${new Date().toISOString().slice(0, 10)}Z</DatumXML>`);
const osc = `${info}<Editor>\n${kataloge.join('\n')}\n${dc}\n${df}\n   </Editor>\n</OnkostarEditor>\n`;
const out = resolve(REPO_DIR, 'osc_nngm', `${cfg.formular}.osc`);
writeFileSync(out, osc);
const refs = [...new Set([...df.matchAll(/<ReferencedDataForm>([^<]+)<\/ReferencedDataForm>/g)].map((m) => m[1]))];
console.log(`osc_nngm/${cfg.formular}.osc (${(osc.length / 1024).toFixed(0)} KB)`);
console.log(`  Formular ${cfg.formular}: ${namen.length} Einträge, verknüpft mit ${cfg.basisFormular}; Datenkataloge ${cfg.basisDatenkatalog} + ${cfg.datenkatalog}`);
console.log(`  Kataloge: ${dictsOf(felder).map((d) => 'NNGM.' + d).join(', ')}; referenziert (nicht in der Datei): ${refs.join(', ')}`);
console.log(report.join('\n'));
