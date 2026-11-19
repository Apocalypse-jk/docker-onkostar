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
    // nNGM-Felder ohne Gegenstück in OS.Systemische Therapie (feld-mapping.csv, Kategorie C; E-4) – immer im
    // fachlichen Kontext der OS-Felder, keine Sammelabschnitte; mehrere Felder hinter demselben Zielfeld in dieser Reihenfolge
    abschnitte: [],
    platzierung: {
      basedOnRecommendation: { nach: 'Status' },               // Therapieempfehlung vor der Durchführung
      furtherDetails: { nach: 'Status' },
      therapyExecutionCenter: { nach: 'Status' },
      therapyDate: { nach: 'Status' },
      therapyLine: { nach: 'Intention' },                       // Liniennummer bei der Einordnung der Therapie
      isMaintainceTherapy: { nach: 'Therapiearten' },           // Merkmale der Therapie
      offLabelUse: { nach: 'Therapiearten' },
      therapyLineStudyParticipation: { nach: 'Therapiearten' },
      therapyLineStudyName: { nach: 'Therapiearten' },
      therapyLineStudyRegister: { nach: 'Therapiearten' },
      therapyLineStudyId: { nach: 'Therapiearten' },
      therapyLineInclusionGeneticVariants: { nach: 'Therapiearten' },
      noTherapy: { nach: 'Datum' },                             // bei „nicht durchgeführt“ (Grund, Datum)
      noTherapyReason: { nach: 'Datum' },
      otherNoTherapyReason: { nach: 'Datum' },
      noTherapyStart: { nach: 'Datum' },
      noTherapyEnde: { nach: 'Datum' },
      bestResponseDate: { nach: 'Ergebnis' },                   // Ergebnis = bestes Ansprechen
      AssessmentBy: { nach: 'Ergebnis' },
    },
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
  radioTherapy: {
    export: 'osc_exports/2026-11-05_13-25-43_184_f_export-25.osc',   // OS.Strahlentherapie ist dort als Unterformular-Block enthalten
    basisFormular: 'OS.Strahlentherapie',
    basisDatenkatalog: 'Strahlentherapie',
    formular: 'NNGM.Strahlentherapie',
    menue: 'Strahlentherapie (nNGM)',
    menueKategorie: { name: 'nNGM', position: '3.0', column: '1' },
    // Vor dem ersten Import den verwaisten Datenkatalog NNGMStrahlentherapie des gelöschten eigenständigen Formulars
    // löschen (leer, von keinem Formular genutzt) – sonst bleiben dessen 15 alte Felder im Datenkatalog stehen
    datenkatalog: 'NNGMStrahlentherapie',
    instrument: 'radioTherapy',
    abschnitte: [],
    // Zusatzfelder im Kontext der OS-Felder statt in einem eigenen Abschnitt
    platzierung: {
      otherTherapeuticIntention: { nach: 'Intention' },   // Abschnitt „Strahlentherapie“
      singleDose: { nach: 'Gesamtdosis' },                // Abschnitt „Therapieende“, bei „Konventionelle Fraktionierung“
    },
    // Einzeldosis pro Tag (nNGM) statt pro Fraktion (OS) – E-6; „Sonstiges“ zur Intention bei OS-Intention S
    filter: {
      otherTherapeuticIntention: "Intention='S'",
    },
    // Kein Unterformular-Tausch auf OS.StrahlentherapieEinzel.V2 (Test 13.11.2026): V2 ist keine Nachfolgeversion,
    // sondern eine kaum gepflegte Parallelvariante (Revision 19 statt 142, ohne „Umfang der Bestrahlung“, „Ziel“,
    // Boost-Details) und wird von keinem OS-Formular benutzt. Bestehende Einträge sind V1-Einträge; die Mischung
    // führte zu einem JS-Fehler (SubformConverter.expand) und nicht gespeicherten Unterformular-Daten.
  },
  operationTherapy: {
    export: 'osc_exports/2026-11-11_13-10-38_311_f_export-39.osc',
    basisFormular: 'OS.Operative Therapie',
    basisDatenkatalog: 'OperativeTherapie',
    formular: 'NNGM.Operative Therapie',
    menue: 'Operative Therapie (nNGM)',
    menueKategorie: { name: 'nNGM', position: '3.0', column: '1' },
    datenkatalog: 'NNGMOperativeTherapie',
    instrument: 'operationTherapy',
    abschnitte: [],
    platzierung: {
      // Resektionsart, Lokalisation und ihre Freitexte „Sonstiges“/„Andere“ kommen aus den OPS-Codes bzw. deren
      // Klartext (E-5, Entscheidung 16.11.2026; nNGM-Excel: „besser den Standard zu nehmen (OPS-Codes)“) → keine
      // Zusatzfelder otherTypeOfResection/localisationOther
      outcomeDeath: { nach: 'Komplikationen' },          // Abschnitt „Ergebnis“
    },
    filter: {
      outcomeDeath: "Status='D'",
    },
    // OS-Feld „Seite“ ist im OS-Formular immer ausgeblendet (Filter false) – nNGM braucht die Seite (E-5)
    osFilter: {
      Seite: "Status='D'",
    },
  },
};

const cfgName = process.argv[2];
const cfg = CONFIGS[cfgName];
if (!cfg) throw new Error(`Unbekannte Konfiguration "${cfgName}". Vorhanden: ${Object.keys(CONFIGS).join(', ')}`);
const osExport = read(cfg.export);

// Alle GUIDs neu (sonst würde das OS-Formular überschrieben) – außer in <DataFormReferences>: Formularverweise müssen
// weiter auf die echten OS-Formulare zeigen (deren GUIDs sind in allen Installationen gleich, E-8)
const freshAll = (xml) => xml.split(/(<DataFormReferences>[\s\S]*?<\/DataFormReferences>)/).map((teil) => (teil.startsWith('<DataFormReferences>') ? teil
  : teil.replace(/<GUID>[^<]*<\/GUID>/g, () => `<GUID>${randomUUID()}</GUID>`)
    .replace(/<SID>[^<]*<\/SID>/g, `<SID>${SID}</SID>`).replace(/<Revision>[^<]*<\/Revision>/g, '<Revision>1</Revision>'))).join('');
/** Oberste Blöcke (6 Leerzeichen eingerückt) eines Exports */
const topBlocks = (xml, tag) => [...xml.matchAll(new RegExp(`\\n {6}<${tag}>[\\s\\S]*?\\n {6}</${tag}>`, 'g'))].map((m) => m[0].slice(1));
const nameOf = (b) => b.match(/<Name>([^<]*)<\/Name>/)[1];

// ---------------------------------------------------------------------------
// nNGM-Zusatzfelder: je Abschnitt eine FieldGroup, darunter die Felder aus dem nNGM-Datensatz

const nngm = allFields.filter((f) => f.instrument === cfg.instrument);
const nngmFeld = (name) => { const f = nngm.find((x) => x.feld === name); if (!f) throw new Error(`Feld ${name} nicht im nNGM-Bogen ${cfg.instrument}`); return f; };
const felder = [
  ...cfg.abschnitte.flatMap((a) => [
    { feld: a.name, label: a.label, typ: 'FieldGroup', pfad: '', parent: '' },
    ...a.felder.map((name) => ({ ...nngmFeld(name), parent: a.name })),
  ]),
  // platzierte Felder: zunächst ohne Abschnitt, Position und Abschnitt werden unten vom OS-Zielfeld übernommen
  ...Object.keys(cfg.platzierung ?? {}).map((name) => ({ ...nngmFeld(name), parent: '' })),
].map((f) => (cfg.beschriftung?.[f.feld] ? { ...f, label: cfg.beschriftung[f.feld] } : f));

// Basisformular: als DataForm exportiert oder als mitgelieferter Unterformular-Block (z. B. OS.Strahlentherapie im
// Export von OS.Systemische Therapie) – das abgeleitete Formular ist immer ein DataForm
const basisBlock = [...topBlocks(osExport, 'DataForm'), ...topBlocks(osExport, 'Unterformular')].find((b) => nameOf(b) === cfg.basisFormular);
if (!basisBlock) throw new Error(`Formular ${cfg.basisFormular} nicht im Export`);
const basis = basisBlock.replace(/^\s*<Unterformular>/, '      <DataForm>').replace(/<\/Unterformular>$/, '</DataForm>');
if (!/<MenuCategory>/.test(basis) && cfg.menueKategorie) throw new Error(`${cfg.basisFormular} hat keine Menükategorie im Export`);
const maxPos = Math.max(...[...basis.matchAll(/\n {15}<Position>([\d.]+)<\/Position>/g)].map((m) => +m[1]));
const { dcXml, feXml, rules, report } = eintraege({
  fields: felder, datenkatalog: cfg.datenkatalog, filter: cfg.filter,
  startPos: Math.ceil(maxPos), sectionIdStart: 99000,   // hinter den OS-Feldern, parentIds außerhalb des OS-Bereichs
});
const kataloge = dictsOf(felder).map(katalogXml);

// Platzierung: Zusatzfeld direkt hinter ein OS-Feld setzen (gleicher Abschnitt, Position zwischen Zielfeld und dem
// nächsten Feld dieses Abschnitts)
const osEintraege = [...basis.matchAll(/\n {12}<Entry([^>]*)>([\s\S]*?)\n {12}<\/Entry>/g)].map((m) => ({
  attr: m[1], name: (m[2].match(/<Name>([^<]*)/) || [])[1], parent: (m[2].match(/<ElementParent>([^<]*)/) || [])[1] ?? '',
  pos: +(m[2].match(/\n {15}<Position>([^<]*)/) || [])[1],
}));
const hinterZiel = new Map();   // Zielfeld → Anzahl bereits dahinter gesetzter Felder
for (const [name, { nach }] of Object.entries(cfg.platzierung ?? {})) {
  const ziel = osEintraege.find((e) => e.name === nach);
  if (!ziel) throw new Error(`Platzierung ${name}: OS-Feld ${nach} nicht in ${cfg.basisFormular}`);
  const naechste = Math.min(...osEintraege.filter((e) => e.parent === ziel.parent && e.pos > ziel.pos).map((e) => e.pos), ziel.pos + 1);
  const k = (hinterZiel.get(nach) ?? 0) + 1;
  hinterZiel.set(nach, k);
  const pos = ziel.pos + ((naechste - ziel.pos) * k) / (Object.values(cfg.platzierung).filter((p) => p.nach === nach).length + 1);
  const refId = ziel.attr.match(/parentRefId="(\d+)"/)?.[1];
  const i = feXml.findIndex((x) => new RegExp(`<Type>[^<]*</Type>\\s*<Name>${name}</Name>`).test(x));
  feXml[i] = feXml[i]
    .replace(/<Entry(?:\s[^>]*)?>/, refId ? `<Entry parentRefId="${refId}">` : '<Entry>')
    .replace(/<ElementParent>[^<]*<\/ElementParent>/, `<ElementParent>${ziel.parent}</ElementParent>`)
    .replace(/(\n {15})<Position>[^<]*<\/Position>/, `$1<Position>${pos}</Position>`);
  report.push(`  ${name.padEnd(26)} hinter ${nach} (${ziel.parent || 'oberste Ebene'}, Position ${pos})`);
}

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

// Filter von OS-Feldern im abgeleiteten Formular ändern (das OS-Formular bleibt unverändert, E-8):
// osFilter: { Feldname: null } → Filter entfernen (immer sichtbar), { Feldname: 'Bedingung' } → neue Bedingung
for (const [name, bedingung] of Object.entries(cfg.osFilter ?? {})) {
  const re = new RegExp(`(<Entry[^>]*>\\s*<Type>[^<]*</Type>\\s*<Name>${name}</Name>[\\s\\S]*?</Entry>)`);
  const alt = df.match(re)?.[1];
  if (!alt) throw new Error(`osFilter: Feld ${name} nicht in ${cfg.basisFormular}`);
  let neu = alt.replace(/\s*<Filter>[\s\S]*?<\/Filter>/, '');
  if (bedingung) {
    const refs = [...new Set([...bedingung.matchAll(/([A-Za-z_]\w*)\s*(?:=|<>|->)/g)].map((m) => m[1]))];
    neu = neu.replace(/(<Datenart>[^<]*<\/Datenart>)/, `$1
               <Filter>
                  <Condition>${esc(bedingung)}</Condition>
                  <Valid>true</Valid>
                  <RefEntries>
${refs.map((r) => `                     <RefEntry>${r}</RefEntry>`).join('\n')}
                  </RefEntries>
               </Filter>`);
  }
  df = df.replace(alt, neu);
  report.push(`  OS-Feld ${name}: ${bedingung ? `sichtbar wenn ${bedingung}` : 'Filter entfernt (immer sichtbar)'}`);
}

// Unterformular tauschen (z. B. neuere OS-Fassung mit demselben Datenkatalog)
for (const [name, { formular, guid }] of Object.entries(cfg.unterformularTausch ?? {})) {
  const re = new RegExp(`(<Entry[^>]*>\\s*<Type>subform</Type>\\s*<Name>${name}</Name>[\\s\\S]*?</Entry>)`);
  const alt = df.match(re)?.[1];
  if (!alt) throw new Error(`unterformularTausch: Unterformular-Feld ${name} nicht in ${cfg.basisFormular}`);
  const vorher = alt.match(/<ReferencedDataForm>([^<]*)<\/ReferencedDataForm>/)[1];
  let neu = alt.replace(/<ReferencedDataForm>[^<]*<\/ReferencedDataForm>/, `<ReferencedDataForm>${formular}</ReferencedDataForm>`);
  neu = neu.replace(/<DataFormReferences>[\s\S]*?<\/DataFormReferences>/, (r) => set(set(r, 'Name', esc(formular)), 'GUID', guid));
  df = df.replace(alt, neu);
  report.push(`  Unterformular ${name}: ${vorher} → ${formular}`);
}

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
// eigene GUIDs eindeutig (Formularverweise dürfen dasselbe OS-Formular mehrfach nennen)
const guids = [...df.replace(/<DataFormReferences>[\s\S]*?<\/DataFormReferences>/g, '').matchAll(/<GUID>([^<]*)<\/GUID>/g)].map((m) => m[1]).filter((g) => g !== basisGuid);
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
