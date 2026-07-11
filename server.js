const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const portfolio = require('./frontend/js/portfolio-data');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Derrière le proxy Render (HTTPS terminé en amont) : req.ip = vraie IP client,
// indispensable pour que le rate-limit ne compte pas tout le monde sur l'IP du proxy.
app.set('trust proxy', 1);

// Middlewares. Le front est same-origin (non affecté par CORS) ; on ne liste que
// les origines du site pour ne pas exposer l'API à n'importe quel domaine tiers.
app.use(compression()); // gzip/brotli — Render ne compresse pas pour les web services
app.use(cors({ origin: ['https://or-web.fr', 'https://www.or-web.fr'] }));
app.use(express.json({ limit: '32kb' }));

// Log de requêtes : API, pages HTML et erreurs. Les assets servis avec succès
// sont tus pour ne pas noyer les logs Render.
app.use((req, res, next) => {
  const t0 = process.hrtime.bigint();
  res.on('finish', () => {
    const isAsset = /\.[a-zA-Z0-9]+$/.test(req.path) && !req.path.endsWith('.html');
    if (isAsset && res.statusCode < 400) return;
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(0)}ms`);
  });
  next();
});

/* ──────────────────────────────────────────────────────────────────────────
   RENDU SEO (SSR léger)
   index.html sert 3 routes AE (/, /portfolio, /contact) : sans ça, elles renvoyaient toutes
   le même <title> et un canonical pointant vers "/", et le contenu portfolio
   (injecté en JS) était invisible aux robots. On lit le template une fois au
   démarrage, on y pré-rend le contenu portfolio + étude de cas, puis on injecte
   les bonnes balises meta selon la route à chaque requête.
   ────────────────────────────────────────────────────────────────────────── */

// Template = index.html avec le contenu portfolio/case study pré-rendu (statique,
// identique pour tous → calculé une seule fois au démarrage).
let baseHtml = fs.readFileSync(path.join(__dirname, 'frontend/index.html'), 'utf8')
  .replace('<div id="port-catalog"></div>', `<div id="port-catalog">${portfolio.renderPortfolioHTML()}</div>`);

// Bundles fingerprintés : on substitue les noms stables du template par les noms
// hashés du manifest (écrit par build.js) → Cache-Control immutable d'un an,
// invalidé naturellement à chaque déploiement puisque le nom change avec le contenu.
try {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'frontend/dist/manifest.json'), 'utf8')
  );
  baseHtml = baseHtml
    .replace('dist/styles.min.css', `dist/${manifest['styles.min.css']}`)
    .replace('dist/app.min.js', `dist/${manifest['app.min.js']}`);
} catch {
  console.warn('[build] manifest.json absent — bundles servis sous leur nom stable (lancer npm run build)');
}
const BASE_HTML = baseHtml;

// Meta par route — source de vérité SEO (rechargement complet, pas de mise à jour client).
const ROUTE_META = {
  '/': {
    title: 'Or-Web — Agence Web Premium à Bordeaux | Sites sur mesure',
    desc: 'Or-Web, agence web à Bordeaux : création de sites vitrines, e-commerce et applications web sur mesure. Design premium, performance et SEO.',
  },
  '/portfolio': {
    title: 'Portfolio — Nos réalisations web | Or-Web Bordeaux',
    desc: "Portfolio Or-Web : sites vitrines, e-commerce et optimisations SEO & performance. Filtrez par service et explorez chaque étude de cas.",
  },
  '/contact': {
    title: 'Contact — Démarrons votre projet web | Or-Web Bordeaux',
    desc: 'Contactez Or-Web, agence web à Bordeaux. Devis gratuit pour votre site vitrine, e-commerce ou application web. Réponse sous 24h.',
  },
};

// Injecte title/description/canonical/OG/Twitter pour une route donnée.
function renderPage(route) {
  const m = ROUTE_META[route] || ROUTE_META['/'];
  const url = 'https://or-web.fr' + (route === '/' ? '/' : route);
  return BASE_HTML
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${m.title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${m.desc}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${m.title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${m.desc}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${m.title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${m.desc}$2`);
}

// Routes AE (accueil, portfolio, contact) — AVANT le statique
// avec les bonnes meta + le contenu pré-rendu (sinon express.static servirait
// index.html brut pour "/").
app.get(['/', '/portfolio', '/contact'], (req, res) => {
  const route = req.path === '/' ? '/' : req.path.replace(/\/+$/, '');
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Cache-Control', 'no-cache'); // HTML toujours revalidé (les assets, eux, sont cachés longtemps)
  res.send(renderPage(route));
});

// Anciennes URLs / doublons → 301 vers l'URL canonique (consolidation SEO).
// /index.html servait un doublon brut de l'accueil (sans SSR) ; les vieilles
// pages .html n'existent plus. Le fragment (#portfolio…) est conservé par le
// navigateur lors d'une 301, donc les liens ../index.html#portfolio des pages
// projets continuent de fonctionner.
const REDIRECTS = {
  '/index.html': '/',
  '/portfolio.html': '/portfolio',
};
app.get(Object.keys(REDIRECTS), (req, res) => res.redirect(301, REDIRECTS[req.path]));

// Pages générées en URL propre SANS redirection vers un slash final :
// /services/<slug> et /blog[/<slug>] → sert directement le index.html du dossier
// (évite le 301 d'express.static vers le slash final, qui casserait les liens).
app.get(/^\/(services|blog|mentions-legales|politique-de-confidentialite)(\/[\w-]+)?$/, (req, res, next) => {
  res.sendFile(
    path.join(__dirname, 'frontend', req.path, 'index.html'),
    { headers: { 'Cache-Control': 'no-cache' } }, // HTML revalidé, comme les routes SSR
    err => err && next()
  );
});

// Fichiers statiques (css, js, img, fonts, projets/*.html) avec politique de
// cache par type : bundles fingerprintés → immutable 1 an (le nom change avec le
// contenu) ; polices/images → 30 j ; HTML → revalidation systématique (ETag/304).
app.use(express.static(path.join(__dirname, 'frontend'), {
  setHeaders(res, filePath) {
    if (/\.[0-9a-f]{8}\.min\.(css|js)$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (/\.(woff2?|ttf|png|jpe?g|webp|avif|svg|ico|gif)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    } else if (/\.html$/.test(filePath)) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

// Configuration du transporteur d'email via le SMTP d'OVH
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'ssl0.ovh.net', // Serveur SMTP standard OVH
  port: parseInt(process.env.SMTP_PORT || '465'), // Port sécurisé SSL
  secure: true, // true pour le port 465
  auth: {
    user: process.env.SMTP_USER, // Ton adresse email OVH (ex: contact@or-web.fr)
    pass: process.env.SMTP_PASS, // Le mot de passe de cette boîte mail
  },
});

// Échappe les caractères HTML pour éviter toute injection dans l'email reçu.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Health check (Render : Settings → Health Check Path = /api/health).
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ── Anti-spam du formulaire de contact ──────────────────────
// 1) Rate-limit : 5 envois / 15 min / IP (un humain n'en envoie pas plus).
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de messages envoyés. Réessayez dans quelques minutes.' },
});

// 2) Bornes de taille par champ (au-delà = pas un usage légitime du formulaire).
const FIELD_MAX = { name: 200, email: 254, subject: 200, message: 5000 };

// Même regex que la validation client (form.js) — vérifiée côté serveur car
// les bots postent directement sur l'API sans passer par le front.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Route API pour le formulaire de contact
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, subject, message, website, privacy_consent } = req.body || {};

  // 3) Honeypot : champ "website" invisible pour un humain, rempli par les bots.
  //    On répond comme un succès pour ne pas leur signaler le rejet.
  if (website) {
    return res.status(200).json({ success: true, message: 'Message envoyé avec succès !' });
  }

  // Validation basique de sécurité côté serveur
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }
  if (typeof name !== 'string' || typeof email !== 'string'
    || typeof subject !== 'string' || typeof message !== 'string') {
    return res.status(400).json({ error: 'Champs invalides.' });
  }
  if (!EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: "Format d'email invalide." });
  }
  if (!privacy_consent) {
    return res.status(400).json({ error: 'Vous devez accepter la politique de confidentialité.' });
  }
  for (const [field, max] of Object.entries(FIELD_MAX)) {
    if (req.body[field].length > max) {
      return res.status(400).json({ error: `Champ « ${field} » trop long (max ${max} caractères).` });
    }
  }

  // Versions échappées pour l'interpolation dans le corps HTML
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  // Structure de l'email que TU vas recevoir
  const mailOptions = {
    from: `"Or-Web - Contact" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFICATION_EMAIL, // L'adresse qui reçoit les leads
    replyTo: email, // Permet de cliquer sur "Répondre" pour écrire directement au client
    subject: `✨ [Nouveau Message] ${subject}`,
    text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #111; background-color: #f5f5f0;">
        <h2 style="color: #C9A84C;">Nouveau message reçu depuis Or-Web</h2>
        <p><strong>Nom :</strong> ${safeName}</p>
        <p><strong>Email :</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Sujet :</strong> ${safeSubject}</p>
        <hr style="border: none; border-top: 1px solid #2e2e2e; margin: 20px 0;" />
        <p style="white-space: pre-line;"><strong>Message :</strong><br>${safeMessage}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Message envoyé avec succès !' });
  } catch (error) {
    console.error("Erreur Nodemailer : ", error);
    return res.status(500).json({ error: "Une erreur est survenue lors de l'envoi de l'e-mail." });
  }
});

// Tout le reste (routes SPA + fichiers statiques + pages générées déjà gérés
// au-dessus) → URL inexistante : vrai 404 avec page dédiée (évite les soft-404).
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'frontend/404.html'));
});

// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log(`Serveur Or-Web démarré sur le port ${PORT}`);
});

// Arrêt propre : Render envoie SIGTERM à chaque déploiement — on laisse les
// requêtes en vol se terminer (10 s max) au lieu de les couper net.
function shutdown(signal) {
  console.log(`${signal} reçu — arrêt en cours…`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
