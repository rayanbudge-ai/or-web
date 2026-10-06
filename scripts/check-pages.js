/* Contrôles de cohérence du front (aucune dépendance) :
   1. pour chaque page, les classes HTML absentes du CSS compilé ;
   2. toutes les pages chargent le même fichier CSS (le dernier build) ;
   3. aucune couleur hex / rgb() littérale hors :root dans les sources CSS.

   Usage : `npm run build`, serveur lancé (`npm start`), puis
   `npm run check` (BASE=http://localhost:3100 pour un autre port).
   Code de sortie 1 si un contrôle échoue. */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FE = path.join(ROOT, 'frontend');
const BASE = process.env.BASE || 'http://localhost:3000';
const manifest = JSON.parse(fs.readFileSync(path.join(FE, 'dist', 'manifest.json'), 'utf8'));
const CSS = fs.readFileSync(path.join(FE, 'dist', manifest['styles.min.css']), 'utf8');

// Classes posées par du JS (états), à chercher aussi dans le CSS
const ROUTES = ['/', '/portfolio', '/contact', '/services', '/blog', '/mentions-legales',
  '/politique-de-confidentialite', '/services/creation-site-vitrine-bordeaux',
  '/services/creation-site-e-commerce-bordeaux', '/services/developpement-application-web-bordeaux',
  '/services/optimisation-seo-performance-bordeaux', '/blog/de-77-a-100-optimisation-core-web-vitals',
  '/blog/site-sur-mesure-ou-wordpress', '/projets/iznogrillz.html', '/projets/lhomme-invisible.html',
  '/projets/casa-terra.html', '/projets/voxline.html', '/projets/crm-or-web.html', '/page-inexistante'];

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const inCss = cls => new RegExp(`\\.${esc(cls)}(?![\\w-])`).test(CSS);

(async () => {
  let failed = false;
  const sheets = new Set();
  console.log('1. Classes HTML absentes du CSS compilé');
  for (const route of ROUTES) {
    const html = await (await fetch(BASE + route)).text();
    // Hors <script> (les templates JS embarqués ne sont pas du DOM)
    const dom = html.replace(/<script[\s\S]*?<\/script>/g, '');
    const classes = new Set();
    for (const m of dom.matchAll(/\sclass="([^"]*)"/g)) m[1].split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
    const missing = [...classes].filter(c => !inCss(c));
    if (missing.length) { failed = true; console.log(`   ✗ ${route} : ${missing.join(', ')}`); }
    for (const m of html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)) sheets.add(`${m[1]}`);
  }
  if (!failed) console.log('   ✓ aucune');

  console.log('2. Feuilles de style chargées');
  const expected = `/dist/${manifest['styles.min.css']}`;
  const ok = sheets.size === 1 && [...sheets][0].replace(/^\//, '') === expected.slice(1);
  console.log(`   ${ok ? '✓' : '✗'} ${[...sheets].join(', ')} (attendu : ${expected})`);
  if (!ok) failed = true;

  console.log('3. Couleurs en dur hors :root (frontend/css/*.css)');
  let colors = 0;
  for (const f of fs.readdirSync(path.join(FE, 'css'))) {
    const src = fs.readFileSync(path.join(FE, 'css', f), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, c => c.replace(/[^\n]/g, ' '))       // commentaires
      .replace(/:root\s*\{[\s\S]*?\n\}/g, c => c.replace(/[^\n]/g, ' ')) // blocs :root
      .replace(/url\("data:[^"]*"\)/g, '');                              // SVG inline (bruit)
    src.split('\n').forEach((line, i) => {
      if (/#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*\d/.test(line)) { colors++; console.log(`   ✗ css/${f}:${i + 1} ${line.trim()}`); }
    });
  }
  if (!colors) console.log('   ✓ aucune'); else failed = true;

  process.exit(failed ? 1 : 0);
})();
