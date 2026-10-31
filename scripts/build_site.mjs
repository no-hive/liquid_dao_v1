#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { marked, Renderer } from './vendor/marked.esm.js';

if (Number(process.versions.node.split('.')[0]) < 20) throw new Error('Rebuilding the site requires Node.js 20 or later. The included index.html is already ready to publish.');

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => readFile(resolve(root, name), 'utf8');
const escape = (text) => text.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain = (text) => text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const headings = [];
const usedIds = new Set();
let sectionId = 'overview';
const renderer = new Renderer();
renderer.heading = function ({ tokens, depth }) {
  const content = this.parser.parseInline(tokens);
  const label = plain(content);
  const numbered = depth === 3 && /^(\d+)\./.exec(label);
  let id = depth === 1 ? 'overview' : numbered ? `section-${numbered[1]}` : depth === 4 ? `${sectionId}-${slug(label)}` : slug(label);
  if (usedIds.has(id)) throw new Error(`Duplicate heading ID: ${id}`);
  usedIds.add(id);
  if (numbered) sectionId = id;
  headings.push({depth, label, id});
  return `<h${depth} id="${id}" tabindex="-1">${content}</h${depth}>\n`;
};

const markdown = await read('whitepaper.md');
// Keep editorial diagram instructions in the source, never on the reading page.
const publishable = markdown.replace(/^>\s*\*\*(?:Additional )?Diagram[^\n]*(?:\r?\n|$)/gm, '');
let content = marked.parse(publishable, { renderer, gfm: true });
const diagrams = [
  'Liquidity pool DAOs connected to the DEX DAO; connections 1–4',
  'The launchpad recognizes selected pool DAOs; connections 5–6',
  'The network DAO recognizes the DEX and launchpad; connections 7–8',
  'Additional connections to non-DAO protocol sources; connections 9–11',
  'Public goods funding protocols and DeFi eligibility; connection 12',
  'Public goods participation recognized by the network DAO',
  'Cross-chain recognition of Voting Power; connections 17–18',
];
let imageIndex = 0;
content = content.replace(/<img\b[^>]*>/g, (tag) => {
  const src = /src="([^"]+)"/.exec(tag)?.[1];
  if (!src?.startsWith('assets/diagrams/')) throw new Error(`Unexpected diagram path: ${src}`);
  const width = /width="(\d+)"/.exec(tag)?.[1];
  const height = /height="(\d+)"/.exec(tag)?.[1];
  const dimensions = width && height ? ` width="${width}" height="${height}"` : '';
  const alt = diagrams[imageIndex++] ?? 'Liquid DAO ecosystem diagram';
  return `<figure class="diagram"><a href="${escape(src)}" target="_blank" rel="noopener" aria-label="${escape(`Open full-size diagram: ${alt}`)}"><img src="${escape(src)}" alt="${escape(alt)}"${dimensions} loading="lazy" decoding="async"></a></figure>`;
});
content = content.replace(/<table>/g, '<div class="table-scroll" role="region" aria-label="Voting Power comparison table" tabindex="0"><table>').replace(/<\/table>/g, '</table></div>');
const toc = headings.map(({depth, label, id}) => `<a class="toc-level-${depth}" href="#${id}" tabindex="-1">${escape(label)}</a>`).join('\n');
const [template, css, js] = await Promise.all([read('site/template.html'), read('site/styles.css'), read('site/app.js')]);
const typography = await read('site/typography.css');
const wavesCss = await read('site/waves.css');
const wavesJs = await read('site/waves.js');
const values = { CONTENT: content, TOC: toc, CSS: css + '\n' + typography + '\n' + wavesCss, JS: js + '\n' + wavesJs };
const html = template.replace(/@@(CONTENT|TOC|CSS|JS)@@/g, (_, key) => values[key]);
if (/@@[A-Z]+@@/.test(html)) throw new Error('Unresolved template placeholder');
await writeFile(resolve(root, 'index.html'), html);
console.log(`Built index.html: ${headings.length} headings, ${imageIndex} diagrams. No install step required.`);
