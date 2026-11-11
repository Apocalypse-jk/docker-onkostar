// Gemeinsame Hilfsfunktionen für die Mapping-Skripte (nur Node-Standardbibliothek).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';

export const MAPPING_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_DIR = resolve(MAPPING_DIR, '..');

// ---------------------------------------------------------------------------
// CSV (Semikolon, UTF-8 mit BOM, damit Excel Umlaute korrekt öffnet)

export function writeCsv(path, columns, rows) {
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[";\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [columns.map(esc).join(';')];
  for (const row of rows) lines.push(columns.map((c) => esc(row[c])).join(';'));
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, '﻿' + lines.join('\r\n') + '\r\n', 'utf8');
  console.log(`  ${path.slice(REPO_DIR.length + 1)} (${rows.length} Zeilen)`);
}

export function readCsv(path) {
  if (!existsSync(path)) return [];
  const text = readFileSync(path, 'utf8').replace(/^﻿/, '');
  const records = [];
  let field = '', record = [], quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ';') { record.push(field); field = ''; }
    else if (ch === '\n') { record.push(field.replace(/\r$/, '')); records.push(record); record = []; field = ''; }
    else field += ch;
  }
  if (field || record.length) { record.push(field); records.push(record); }
  const [header, ...data] = records;
  return data.filter((r) => r.some((v) => v !== '')).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

// ---------------------------------------------------------------------------
// Datenbank: Abfragen per `docker exec` gegen den MariaDB-Container

const DB = {
  container: process.env.OS_DB_CONTAINER || 'docker-onkostar-mariadb-1',
  user: process.env.OS_DB_USER || 'onkostar',
  password: process.env.OS_DB_PASSWORD || 'devpass',
  database: process.env.OS_DB_NAME || 'onkostar',
};

export function query(sql) {
  const out = execFileSync('docker', ['exec', '-i', DB.container, 'mariadb', '-u' + DB.user, '-p' + DB.password,
    '--default-character-set=utf8mb4', '-B', DB.database], { input: sql, maxBuffer: 1 << 30, stdio: ['pipe', 'pipe', 'ignore'] })
    .toString('utf8');
  const lines = out.split('\n').filter((l) => l !== '');
  if (!lines.length) return [];
  const unescape = (v) => v === 'NULL' ? '' : v.replace(/\\(.)/g, (_, c) => ({ n: '\n', t: '\t', '0': '', '\\': '\\' }[c] ?? c));
  const header = lines[0].split('\t');
  return lines.slice(1).map((l) => {
    const vals = l.split('\t');
    return Object.fromEntries(header.map((h, i) => [h, unescape(vals[i] ?? '')]));
  });
}

// ---------------------------------------------------------------------------
// XLSX lesen: minimaler ZIP-Reader + Parser für sharedStrings/Worksheets

function unzip(buffer) {
  let eocd = buffer.length - 22;
  while (eocd >= 0 && buffer.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('Keine gültige ZIP-Datei');
  const count = buffer.readUInt16LE(eocd + 10);
  let p = buffer.readUInt32LE(eocd + 16);
  const files = {};
  for (let i = 0; i < count; i++) {
    const method = buffer.readUInt16LE(p + 10);
    const size = buffer.readUInt32LE(p + 20);
    const nameLen = buffer.readUInt16LE(p + 28);
    const extraLen = buffer.readUInt16LE(p + 30);
    const commentLen = buffer.readUInt16LE(p + 32);
    const local = buffer.readUInt32LE(p + 42);
    const name = buffer.toString('utf8', p + 46, p + 46 + nameLen);
    const dataStart = local + 30 + buffer.readUInt16LE(local + 26) + buffer.readUInt16LE(local + 28);
    const data = buffer.subarray(dataStart, dataStart + size);
    files[name] = method === 8 ? inflateRawSync(data) : data;
    p += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

const decodeXml = (s) => s
  .replace(/_x([0-9A-Fa-f]{4})_/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).replace(/&amp;/g, '&');

const textOf = (xml) => [...xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((m) => decodeXml(m[1])).join('');

const colIndex = (ref) => [...ref.replace(/\d+/g, '')].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;

/** Liefert { Blattname: [[Zelle, ...], ...] } */
export function readXlsx(path) {
  const files = unzip(readFileSync(path));
  const str = (name) => files[name]?.toString('utf8') ?? '';
  const shared = [...str('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => textOf(m[1]));
  const rels = Object.fromEntries([...str('xl/_rels/workbook.xml.rels').matchAll(/<Relationship\b[^>]*>/g)]
    .map((m) => [m[0].match(/Id="([^"]+)"/)[1], m[0].match(/Target="([^"]+)"/)[1]]));
  const sheets = {};
  for (const m of str('xl/workbook.xml').matchAll(/<sheet\b[^>]*>/g)) {
    const name = decodeXml(m[0].match(/name="([^"]+)"/)[1]);
    const target = rels[m[0].match(/r:id="([^"]+)"/)[1]].replace(/^\/?(xl\/)?/, 'xl/');
    const rows = [];
    for (const r of str(target).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
      const row = [];
      for (const c of r[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const ref = c[1].match(/r="([A-Z]+\d+)"/)[1];
        const type = c[1].match(/t="([^"]+)"/)?.[1];
        const body = c[2] ?? '';
        const v = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
        let value = '';
        if (type === 's') value = shared[+v];
        else if (type === 'inlineStr') value = textOf(body);
        else if (v !== undefined) value = decodeXml(v);
        row[colIndex(ref)] = value.trim();
      }
      rows.push(Array.from(row, (v) => v ?? ''));
    }
    sheets[name] = rows;
  }
  return sheets;
}

// ---------------------------------------------------------------------------
// Text-Normalisierung und Ähnlichkeit für die Vorschläge

export function norm(s) {
  return String(s ?? '').toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '');
}

export function splitWords(s) {
  return String(s ?? '')
    .replace(/([a-zäöü])([A-ZÄÖÜ])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .split(/[^A-Za-zÄÖÜäöüß0-9]+/)
    .map(norm)
    .filter(Boolean);
}
