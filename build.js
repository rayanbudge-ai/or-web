/* ──────────────────────────────────────────────────────────────────────────
   BUILD STEP — concatène + minifie les sources CSS/JS du front en un seul
   bundle de prod chacun, afin de réduire le nombre de requêtes HTTP critiques
   (problème Core Web Vitals mobile : 13 requêtes bloquantes → 2).

   Les fichiers sources (frontend/css/*.css, frontend/js/*.js) restent intacts
   pour le développement. Le build génère frontend/dist/styles.min.css et
   frontend/dist/app.min.js, vers lesquels pointe index.html en prod.

   esbuild est utilisé en mode `transform` (pas `bundle`) : on concatène nous-
   mêmes les fichiers dans l'ordre du cascade/dépendances, puis on minifie. En
   mode script (non-module), esbuild ne renomme PAS les identifiants top-level,
   ce qui est essentiel ici : les handlers inline du HTML (submitForm,
   toggleMenu, liveVal, blurField…) référencent des fonctions globales qui
   doivent garder leur nom.
   ────────────────────────────────────────────────────────────────────────── */
const esbuild = require('esbuild');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const FRONTEND = path.join(__dirname, 'frontend');
const DIST = path.join(FRONTEND, 'dist');

// ⚠️ L'ordre compte.
// CSS : ordre du cascade (base d'abord, puis sections). Identique à l'ancien
//       enchaînement de <link> dans index.html.
const CSS_FILES = [
  'css/fonts.css',     // @font-face en premier (déclaré avant toute utilisation)
  'css/base.css',
  'css/editorial.css',
  'css/navbar.css',
  'css/home.css',
  'css/portfolio.css',
  'css/contact.css',
  'css/footer.css',
  'css/pages.css',     // pages d'atterrissage services + blog (générées par build-pages.js)
];
// JS : ordre des dépendances. reveal.js (triggerReveal) avant navigation.js
//      qui l'appelle, exactement comme l'ancien enchaînement de <script>.
const JS_FILES = [
  'js/reveal.js',
  'js/navigation.js',
  'js/portfolio-data.js',   // données + templates (avant portfolio.js qui les consomme)
  'js/portfolio.js',
  'js/form.js',
  'js/footer.js',
  'js/flowfield.js',
];

function concat(files) {
  return files
    .map((f) => `/* ── ${f} ── */\n${fs.readFileSync(path.join(FRONTEND, f), 'utf8')}`)
    .join('\n');
}

// Empreinte courte du contenu — le nom du fichier change quand le contenu change,
// ce qui permet un Cache-Control immutable d'un an sans jamais servir du périmé.
function hashOf(code) {
  return crypto.createHash('md5').update(code).digest('hex').slice(0, 8);
}

async function build() {
  fs.mkdirSync(DIST, { recursive: true });

  const css = await esbuild.transform(concat(CSS_FILES), {
    loader: 'css',
    minify: true,
  });
  const js = await esbuild.transform(concat(JS_FILES), {
    loader: 'js',
    minify: true,
    // mode script : pas de renommage des globales (handlers inline du HTML)
  });

  // Noms fingerprintés + manifest consommé par server.js et build-pages.js.
  // Les noms stables restent écrits en fallback (dev sans manifest, liens directs).
  // Les anciens hashes ne sont pas nettoyés : dist/ est gitignoré et Render
  // repart d'un build vierge à chaque déploiement.
  const cssName = `styles.${hashOf(css.code)}.min.css`;
  const jsName = `app.${hashOf(js.code)}.min.js`;
  fs.writeFileSync(path.join(DIST, 'styles.min.css'), css.code);
  fs.writeFileSync(path.join(DIST, cssName), css.code);
  fs.writeFileSync(path.join(DIST, 'app.min.js'), js.code);
  fs.writeFileSync(path.join(DIST, jsName), js.code);
  fs.writeFileSync(
    path.join(DIST, 'manifest.json'),
    JSON.stringify({ 'styles.min.css': cssName, 'app.min.js': jsName }, null, 2)
  );

  const kb = (n) => (n / 1024).toFixed(1) + ' KiB';
  console.log(`Build OK → dist/${cssName} (${kb(css.code.length)}), dist/${jsName} (${kb(js.code.length)})`);
}

build().catch((err) => {
  console.error('Build échoué :', err);
  process.exit(1);
});

// Mode dev : rebuild auto à chaque modif d'une source CSS/JS (`npm run dev`).
if (process.argv.includes('--watch')) {
  console.log('Watch actif — modifie frontend/css/*.css ou frontend/js/*.js…');
  let pending = false;
  fs.watch(FRONTEND, { recursive: true }, (_evt, file) => {
    if (!file || String(file).includes('dist')) return;
    if (!/\.(css|js)$/.test(file) || pending) return;
    pending = true;
    setTimeout(() => {
      pending = false;
      build().catch((err) => console.error('Rebuild échoué :', err));
    }, 50);
  });
}
