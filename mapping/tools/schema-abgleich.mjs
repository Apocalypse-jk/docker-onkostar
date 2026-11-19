// Vergleicht unser nNGM-Schema (nngm_schema/schema.xml) mit dem aktuellen Live-Schema des nNGM und meldet
// neue, entfallene und geänderte Felder und Werte.
//
//   node mapping/tools/schema-abgleich.mjs                      # lädt das Live-Schema und vergleicht
//   node mapping/tools/schema-abgleich.mjs --datei <pfad>       # vergleicht mit einer lokalen Datei statt Live
//   node mapping/tools/schema-abgleich.mjs --speichern <pfad>   # Live-Schema zusätzlich als Datei ablegen
//   node mapping/tools/schema-abgleich.mjs --bericht <pfad.md>  # Ergebnis zusätzlich als Markdown schreiben
//
// Quelle: dieselbe URL, aus der das Maven-Paket dev.pcvolkmer.nngm:nngm-model wöchentlich generiert wird
// (siehe nngm_schema/README.md). Beide Schreibweisen des Schemas (benannte oder eingebettete Typen) werden
// verstanden: verglichen wird die aufgelöste Struktur je Feldpfad, nicht der Dateitext.
// Exit-Code: 0 = keine Unterschiede, 1 = Unterschiede, 2 = Fehler.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { REPO_DIR, parseXml, kids, kid, docOf } from './lib.mjs';

const LIVE_URL = 'https://nngm-demo.medicalsyn.com/api/v1/xml/schema?useNamedTypes=true';
const LOKAL = resolve(REPO_DIR, 'nngm_schema', 'schema.xml');

const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };

// ---------------------------------------------------------------------------
// Schema → Map Feldpfad → Signatur

function flach(text) {
  const schema = kid(parseXml(text), 'schema');
  if (!schema) throw new Error('Kein <xs:schema> gefunden');
  const complexTypes = new Map(kids(schema, 'complexType').map((t) => [t.attrs.name, t]));
  const simpleTypes = new Map(kids(schema, 'simpleType').map((t) => [t.attrs.name, t]));
  const typName = (el) => el.attrs.type?.replace(/^tns:/, '');
  const felder = new Map();

  const kinder = (ct) => {
    const out = [];
    const walk = (n) => { for (const c of n.children) { if (c.name === 'element') out.push(c); else if (['sequence', 'choice', 'all', 'complexContent', 'extension'].includes(c.name)) walk(c); } };
    walk(ct);
    return out;
  };

  const besuche = (el, pfad, tiefe) => {
    if (tiefe > 40) throw new Error(`Rekursion bei ${pfad}`);
    const name = el.attrs.name ?? el.attrs.ref?.replace(/^tns:/, '');
    const p = pfad ? `${pfad}/${name}` : name;
    const ct = kid(el, 'complexType') ?? complexTypes.get(typName(el));
    const st = kid(el, 'simpleType') ?? simpleTypes.get(typName(el));
    const r = st && kid(st, 'restriction');
    const facette = (n) => (r && kid(r, n)?.attrs.value) ?? '';
    felder.set(p, {
      label: docOf(el),
      min: el.attrs.minOccurs ?? '1',
      max: el.attrs.maxOccurs ?? '1',
      basis: ct ? 'complex' : (r?.attrs.base ?? el.attrs.type ?? '').replace(/^(xs|tns):/, ''),
      facetten: ['maxLength', 'minInclusive', 'maxInclusive', 'pattern', 'fractionDigits'].map((f) => facette(f) && `${f}=${facette(f)}`).filter(Boolean).join(' '),
      werte: new Map((r ? kids(r, 'enumeration') : []).map((e) => [e.attrs.value, docOf(e)])),
    });
    if (ct) for (const k of kinder(ct)) besuche(k, p, tiefe + 1);
  };
  for (const el of kids(schema, 'element')) besuche(el, '', 0);
  return { version: schema.attrs.version, felder };
}

// ---------------------------------------------------------------------------
// Laden

async function ladeLive() {
  const res = await fetch(LIVE_URL, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`Live-Schema: HTTP ${res.status}`);
  return res.text();
}

let alt, neu, quelle;
try {
  alt = flach(readFileSync(LOKAL, 'utf8'));
  const datei = arg('--datei');
  const text = datei ? readFileSync(datei, 'utf8') : await ladeLive();
  quelle = datei ?? LIVE_URL;
  if (!datei && arg('--speichern')) writeFileSync(arg('--speichern'), text);
  neu = flach(text);
} catch (e) {
  console.error(`Fehler: ${e.message}`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Vergleich

const nurLeerzeichen = (a, b) => a !== b && a.trim() === b.trim();
const zeilen = [];
const abschnitt = (titel, liste) => { if (liste.length) zeilen.push('', `## ${titel} (${liste.length})`, '', ...liste.map((x) => `- ${x}`)); };

const neueFelder = [...neu.felder.keys()].filter((p) => !alt.felder.has(p));
const entfallen = [...alt.felder.keys()].filter((p) => !neu.felder.has(p));
const geaendert = [], werteNeu = [], werteWeg = [], labels = [], leerzeichen = [];

for (const [p, a] of alt.felder) {
  const b = neu.felder.get(p);
  if (!b) continue;
  for (const k of ['min', 'max', 'basis', 'facetten']) if (a[k] !== b[k]) geaendert.push(`\`${p}\`: ${k} \`${a[k] || '–'}\` → \`${b[k] || '–'}\``);
  if (a.label !== b.label) labels.push(`\`${p}\`: „${a.label}“ → „${b.label}“`);
  const weg = [...a.werte.keys()].filter((c) => !b.werte.has(c));
  const dazu = [...b.werte.keys()].filter((c) => !a.werte.has(c));
  for (const c of [...weg]) {
    const partner = dazu.find((d) => nurLeerzeichen(c, d));
    if (partner !== undefined) { leerzeichen.push(`\`${p}\`: „${c}“ → „${partner}“`); weg.splice(weg.indexOf(c), 1); dazu.splice(dazu.indexOf(partner), 1); }
  }
  for (const c of dazu) werteNeu.push(`\`${p}\`: \`${c}\`${b.werte.get(c) ? ` (${b.werte.get(c)})` : ''}`);
  for (const c of weg) werteWeg.push(`\`${p}\`: \`${c}\`${a.werte.get(c) ? ` (${a.werte.get(c)})` : ''}`);
  for (const [c, l] of a.werte) if (b.werte.has(c) && b.werte.get(c) !== l) labels.push(`\`${p}\` Wert \`${c}\`: „${l}“ → „${b.werte.get(c)}“`);
}

abschnitt('Neue Felder', neueFelder.map((p) => `\`${p}\`${neu.felder.get(p).label ? ` – ${neu.felder.get(p).label}` : ''}`));
abschnitt('Entfallene Felder', entfallen.map((p) => `\`${p}\``));
abschnitt('Geänderte Felddefinitionen (Pflicht, Wiederholung, Typ, Grenzen)', geaendert);
abschnitt('Neue Werte', werteNeu);
abschnitt('Entfallene Werte', werteWeg);
abschnitt('Geänderte Beschriftungen', labels);
abschnitt('Werte, die sich nur in Leerzeichen unterscheiden', leerzeichen);

const relevant = neueFelder.length + entfallen.length + geaendert.length + werteNeu.length + werteWeg.length;
const kopf = [
  '# nNGM-Schema-Abgleich',
  '',
  `- Lokal: \`nngm_schema/schema.xml\`, Version ${alt.version}, ${alt.felder.size} Feldpfade`,
  `- Vergleich: ${quelle}, Version ${neu.version}, ${neu.felder.size} Feldpfade`,
  `- Stand: ${new Date().toISOString().slice(0, 10)}`,
  '',
  relevant || labels.length || leerzeichen.length
    ? `**Ergebnis:** ${relevant} inhaltliche Unterschiede, ${labels.length} geänderte Beschriftungen, ${leerzeichen.length} nur Leerzeichen.`
    : '**Ergebnis:** keine Unterschiede.',
];
if (alt.version !== neu.version) kopf.push('', `**Neue Schema-Version:** ${alt.version} → ${neu.version}`);
const bericht = [...kopf, ...zeilen, ''].join('\n');
console.log(bericht);
if (arg('--bericht')) writeFileSync(arg('--bericht'), bericht);
process.exit(relevant || labels.length || alt.version !== neu.version ? 1 : 0);
