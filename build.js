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
const { execFileSync, spawn } = require('child_process');

const FRONTEND = path.join(__dirname, 'frontend');
const DIST = path.join(FRONTEND, 'dist');

// ⚠️ L'ordre compte.
// CSS : ordre du cascade (base d'abord, puis sections). Identique à l'ancien
//       enchaînement de <link> dans index.html.
const CSS_FILES = [
  'css/fonts.css',      // @font-face en premier (déclaré avant toute utilisation)
  'css/base.css',       // tokens (:root) — seules couleurs en dur du site
  'css/editorial.css',  // conteneur, grille, marginalia, masque de ligne
  'css/components.css', // composants partagés : boutons, cartes, lignes, en-tête, pied…
  'css/navbar.css',
  'css/home.css',
  'css/panels.css',     // panneaux Services/Méthode/Contact de l'accueil
  'css/scene.css',      // fond commun (.ambient)
  'css/reveal.css',     // langage d'animation d'entrée (pages internes)
  'css/portfolio.css',
  'css/contact.css',
  'css/pages.css',      // pages générées : services, blog, légal, études de cas
  'css/effects.css',    // en dernier : View Transitions
];
// JS : ordre des dépendances.
const JS_FILES = [
  'js/navigation.js',
  'js/reveal.js',           // OrReveal (après navigation : page active posée ; avant accueil qui l'utilise)
  'js/accueil.js',          // accueil : étapes intro/home/panel
  'js/portfolio-data.js',   // données + templates (avant portfolio.js qui les consomme)
  'js/portfolio.js',
  'js/form.js',
];
// Pages générées par build-pages.js : pas de SPA, juste le reveal + header.
const PAGES_JS_FILES = [
  'js/reveal.js',
  'js/pages.js',
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

  const css = await esbuild.transform(concat(CSS_FILES), { loader: 'css', minify: true });
  // mode script : pas de renommage des globales (handlers inline du HTML)
  const js = await esbuild.transform(concat(JS_FILES), { loader: 'js', minify: true });
  const pagesJs = await esbuild.transform(concat(PAGES_JS_FILES), { loader: 'js', minify: true });

  // Noms fingerprintés + manifest consommé par server.js et build-pages.js.
  // Les noms stables restent écrits en fallback (dev sans manifest, liens directs).
  // Les anciens hashes ne sont pas nettoyés : dist/ est gitignoré et Render
  // repart d'un build vierge à chaque déploiement.
  const manifest = {};
  const kb = (n) => (n / 1024).toFixed(1) + ' KiB';
  const out = [];
  for (const [stable, code] of [['styles.min.css', css.code], ['app.min.js', js.code], ['pages.min.js', pagesJs.code]]) {
    const hashed = stable.replace(/\.min\./, `.${hashOf(code)}.min.`);
    fs.writeFileSync(path.join(DIST, stable), code);
    fs.writeFileSync(path.join(DIST, hashed), code);
    manifest[stable] = hashed;
    out.push(`dist/${hashed} (${kb(code.length)})`);
  }
  fs.writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Build OK → ${out.join(', ')}`);

  // Pages générées régénérées à CHAQUE build (y compris en --watch) : elles
  // référencent le CSS par son nom fingerprinté. Avant, `npm run dev` ne
  // relançait que ce fichier et les pages gardaient l'ancien hash (CSS périmé).
  // Processus séparé : relit portfolio-data.js et index.html à chaque fois.
  execFileSync(process.execPath, [path.join(__dirname, 'build-pages.js')], { stdio: 'inherit' });
}

const WATCH = process.argv.includes('--watch');

/* Mode dev : le serveur est lancé ICI et relancé après chaque build réussi.
   server.js ne lit index.html, manifest.json et portfolio-data.js qu'au
   démarrage : un serveur lancé à part (npm start) continuait à servir les
   anciens bundles après un rebuild — d'où des corrections « invisibles ». */
let server = null;
function restartServer() {
  const start = () => {
    server = spawn(process.execPath, [path.join(__dirname, 'server.js')], { stdio: 'inherit', env: process.env });
    server.on('exit', (code) => { if (code && code !== 1) console.error(`Serveur arrêté (code ${code})`); });
  };
  if (!server || server.exitCode !== null) return start();
  // On attend la vraie fin de l'ancien processus : sinon le nouveau tombe sur
  // un port encore occupé (EADDRINUSE).
  server.removeAllListeners('exit');
  server.once('exit', start);
  server.kill();
}

build().then(() => { if (WATCH) restartServer(); }).catch((err) => {
  console.error('Build échoué :', err);
  process.exit(1);
});

// Mode dev (`npm run dev`) : rebuild auto des bundles ET des pages, puis
// redémarrage du serveur.
if (WATCH) {
  console.log('Watch actif — CSS/JS, index.html, build-pages.js et server.js : rebuild + redémarrage du serveur…');
  let pending = false;
  const onChange = (file) => {
    if (!file || String(file).includes('dist') || pending) return;
    // Sources CSS/JS, et index.html (la barre de pied y est lue par build-pages)
    if (!/\.(css|js)$/.test(file) && !/^index\.html$/.test(file)) return;
    pending = true;
    setTimeout(() => {
      pending = false;
      build().then(restartServer).catch((err) => console.error('Rebuild échoué :', err));
    }, 50);
  };
  // Les sorties de build-pages (.html hors index.html, sitemap) sont filtrées
  // par onChange : pas de boucle.
  fs.watch(FRONTEND, { recursive: true }, (_evt, file) => onChange(file));
  fs.watch(path.join(__dirname, 'build-pages.js'), () => onChange('build-pages.js'));
  fs.watch(path.join(__dirname, 'server.js'), () => onChange('server.js'));
  // Arrêt de npm run dev : le serveur enfant part avec lui
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { if (server) server.kill(); process.exit(0); });
}
