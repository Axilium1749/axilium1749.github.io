import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const root = path.resolve('.');
const pages = [
  'index.html', 'demos/forma/index.html', 'demos/shawarma/index.html', 'demos/attendance/index.html',
  'demos/attendance/index.html?preview=attendance',
  'demos/mealhub/index.html', 'demos/mealhub/menu.html',
  'demos/mealhub/chef.html', 'demos/mealhub/admin.html'
];
const profile = fs.mkdtempSync(path.join(root, '.i18n-browser-'));
const russianProfile = fs.mkdtempSync(path.join(root, '.i18n-browser-ru-'));
try {
  for (const page of pages) {
    const [file, query] = page.split('?');
    const url = new URL('file:///' + path.join(root, file).replaceAll('\\', '/')).href + (query ? `?${query}` : '');
    const result = spawnSync(chrome, [
      '--headless', '--no-sandbox', '--disable-gpu', '--disable-gpu-compositing',
      '--disable-software-rasterizer', '--in-process-gpu', '--no-first-run',
      '--disable-extensions', '--lang=en-US', `--user-data-dir=${profile}`,
      '--virtual-time-budget=1500', '--dump-dom', url
    ], { encoding: 'utf8', timeout: 15000, maxBuffer: 12 * 1024 * 1024 });
    const html = result.stdout;
    if (!html.includes('<html lang="en"') || /<html[^>]*data-i18n-loading=/.test(html)) {
      throw new Error(`${page}: English page did not finish loading. ${result.stderr.slice(-300)}`);
    }
    const visible = html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\sdata-[\w-]+=(?:"[^"]*"|'[^']*')/gi, '');
    const strings = [
      ...[...visible.matchAll(/>([^<>]+)</g)].map(match => match[1].trim()),
      ...[...visible.matchAll(/\b(?:alt|title|placeholder|aria-label|content)="([^"]*)"/g)].map(match => match[1])
    ].filter(value => /[А-Яа-яЁё]/.test(value));
    if (strings.length) throw new Error(`${page}: untranslated strings: ${[...new Set(strings)].slice(0, 20).join(' | ')}`);
    if (page === 'index.html') {
      for (const name of ['attendance', 'mealhub', 'forma', 'shawarma']) {
        if (!html.includes(`src="assets/${name}-preview-en.png"`)) {
          throw new Error(`English ${name} preview was not selected`);
        }
      }
    }
    console.log(`OK ${page}`);
  }
  const russian = spawnSync(chrome, [
    '--headless', '--no-sandbox', '--disable-gpu', '--disable-gpu-compositing',
    '--disable-software-rasterizer', '--in-process-gpu', '--no-first-run',
    '--disable-extensions', '--lang=ru-RU', `--user-data-dir=${russianProfile}`,
    '--virtual-time-budget=1500', '--dump-dom',
    new URL('file:///' + path.join(root, 'index.html').replaceAll('\\', '/')).href
  ], { encoding: 'utf8', timeout: 15000, maxBuffer: 12 * 1024 * 1024 }).stdout;
  if (!russian.includes('<html lang="ru"') ||
      !['attendance', 'mealhub', 'forma', 'shawarma'].every(name => russian.includes(`src="assets/${name}-preview.png"`))) {
    throw new Error('Russian preview selection failed');
  }
  console.log('OK Russian previews');
} finally {
  for (const profilePath of [profile, russianProfile]) {
    const target = path.resolve(profilePath);
    if (!target.startsWith(root + path.sep)) throw new Error('Unsafe browser profile path');
    fs.rmSync(target, { recursive: true, force: true, maxRetries: 8, retryDelay: 500 });
  }
}
