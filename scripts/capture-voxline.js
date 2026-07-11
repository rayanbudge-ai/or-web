/* Génère les captures PNG portfolio pour Voxline Hub (maquettes anonymisées). */
'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'frontend', 'projets', 'img', 'voxline');
const BASE = 'http://localhost:3000/projets/voxline/capture';

const PAGES = [
  { slug: 'dashboard', file: 'dashboard.png', height: 720 },
  { slug: 'prospects', file: 'prospects.png', height: 820 },
  { slug: 'prospect',  file: 'prospect.png',  height: 780 },
  { slug: 'admin',     file: 'admin.png',     height: 820 },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  for (const p of PAGES) {
    await page.goto(`${BASE}/${p.slug}.html`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.screenshot({
      path: path.join(OUT, p.file),
      clip: { x: 0, y: 0, width: 1280, height: p.height },
    });
    console.log('OK', p.file);
  }

  await browser.close();
  console.log('Captures →', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});