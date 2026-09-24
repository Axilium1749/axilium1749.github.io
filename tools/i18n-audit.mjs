import fs from 'node:fs';
import path from 'node:path';

const files = ['index.html', 'demos/shawarma/index.html', 'demos/attendance/index.html', ...['index.html', 'menu.html', 'chef.html', 'admin.html'].map(name => `demos/mealhub/${name}`)];
const map = new Map();
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const add = value => {
    const normalized = value.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    if (/[А-Яа-яЁё]/.test(normalized)) {
      if (!map.has(normalized)) map.set(normalized, []);
      if (!map.get(normalized).includes(file)) map.get(normalized).push(file);
    }
  };
  for (const match of html.matchAll(/>([^<>]+)</g)) add(match[1]);
  for (const match of html.matchAll(/\b(?:alt|title|placeholder|aria-label|content|data-[\w-]+)="([^"]*)"/g)) add(match[1]);
}
for (const [i, [value, refs]] of [...map].entries()) console.log(`${i + 1}\t${value}\t${refs.join(',')}`);
console.error(`Unique strings: ${map.size}`);
