import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const originals = execFileSync(process.execPath, ['tools/i18n-audit.mjs'], { encoding: 'utf8' })
  .trim().split(/\r?\n/).map(line => line.split('\t')[1]);
const dictionary = JSON.parse(fs.readFileSync('tools/en-dictionary.json', 'utf8'));
const missing = originals.filter(original => !dictionary[original]);
if (missing.length) throw new Error(`Missing translations: ${missing.join(', ')}`);
const runtime = fs.readFileSync('tools/i18n-runtime.template.js', 'utf8');
fs.writeFileSync('i18n.js', runtime.replace('/* DICTIONARY */ {}', JSON.stringify(dictionary, null, 2)).trimEnd() + '\n');
