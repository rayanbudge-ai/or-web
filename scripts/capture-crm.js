/* Génère les captures PNG portfolio pour le CRM Or-Web (maquettes anonymisées).

   Le CRM réel est un dépôt privé derrière authentification : on ne capture pas
   l'application en production. La maquette de frontend/projets/crm-or-web/capture
   rejoue son interface avec des données fictives et les identités floutées.

   Prérequis : `npm start` (le serveur sert les fichiers statiques sur :3000). */
'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'frontend', 'projets', 'img', 'crm-or-web');
const BASE = 'http://localhost:3000/projets/crm-or-web/capture';

const PAGES = [
  { slug: 'dashboard', file: 'dashboard.png', height: 900 },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // 1.5x plutot que 2x : la capture s'affiche au plus dans un cadre de ~700px
  // (hero de l'etude de cas). 1920px de large laisse la marge retina utile et
  // pese 313 Ko au lieu de 479 Ko.
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });

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
