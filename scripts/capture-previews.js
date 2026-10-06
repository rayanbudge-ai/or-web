/* Génère les aperçus WebP des cartes portfolio (sites démos).

   Remplace les 3 iframes « live » des cartes, qui chargeaient chacune le site
   démo complet (vidéo mp4 de 1,4 Mo, Google Fonts tierces…) : ~2,7 Mo et 38
   requêtes sur /portfolio. Chaque aperçu = 3 écrans (1440 × 2700) réduits à
   720 px de large, défilés au survol de la carte (portfolio.css .pin-scroll).

   Usage : serveur lancé (npm start), puis `npm run capture:previews`
   (BASE=http://localhost:3017 pour un autre port). Relancer après toute
   modification visuelle d'un site démo, et committer les .webp produits. */
'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const BASE = process.env.BASE || 'http://localhost:3000';

// Doit rester aligné avec le champ `preview` de frontend/js/portfolio-data.js
const DEMOS = ['lhomme-invisible', 'casa-terra'];   // IznoGrillz : site en ligne, aperçu = capture fournie (hero.jpg)

const VIEW_W = 1440;
const VIEW_H = 900;
const SCREENS = 3;           // hauteur capturée = 3 écrans
const SCALE = 0.5;           // 1440 → 720 px : net en 2x sur une carte ~360 px

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: VIEW_W, height: VIEW_H, deviceScaleFactor: SCALE });
  // Mouvement réduit : les démos affichent leurs reveals sans attendre le scroll
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

  for (const id of DEMOS) {
    await page.goto(`${BASE}/projets/${id}/index.html`, { waitUntil: 'networkidle0', timeout: 60000 });
    // Parcours de la page pour déclencher les IntersectionObserver des démos
    await page.evaluate(async (h) => {
      document.documentElement.style.scrollBehavior = 'auto';
      for (let y = 0; y <= h; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 1200));
    }, VIEW_H * SCREENS);

    const height = Math.min(VIEW_H * SCREENS, await page.evaluate(() => document.documentElement.scrollHeight));
    const out = path.join(ROOT, 'frontend', 'projets', 'img', id, 'preview.webp');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await page.screenshot({
      path: out,
      type: 'webp',
      quality: 72,
      clip: { x: 0, y: 0, width: VIEW_W, height },
      captureBeyondViewport: true,
    });
    console.log(`OK ${id} → ${(fs.statSync(out).size / 1024).toFixed(0)} Kio (${VIEW_W * SCALE}×${height * SCALE})`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
