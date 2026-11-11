// Erzeugt Mapping-Vorschläge nNGM → Onkostar aus den CSV-Exporten beider Seiten.
//   node mapping/tools/mapping-vorschlaege.mjs
//
// Schreibt:
//   vorschlaege/merkmalskataloge.csv   nNGM-Werteliste → passendster Onkostar-Merkmalskatalog
//   vorschlaege/formulare.csv          nNGM-Instrument → passendste Onkostar-Formulare
//   feld-mapping.csv                   Arbeitsdatei: eine Zeile je nNGM-Feld mit Vorschlag
//
// In feld-mapping.csv werden die Spalten ab "kategorie" von Hand gepflegt. Sie bleiben beim
// erneuten Ausführen erhalten (Zuordnung über "nngm_schluessel"); nur die Vorschlagsspalten
// werden neu berechnet.
import { resolve } from 'node:path';
import { MAPPING_DIR, readCsv, writeCsv, norm, splitWords } from './lib.mjs';

const P = (...p) => resolve(MAPPING_DIR, ...p);
const nngmFields = readCsv(P('nngm-datensatz', 'felder.csv'));
const nngmInstruments = readCsv(P('nngm-datensatz', 'instrumente.csv'));
const nngmDict = readCsv(P('nngm-datensatz', 'dictionary.csv'));
const osForms = readCsv(P('onkostar-bestand', 'formulare.csv'));
const osFormFields = readCsv(P('onkostar-bestand', 'formular-felder.csv'));
const osValues = readCsv(P('onkostar-bestand', 'merkmalskatalog-werte.csv'));
if (!nngmFields.length || !osFormFields.length) {
  throw new Error('Exporte fehlen – erst nngm-schema.mjs und onkostar-bestand.mjs ausführen');
}

// ---------------------------------------------------------------------------
// Textähnlichkeit

const STOPWORDS = new Set(('der die das des den dem und oder mit von vom im in am an auf zu zur zum fuer bei nach vor ' +
  'ein eine einer eines einem ist sind wurde wird werden ggf bzw falls welche welcher wenn als aus bis seit ueber ' +
  'unter durch nicht kein keine pro je sowie sonstige sonstiges weitere art the of and or').split(' '));
// Unterschiedliche Begriffe für dasselbe (nNGM → Onkostar), bei Bedarf ergänzen
const SYNONYMS = { todesdatum: 'sterbedatum', tod: 'sterbe', verstorben: 'sterbe', op: 'operation' };
// Grundwörter, an denen Komposita zerlegt werden ("operationsdatum" → "operation" + "datum")
const HEADS = ['datum', 'status', 'art', 'typ', 'ergebnis', 'grund', 'ort', 'nummer', 'version', 'methode', 'befund',
  'beginn', 'ende', 'lokalisation', 'klassifikation', 'therapie', 'stadium', 'untersuchung', 'material', 'gehalt'];
const GENERIC = new Set(['bemerkung', 'kommentar', 'gen', 'wert', 'name', 'beschreibung', 'angabe', 'anmerkung']);
function decompound(t) {
  for (const h of HEADS) {
    if (t.length >= h.length + 4 && t.endsWith(h)) {
      const prefix = t.slice(0, -h.length).replace(/s$/, '');
      return [t, SYNONYMS[prefix] ?? prefix, h];
    }
  }
  return [t];
}
const tokens = (s) => [...new Set(splitWords(s).filter((t) => t.length > 1 && !STOPWORDS.has(t))
  .map((t) => SYNONYMS[t] ?? t).flatMap(decompound))];

// Tokens gelten als gleich bei Gleichheit, gemeinsamem Präfix ab 5 Zeichen oder wenn eines das andere
// enthält. Bei deutschen Komposita steht das allgemeine Grundwort hinten: "raucherstatus" ~ "raucher"
// ist ein starker Treffer, "todesdatum" ~ "datum" nur ein schwacher.
// Kurze Präfixe ("tumor" in "tumorkonferenz") zählen nur schwach.
function tokenMatch(a, b) {
  if (a === b) return 1;
  if (a.length < 4 || b.length < 4) return 0;
  const ratio = Math.min(a.length, b.length) / Math.max(a.length, b.length);
  if (a.startsWith(b) || b.startsWith(a)) return ratio >= 0.5 ? 0.8 : 0.4;
  if (a.includes(b) || b.includes(a)) return 0.4;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return i >= 5 && i >= 0.6 * Math.min(a.length, b.length) ? 0.7 : 0;
}

function similarity(ta, tb) {
  if (!ta.length || !tb.length) return 0;
  let sum = 0;
  for (const a of ta) {
    let best = 0;
    for (const b of tb) best = Math.max(best, tokenMatch(a, b));
    sum += best;
  }
  let sumB = 0;
  for (const b of tb) {
    let best = 0;
    for (const a of ta) best = Math.max(best, tokenMatch(a, b));
    sumB += best;
  }
  return (sum + sumB) / (ta.length + tb.length);
}

const round = (x) => Math.round(x * 100) / 100;

// Bevorzugung nach Formular-Herkunft: nNGM ist ein Lungenkrebs-Netzwerk, daher zuerst die allgemeinen
// OS-Standardformulare, dann Lungen-spezifische, zuletzt Formulare anderer Entitäten/Zertifizierungen.
const FORM_PRIORITY = [
  [/^OS\./, 0.1],
  [/^OZLZ|Lungenkrebs/i, 0.05],
  [/^(OnkoZert|Onkozert|Adjumed|DGHO|Probase|UFA|DKG)\b/, -0.1],
];
const formPriority = (name) => FORM_PRIORITY.find(([re]) => re.test(name))?.[1] ?? 0;

// Merkmalskataloge erben die beste Priorität der Formulare, in denen sie verwendet werden;
// bei Gleichstand gewinnt der häufiger verwendete Katalog
const catalogPriority = new Map();
const catalogUses = new Map();
for (const e of osFormFields) {
  if (!e.merkmalskatalog) continue;
  const p = Math.max(formPriority(e.formular), /^OS\./.test(e.merkmalskatalog) ? 0.1 : -1);
  catalogPriority.set(e.merkmalskatalog, Math.max(catalogPriority.get(e.merkmalskatalog) ?? -1, p));
  catalogUses.set(e.merkmalskatalog, (catalogUses.get(e.merkmalskatalog) ?? 0) + 1);
}

// ---------------------------------------------------------------------------
// 1. Wertelisten: nNGM-Dictionary-Typ → Onkostar-Merkmalskatalog

const osCatalogs = new Map();
for (const v of osValues) {
  if (!osCatalogs.has(v.merkmalskatalog)) osCatalogs.set(v.merkmalskatalog, []);
  osCatalogs.get(v.merkmalskatalog).push({
    code: norm(v.code), texts: new Set([norm(v.kurztext), norm(v.beschreibung)].filter(Boolean)),
  });
}
const nngmTypes = new Map();
for (const d of nngmDict) {
  if (!nngmTypes.has(d.typ)) nngmTypes.set(d.typ, []);
  nngmTypes.get(d.typ).push(d);
}
const fieldsPerDict = new Map();
for (const f of nngmFields) if (f.dictionary) fieldsPerDict.set(f.dictionary, (fieldsPerDict.get(f.dictionary) ?? 0) + 1);

function matchCatalog(values, entries) {
  let byLabel = 0, byCode = 0;
  const missing = [];
  const usedOs = new Set();
  for (const v of values) {
    // Labels wie "ECOG 0 - normale Aktivität": auch den Kopf vor " - " und dessen letztes Wort ("0") prüfen
    const head = v.label.split(/\s+[-–:]\s+/)[0];
    // Rein numerische Werte ("1+" → "1") zählen nur als Code-, nicht als Text-Treffer
    const all = [norm(v.label), norm(v.code), norm(head)].filter(Boolean);
    const texts = all.filter((t) => /[a-z]/.test(t));
    const codes = [...all, norm(head.split(/\s+/).pop())].filter(Boolean);
    let hit = entries.findIndex((e) => texts.some((t) => e.texts.has(t)));
    if (hit >= 0) byLabel++;
    else {
      hit = entries.findIndex((e) => e.code && codes.includes(e.code));
      if (hit >= 0) byCode++;
      else missing.push(v.code);
    }
    if (hit >= 0) usedOs.add(hit);
  }
  const coverage = (byLabel + byCode) / values.length;
  const precision = usedOs.size / entries.length;
  // Reine Code-Treffer ("1", "2", ...) sind schwächer als Treffer über den Text
  const score = ((byLabel + 0.6 * byCode) / values.length) * 0.7 + precision * 0.3;
  return { byLabel, byCode, coverage, precision, score, missing };
}

const catalogSuggestion = new Map();
const catalogRows = [];
for (const [typ, values] of nngmTypes) {
  const ranked = [];
  for (const [name, entries] of osCatalogs) {
    const m = matchCatalog(values, entries);
    // Nicht verwendete Kataloge (-1) leicht abwerten, verwendete nach Herkunft gewichten
    if (m.byLabel + m.byCode > 0) {
      const bonus = 0.5 * (catalogPriority.get(name) ?? -0.2) + 0.02 * Math.log10(1 + (catalogUses.get(name) ?? 0));
      ranked.push({ name, size: entries.length, ...m, score: m.score + bonus });
    }
  }
  ranked.sort((a, b) => b.score - a.score);
  // Ohne Text-Treffer (nur Codes wie "1" = "1") ist eine Übereinstimmung zu oft Zufall
  const best = ranked.find((r) => r.byLabel > 0);
  const ok = best && best.coverage >= 0.5 && (best.byLabel + best.byCode >= 2 || values.length === 1);
  if (ok) catalogSuggestion.set(typ, best);
  catalogRows.push({
    nngm_dictionary: typ,
    anzahl_werte: values.length,
    verwendet_in_feldern: fieldsPerDict.get(typ) ?? 0,
    vorschlag_merkmalskatalog: ok ? best.name : '',
    abdeckung: ok ? round(best.coverage) : '',
    treffer_text: ok ? best.byLabel : '',
    treffer_code: ok ? best.byCode : '',
    os_anzahl_werte: ok ? best.size : '',
    score: ok ? round(best.score) : '',
    nicht_gefunden: ok ? best.missing.join(', ') : '',
    alternativen: ranked.filter((r) => r !== (ok ? best : null) && r.coverage >= 0.3).slice(0, 3)
      .map((r) => `${r.name} (${Math.round(r.coverage * 100)} %)`).join('; '),
  });
}
catalogRows.sort((a, b) => b.verwendet_in_feldern - a.verwendet_in_feldern || a.nngm_dictionary.localeCompare(b.nngm_dictionary));

// ---------------------------------------------------------------------------
// 2. Felder: nNGM-Feld → Onkostar-Formularfeld

// nNGM-Feldtyp → verträgliche Onkostar-Datentypen, Kategorie und ggf. fester Merkmalskatalog (typ-mapping.csv)
const TYPES = new Map(readCsv(P('typ-mapping.csv')).map((t) => [t.nngm_typ, {
  datentypen: t.onkostar_datentypen.split(',').map((s) => s.trim()).filter(Boolean),
  element: t.onkostar_element,
  kategorie: t.kategorie,
  katalog: t.fester_merkmalskatalog,
}]));
const unknownTypes = [...new Set(nngmFields.map((f) => f.typ))].filter((t) => t && !TYPES.has(t));
if (unknownTypes.length) console.warn(`  Warnung: Typen fehlen in typ-mapping.csv: ${unknownTypes.join(', ')}`);
const isMatchable = (typ) => (TYPES.get(typ)?.datentypen.length ?? 0) > 0 && !TYPES.get(typ).kategorie;
const fixedCatalogOf = (f) => (f.typ === 'Terminology' ? TERMINOLOGY_CATALOG[f.dictionary] : '') || TYPES.get(f.typ)?.katalog;
// Onkostar-Katalog je nNGM-Terminologie (Schema-Typ Terminology)
const TERMINOLOGY_CATALOG = {
  icd03morphology: 'ICD-O-3 Histologie', icd03topography: 'ICD-O-3 Lokalisation', atc: 'OS.Substanzen',
  gene: 'OS.Molekulargenetik', ngsDnaPanel: 'OS.MolDiag.Panels', ngsRnaPanel: 'OS.MolDiag.Panels',
};
const PATIENT = {
  birthdate: { feld: 'patient.geburtsdatum' },
  gender: { feld: 'patient.geschlecht', katalog: 'System.Geschlecht' },
};

const activeForms = new Set(osForms.filter((f) => f.aktiv === '1').map((f) => f.name));
const formInfo = new Map(osForms.map((f) => [f.name, f]));
const candidates = osFormFields
  .filter((e) => e.datenkatalog_feld && e.aktiv === '1' && activeForms.has(e.formular))
  .map((e) => ({
    ...e,
    labelTokens: tokens(e.label || e.datenkatalog_feld),
    nameTokens: tokens(e.datenkatalog_feld),
    contextTokens: tokens([e.formular, formInfo.get(e.formular)?.beschreibung, e.bereich].join(' ')),
    priority: formPriority(e.formular),
  }));
const candidatesByType = new Map();
for (const c of candidates) {
  if (!candidatesByType.has(c.datenkatalog_typ)) candidatesByType.set(c.datenkatalog_typ, []);
  candidatesByType.get(c.datenkatalog_typ).push(c);
}

const bySchluessel = new Map(nngmFields.map((f) => [f.schluessel, f]));
const instrumentLabel = new Map(nngmInstruments.map((i) => [i.name, i.label]));
for (const f of nngmFields) {
  const parts = f.schluessel.split('/');
  const parentLabels = [];
  for (let i = 2; i < parts.length; i++) parentLabels.push(bySchluessel.get(parts.slice(0, i).join('/'))?.label ?? '');
  f.labelTokens = tokens(f.label);
  f.contextTokens = tokens([instrumentLabel.get(f.instrument) ?? f.instrument_label, ...parentLabels].join(' '));
  f.parentLabels = parentLabels.filter(Boolean).join(' > ');
}

// Abdeckung der nNGM-Werte durch den Katalog eines Kandidaten, Code-Treffer halb gewichtet (null = nicht prüfbar)
const coverageCache = new Map();
function valueCoverage(dict, catalog) {
  const values = nngmTypes.get(dict), entries = osCatalogs.get(catalog);
  if (!values || !entries) return null;
  const key = dict + '\u0000' + catalog;
  if (!coverageCache.has(key)) {
    const m = matchCatalog(values, entries);
    coverageCache.set(key, (m.byLabel + 0.5 * m.byCode) / values.length);
  }
  return coverageCache.get(key);
}

function scoreCandidates(f, formBonus) {
  if (!isMatchable(f.typ)) return [];
  const types = TYPES.get(f.typ).datentypen;
  const fixedCatalog = fixedCatalogOf(f);
  const suggestedCatalog = fixedCatalog || catalogSuggestion.get(f.dictionary)?.name;
  // Ein passender Ja/Nein-Katalog sagt wenig, ein passender 7-Werte-Katalog (ECOG) viel
  const specificity = fixedCatalog ? 1 : Math.min(1, ((nngmTypes.get(f.dictionary)?.length ?? 2) - 1) / 4);
  // Allgemeine Ein-Wort-Labels ("Datum", "Ergebnis") sagen ohne Kontext wenig – Kontext stärker gewichten
  const generic = f.labelTokens.length <= 1 || f.labelTokens.every((t) => HEADS.includes(t) || GENERIC.has(t));
  const [wLabel, wContext] = generic ? [0.45, 0.45] : [0.65, 0.25];
  const scored = [];
  for (const t of types) {
    for (const c of candidatesByType.get(t) ?? []) {
      if (fixedCatalog && c.merkmalskatalog !== fixedCatalog) continue;
      const label = Math.max(similarity(f.labelTokens, c.labelTokens), 0.9 * similarity(f.labelTokens, c.nameTokens));
      const catalogMatch = suggestedCatalog && c.merkmalskatalog === suggestedCatalog;
      if (label < 0.3 && !catalogMatch) continue;
      const context = similarity(f.contextTokens, c.contextTokens);
      let score = wLabel * label + wContext * context + (t === types[0] ? 0.1 : 0.05) + c.priority;
      // Mehrfachauswahl passt zu Checkbox-Feldern (Mehrfachauswahl im Datenkatalog), Einfachauswahl nicht
      if (t === 'propertyCatalogue' && f.mehrfach) score += (f.mehrfach === 'ja') === (c.typ === 'checkbox') ? 0.05 : -0.1;
      if (catalogMatch) score += fixedCatalog ? 0.4 : 0.25 * specificity;
      else if (c.merkmalskatalog) {
        // Katalog, der kaum einen nNGM-Wert kennt, ist trotz passendem Label vermutlich falsch
        const cov = valueCoverage(f.dictionary, c.merkmalskatalog);
        if (cov !== null && cov < 0.25) continue;
        if (cov !== null) score += cov < 0.5 ? -0.25 : 0.2 * cov * specificity;
      }
      score += formBonus.get(c.formular) ?? 0;
      scored.push({ c, score, label, context, generic });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  // Dasselbe Datenkatalogfeld in mehreren Formularen nur einmal zeigen
  const seen = new Set();
  return scored.filter((s) => {
    const k = s.c.datenkatalog + '.' + s.c.datenkatalog_feld;
    return seen.has(k) ? false : (seen.add(k), true);
  });
}

const THRESHOLD = 0.55;

// Durchgang 1 ohne Formular-Kontext → je Instrument die Formulare mit den meisten guten Treffern
const instrumentForms = new Map();
for (const f of nngmFields) {
  if (f.referenz_typ === 'PatientDefinition') continue;
  const best = scoreCandidates(f, new Map())[0];
  if (!best || best.score < THRESHOLD) continue;
  if (!instrumentForms.has(f.instrument)) instrumentForms.set(f.instrument, new Map());
  const m = instrumentForms.get(f.instrument);
  m.set(best.c.formular, (m.get(best.c.formular) ?? 0) + best.score);
}
const formRows = [];
const formBonusFor = new Map();
for (const i of [...nngmInstruments, ...new Set(nngmFields.filter((f) => f.referenz_typ !== 'InstrumentDefinition').map((f) => f.instrument))]
  .map((i) => (typeof i === 'string' ? { name: i, label: i, visiten: '' } : i))) {
  const ranked = [...(instrumentForms.get(i.name) ?? new Map())].sort((a, b) => b[1] - a[1]);
  const dataFields = nngmFields.filter((f) => f.instrument === i.name && isMatchable(f.typ)).length;
  formBonusFor.set(i.name, new Map(ranked.slice(0, 2).map(([name], k) => [name, k === 0 ? 0.1 : 0.05])));
  formRows.push({
    nngm_instrument: i.name,
    nngm_label: i.label,
    nngm_visiten: i.visiten,
    datenfelder: dataFields,
    vorschlag_formular: ranked[0]?.[0] ?? '',
    vorschlag_beschreibung: formInfo.get(ranked[0]?.[0])?.beschreibung ?? '',
    gewicht: ranked[0] ? round(ranked[0][1]) : '',
    alternativen: ranked.slice(1, 4).map(([n, s]) => `${n} (${round(s)})`).join('; '),
  });
}

// Durchgang 2 mit Formular-Kontext → Feldvorschläge
const HUMAN_COLUMNS = ['kategorie', 'os_formular', 'os_datenkatalog', 'os_feld', 'os_merkmalskatalog', 'plugin', 'status', 'kommentar'];
const previous = new Map(readCsv(P('feld-mapping.csv')).map((r) => [r.nngm_schluessel, r]));
const mappingRows = [];
for (const f of nngmFields) {
  const row = {
    nngm_schluessel: f.schluessel,
    nngm_visiten: f.visiten,
    nngm_instrument: f.instrument,
    nngm_gruppe: f.parentLabels,
    nngm_feld: f.feld,
    nngm_label: f.label,
    nngm_typ: f.typ,
    nngm_wiederholbar: f.wiederholbar,
    nngm_mehrfach: f.mehrfach,
    nngm_dictionary: f.dictionary,
    nngm_definition: f.definition,
    nngm_fhir: f.fhir,
  };
  const dictSuggestion = catalogSuggestion.get(f.dictionary);
  const type = TYPES.get(f.typ);
  if (f.referenz_typ === 'PatientDefinition' && PATIENT[f.feld]) {
    row.kategorie_vorschlag = 'A';
    row.vorschlag_feld = PATIENT[f.feld].feld;
    row.vorschlag_merkmalskatalog = PATIENT[f.feld].katalog;
    row.vorschlag_begruendung = 'Patientenstammdaten';
    row.vorschlag_score = 1;
    row.vorschlag_sicherheit = 'hoch';
  } else if (f.typ === 'EntryId') {
    row.kategorie_vorschlag = 'A';
    row.vorschlag_feld = 'prozedur.id';
    row.vorschlag_begruendung = 'ID zum Reidentifizieren → ID des Onkostar-Formulareintrags';
    row.vorschlag_score = 1;
    row.vorschlag_sicherheit = 'hoch';
  } else if (type?.kategorie === 'Struktur') {
    row.kategorie_vorschlag = 'Struktur';
    row.vorschlag_begruendung = `Strukturelement → ${type.element}`;
  } else if (!isMatchable(f.typ)) {
    row.kategorie_vorschlag = type?.kategorie || 'C';
    row.vorschlag_begruendung = `nNGM-spezifischer Typ ${f.typ} – kein Onkostar-Standardfeld`;
  } else {
    const ranked = scoreCandidates(f, formBonusFor.get(f.instrument) ?? new Map());
    const best = ranked[0];
    if (best && best.score >= THRESHOLD) {
      const c = best.c;
      row.vorschlag_formular = c.formular;
      row.vorschlag_feld = `${c.datenkatalog}.${c.datenkatalog_feld}`;
      row.vorschlag_label = c.label;
      row.vorschlag_merkmalskatalog = c.merkmalskatalog;
      row.vorschlag_spalte = `${c.tabelle}.${c.spalte}`;
      row.vorschlag_score = round(best.score);
      const contextOk = !best.generic || best.context >= 0.3;
      row.vorschlag_sicherheit = best.score >= 0.9 && best.label >= 0.7 && contextOk ? 'hoch'
        : best.score >= 0.7 && contextOk ? 'mittel' : 'niedrig';
      const reasons = [`Label ${Math.round(best.label * 100)} %`, `Kontext ${Math.round(best.context * 100)} %`];
      if (dictSuggestion && c.merkmalskatalog === dictSuggestion.name) reasons.push(`Werteliste passt (${Math.round(dictSuggestion.coverage * 100)} %)`);
      row.vorschlag_begruendung = reasons.join(', ');
      if (c.datenkatalog_typ !== 'propertyCatalogue') row.kategorie_vorschlag = 'A';
      else row.kategorie_vorschlag = dictSuggestion && c.merkmalskatalog === dictSuggestion.name && dictSuggestion.coverage === 1 ? 'A' : 'B';
    } else {
      row.kategorie_vorschlag = 'C';
      row.vorschlag_begruendung = 'kein passendes Onkostar-Feld gefunden';
    }
    row.vorschlag_alternativen = ranked.slice(best && best.score >= THRESHOLD ? 1 : 0).slice(0, 3)
      .filter((s) => s.score >= 0.4)
      .map((s) => `${s.c.formular}: ${s.c.datenkatalog}.${s.c.datenkatalog_feld} (${round(s.score)})`).join('; ');
  }
  if (!row.vorschlag_merkmalskatalog && dictSuggestion) row.vorschlag_merkmalskatalog = dictSuggestion.name;
  const old = previous.get(f.schluessel);
  for (const col of HUMAN_COLUMNS) row[col] = old?.[col] ?? '';
  if (!row.status) row.status = 'offen';
  mappingRows.push(row);
}
const orphaned = [...previous.keys()].filter((k) => !bySchluessel.has(k));
if (orphaned.length) console.warn(`  Warnung: ${orphaned.length} Zeilen aus der alten feld-mapping.csv gibt es im Datensatz nicht mehr: ${orphaned.slice(0, 5).join(', ')} ...`);

// ---------------------------------------------------------------------------

writeCsv(P('vorschlaege', 'merkmalskataloge.csv'),
  ['nngm_dictionary', 'anzahl_werte', 'verwendet_in_feldern', 'vorschlag_merkmalskatalog', 'abdeckung', 'treffer_text',
    'treffer_code', 'os_anzahl_werte', 'score', 'nicht_gefunden', 'alternativen'], catalogRows);
writeCsv(P('vorschlaege', 'formulare.csv'),
  ['nngm_instrument', 'nngm_label', 'nngm_visiten', 'datenfelder', 'vorschlag_formular', 'vorschlag_beschreibung',
    'gewicht', 'alternativen'], formRows);
writeCsv(P('feld-mapping.csv'),
  ['nngm_schluessel', 'nngm_visiten', 'nngm_instrument', 'nngm_gruppe', 'nngm_feld', 'nngm_label', 'nngm_typ',
    'nngm_wiederholbar', 'nngm_mehrfach', 'nngm_dictionary', 'nngm_definition', 'nngm_fhir',
    'kategorie_vorschlag', 'vorschlag_formular', 'vorschlag_feld', 'vorschlag_label', 'vorschlag_merkmalskatalog',
    'vorschlag_spalte', 'vorschlag_score', 'vorschlag_sicherheit', 'vorschlag_begruendung', 'vorschlag_alternativen',
    ...HUMAN_COLUMNS], mappingRows);

const count = (k) => mappingRows.filter((r) => r.kategorie_vorschlag === k).length;
console.log(`Kategorien: A=${count('A')} B=${count('B')} C=${count('C')} D=${count('D')} Struktur=${count('Struktur')}`);
console.log(`Wertelisten mit Vorschlag: ${catalogSuggestion.size} von ${nngmTypes.size}`);
