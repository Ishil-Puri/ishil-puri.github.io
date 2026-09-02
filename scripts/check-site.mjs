import { access, readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const failures = [];

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === '.git') continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }

  return files;
}

function report(file, message) {
  failures.push(`${relative(root, file)}: ${message}`);
}

const files = await htmlFiles(root);

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const page = relative(root, file);
  const pagePath = page.split('/').map(encodeURIComponent).join('/');
  const pageUrl = new URL(pagePath, 'https://example.test/');
  const anchors = [...html.matchAll(/<a\b([^>]*)>/gi)].map((match) => match[1]);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) report(file, `duplicate ids: ${duplicateIds.join(', ')}`);

  if (!page.startsWith('delight/')) {
    const delightLinks = anchors.filter((attributes) => /\bclass="[^"]*\bdelight-cloud\b[^"]*"/i.test(attributes));
    if (delightLinks.length !== 1) {
      report(file, 'expected one Delight control');
    } else {
      const href = delightLinks[0].match(/\bhref="([^"]+)"/i)?.[1];
      if (!href || new URL(href, pageUrl).pathname !== '/delight/') {
        report(file, 'Delight control must link to /delight/');
      }
    }
  }

  if (/<\/img\s*>/i.test(html)) report(file, 'img elements must not have closing tags');
  if (/<[^>]+\son[a-z]+\s*=/i.test(html)) report(file, 'inline event handler found');

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt="[^"]*"/i.test(match[1])) report(file, 'image is missing alt text');
  }

  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const label = /\baria-label="[^"]+"/i.test(match[1]);
    const text = match[2].replace(/<[^>]+>/g, '').replace(/&\w+;/g, '').trim();
    if (!label && !text) report(file, 'button is missing an accessible name');
  }

  for (const attributes of anchors) {
    if (/\btarget="_blank"/i.test(attributes) && !/\brel="[^"]*noopener[^"]*"/i.test(attributes)) {
      report(file, 'target="_blank" link is missing rel="noopener"');
    }
  }

  for (const match of html.matchAll(/\b(?:href|src|poster|data-src)="([^"]+)"/gi)) {
    const reference = match[1].replaceAll('&amp;', '&');
    if (/^(?:#|data:|mailto:|tel:|https?:|\/\/)/i.test(reference)) continue;

    const targetUrl = new URL(reference, pageUrl);
    const targetName = decodeURIComponent(targetUrl.pathname).replace(/^\/+/, '');
    const targetPath = join(root, !targetName || targetName.endsWith('/') ? `${targetName}index.html` : targetName);
    try {
      await access(targetPath);
    } catch {
      report(file, `missing local reference: ${reference}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${files.length} HTML files.`);
}
