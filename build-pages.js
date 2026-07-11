/* ──────────────────────────────────────────────────────────────────────────
   GÉNÉRATEUR DE PAGES STATIQUES (SEO) — services + blog

   Pages d'atterrissage autonomes, générées depuis un layout commun (DRY) :
   navbar + footer + <head> SEO partagés, contenu par page. Sortie en
   frontend/services/<slug>/index.html et frontend/blog[/<slug>]/index.html
   → URLs propres servies par express.static.

   Lancé via `npm run build`. La sortie est gitignorée (artefact de build).
   ────────────────────────────────────────────────────────────────────────── */
const fs = require('fs');
const path = require('path');
const LEGAL = require('./legal-info');
const portfolio = require('./frontend/js/portfolio-data');

const FE = path.join(__dirname, 'frontend');
const SITE = 'https://or-web.fr';

// Bundle CSS fingerprinté (manifest écrit par build.js, qui tourne juste avant
// dans `npm run build`). Fallback nom stable si pas encore buildé.
let CSS_BUNDLE = '/dist/styles.min.css';
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(FE, 'dist', 'manifest.json'), 'utf8'));
  if (manifest['styles.min.css']) CSS_BUNDLE = '/dist/' + manifest['styles.min.css'];
} catch { /* dev : build.js pas encore lancé */ }

/* ── Navbar statique (liens réels, pas de SPA) ── */
function navbar(active) {
  const act = (id) => active === id ? ' class="active"' : '';
  return `
<a class="skip-link" href="#main-content">Aller au contenu principal</a>
<nav id="navbar">
  <div class="nav-inner">
    <a class="logo" href="/" aria-label="OR-Web — accueil">
      <span class="lb">&lt;</span><span>OR</span><span class="lb">-</span><span style="color:var(--gold)">Web</span><span class="lb">/&gt;</span>
    </a>
    <ul class="nav-links" role="list">
      <li><a href="/"${act('home')}>Accueil</a></li>
      <li><a href="/services"${act('services')}>Services</a></li>
      <li><a href="/portfolio"${act('portfolio')}>Portfolio</a></li>
      <li><a href="/contact"${act('contact')}>Contact</a></li>
    </ul>
    <a class="nav-cta" href="/contact">
      <span style="font-family:monospace;opacity:.7" aria-hidden="true">&#123;</span> Démarrer un projet <span style="font-family:monospace;opacity:.7" aria-hidden="true">&#125;</span>
    </a>
    <button type="button" class="burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobMenu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<nav class="mob-menu" id="mobMenu" aria-label="Menu mobile" aria-hidden="true" inert>
  <ul role="list">
    <li><a href="/">Accueil</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/portfolio">Portfolio</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a class="mob-cta-link" href="/contact">Démarrer un projet →</a></li>
  </ul>
</nav>`;
}

/* ── Footer statique (avec maillage services + blog) ── */
function footer() {
  return `
<footer>
  <div class="divider"></div>
  <div class="foot-inner">
    <div class="foot-brand">
      <span class="foot-logo"><span class="lb">&lt;</span>OR-Web<span class="lb">/&gt;</span></span>
      <p>L'excellence numérique,<br>forgée avec précision.</p>
    </div>
    <div class="foot-nav">
      <span class="foot-nt">Navigation</span>
      <ul>
        <li><a href="/">Accueil</a></li>
        <li><a href="/portfolio">Portfolio</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
    <div class="foot-nav">
      <a class="foot-nt" href="/services">Services</a>
      <ul>
        <li><a href="/services/creation-site-vitrine-bordeaux">Sites Vitrines</a></li>
        <li><a href="/services/creation-site-e-commerce-bordeaux">E-Commerce</a></li>
        <li><a href="/services/developpement-application-web-bordeaux">Applications Web</a></li>
        <li><a href="/services/optimisation-seo-performance-bordeaux">SEO &amp; Performance</a></li>
      </ul>
    </div>
    <div class="foot-contact">
      <span class="foot-nt">Contact</span>
      <a href="mailto:contact@or-web.fr">contact@or-web.fr</a>
      <a href="tel:+33649951225">+33 6 49 95 12 25</a>
      <p class="foot-loc">Bordeaux, France</p>
    </div>
  </div>
  <div class="foot-bottom">
    <p>© 2026 OR-Web. Tous droits réservés.</p>
    <nav class="foot-legal" aria-label="Informations légales">
      <a href="/mentions-legales">Mentions légales</a>
      <a href="/politique-de-confidentialite">Politique de confidentialité</a>
    </nav>
    <p>Site réalisé par OR-Web — Agence Web Premium</p>
  </div>
</footer>`;
}

/* ── Mini-script : burger, navbar scroll, scroll-reveal (même pattern que /portfolio) ── */
const INLINE_JS = `
<script>
(function(){
  var b=document.getElementById('burger'),m=document.getElementById('mobMenu');
  if(b&&m){b.addEventListener('click',function(){
    var open=b.classList.toggle('open');m.classList.toggle('open',open);
    b.setAttribute('aria-expanded',String(open));m.setAttribute('aria-hidden',String(!open));m.inert=!open;
  });}
  var n=document.getElementById('navbar');
  if(n){addEventListener('scroll',function(){n.classList.toggle('scrolled',scrollY>40);},{passive:true});}
  function triggerReveal(){
    var els=document.querySelectorAll('#main-content .reveal:not(.visible)');
    if(!els.length)return;
    if(!('IntersectionObserver'in window)){els.forEach(function(el){el.classList.add('visible');});return;}
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
    },{threshold:.1,rootMargin:'0px 0px -50px 0px'});
    els.forEach(function(el){obs.observe(el);});
  }
  setTimeout(triggerReveal,200);
})();
</script>`;

/* ── <head> commun (SEO + polices + CSS bundle) ── */
function head({ title, desc, canonical, jsonld }) {
  const ld = (jsonld || []).map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n  ');
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${title}</title>
  <meta name="description" content="${desc}"/>
  <meta name="robots" content="index, follow, max-image-preview:large"/>
  <meta name="author" content="OR-Web"/>
  <meta name="theme-color" content="#0B0A12"/>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
  <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png"/>
  <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
  <link rel="canonical" href="${canonical}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="OR-Web"/>
  <meta property="og:locale" content="fr_FR"/>
  <meta property="og:url" content="${canonical}"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${desc}"/>
  <meta property="og:image" content="${SITE}/og-image.jpg"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${desc}"/>
  <meta name="twitter:image" content="${SITE}/og-image.jpg"/>
  <link rel="preload" href="/fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="stylesheet" href="${CSS_BUNDLE}"/>
  ${ld}
</head>
<body>`;
}

function layout(page) {
  return head(page) + navbar() +
    `\n<main id="main-content" tabindex="-1" class="lp">\n${page.body}\n</main>\n` +
    footer() + INLINE_JS + `\n</body>\n</html>`;
}

/* ── Pages études de cas (projets/*.html) — données dans portfolio-data.js ── */
const PROJ_IFRAME_JS = `
<script>
(function(){
  var n=document.getElementById('navbar');
  if(n){addEventListener('scroll',function(){n.classList.toggle('scrolled',scrollY>40);},{passive:true});}
  var b=document.getElementById('burger'),m=document.getElementById('mobMenu');
  if(b&&m){b.addEventListener('click',function(){
    var open=b.classList.toggle('open');m.classList.toggle('open',open);
    b.setAttribute('aria-expanded',String(open));m.setAttribute('aria-hidden',String(!open));m.inert=!open;
  });}
  function scaleFrames(){
    document.querySelectorAll('.browser-frame').forEach(function(frame){
      var iframe=frame.querySelector('iframe');if(!iframe)return;
      var scale=frame.offsetWidth/1440;
      iframe.style.transform='scale('+scale+')';
      frame.style.height=Math.round(900*scale)+'px';
    });
  }
  scaleFrames();
  addEventListener('resize',scaleFrames);
})();
</script>`;

function projectHead(p) {
  const d = p.detail;
  const canonical = `${SITE}/projets/${p.id}.html`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${d.metaTitle}</title>
  <meta name="description" content="${d.metaDesc}"/>
  <meta name="robots" content="index, follow, max-image-preview:large"/>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
  <link rel="canonical" href="${canonical}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="OR-Web"/>
  <meta property="og:locale" content="fr_FR"/>
  <meta property="og:url" content="${canonical}"/>
  <meta property="og:title" content="${d.metaTitle}"/>
  <meta property="og:description" content="${d.metaDesc}"/>
  <meta property="og:image" content="${SITE}/og-image.jpg"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${d.metaTitle}"/>
  <meta name="twitter:description" content="${d.metaDesc}"/>
  <meta name="twitter:image" content="${SITE}/og-image.jpg"/>
  <link rel="preload" href="/fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="stylesheet" href="${CSS_BUNDLE}"/>
  <link rel="stylesheet" href="/projets/proj-shared.css"/>
</head>
<body>`;
}

function projectPageLayout(p) {
  return projectHead(p) + navbar('portfolio') +
    `\n<div class="proj-page" style="padding-top:calc(var(--nav) + 3rem)">\n` +
    portfolio.renderProjectDetailBody(p) +
    `\n</div>\n` +
    footer() + PROJ_IFRAME_JS + `\n</body>\n</html>`;
}

function writeProjectPages() {
  const outDir = path.join(FE, 'projets');
  const items = portfolio.getDetailProjects();
  items.forEach(p => {
    fs.writeFileSync(path.join(outDir, `${p.id}.html`), projectPageLayout(p));
  });
  console.log(`Projets OK → ${items.length} études de cas (${items.map(p => p.id + '.html').join(', ')})`);
}

/* ── Briques de contenu réutilisables ── */
function revealStagger(i, max = 3) {
  if (i === 0) return 'reveal from-left';
  return `reveal from-left d${Math.min(i, max)}`;
}

/* En-tête éditorial — même pattern que la page Réalisations (port-head) */
function pageHero(eyebrow, titleHtml, lead, actions = '') {
  const actionsBlock = actions
    ? `<div class="lp-actions reveal d2">${actions}</div>`
    : '';
  return `
<header class="port-head ed">
  <span class="port-eyebrow marginalia" aria-hidden="true">${eyebrow}</span>
  <h1 class="port-h1 reveal">${titleHtml}</h1>
  <p class="port-lead reveal d1">${lead}</p>
  ${actionsBlock}
</header>`;
}

const SERVICE_ACTIONS = `
    <a class="btn btn-primary" href="/contact"><span class="bicon" aria-hidden="true">[</span> Demander un devis <span class="bicon" aria-hidden="true">]</span></a>
    <a class="hero-link" href="/portfolio">Voir nos réalisations <span aria-hidden="true">→</span></a>`;

function introSection(eyebrow, h2, paragraphs) {
  const ps = paragraphs.map((p, i) =>
    `<p class="lp-p reveal d${Math.min(i + 2, 4)}">${p}</p>`
  ).join('\n    ');
  return `
<section class="lp-section">
  <div class="ed">
    <span class="marginalia reveal" aria-hidden="true">(${eyebrow})</span>
    <h2 class="lp-h2 reveal d1">${h2}</h2>
    ${ps}
  </div>
</section>`;
}

function breadcrumb(items) {
  // items: [{name, url}] — dernier = page courante
  const links = items.map((it, i) =>
    i === items.length - 1
      ? `<span aria-current="page">${it.name}</span>`
      : `<a href="${it.url}">${it.name}</a>`
  ).join(' <span aria-hidden="true">/</span> ');
  return `<nav class="breadcrumb ed" aria-label="Fil d'Ariane">${links}</nav>`;
}
function breadcrumbLD(items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: SITE + it.url,
    })),
  };
}

// Bande de preuve perf → renvoie vers l'étude de cas du portfolio
const PROOF_BAND = `
<div class="proof-band reveal d2">
  <div class="proof-scores">
    <div class="proof-score"><b>100</b><span>Perf</span></div>
    <div class="proof-score"><b>100</b><span>Accessib.</span></div>
    <div class="proof-score"><b>100</b><span>Bonnes prat.</span></div>
    <div class="proof-score"><b>100</b><span>SEO</span></div>
  </div>
  <p class="proof-text">Notre propre site obtient <strong>100/100</strong> sur les quatre axes Google PageSpeed Insights mobile, en vanilla. <a href="/portfolio">Voir l'étude de cas 77 → 100 →</a></p>
</div>`;

function faqSection(faqs) {
  const html = faqs.map(f => `
    <details>
      <summary>${f.q}</summary>
      <div class="faq-a">${f.a}</div>
    </details>`).join('');
  return `
<section class="lp-section">
  <div class="ed">
    <span class="marginalia reveal" aria-hidden="true">(FAQ)</span>
    <h2 class="lp-h2 reveal d1">Questions fréquentes</h2>
    <div class="faq reveal d2">${html}</div>
  </div>
</section>`;
}
function faqLD(faqs) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
    })),
  };
}

function serviceLD(name, desc, url) {
  return {
    '@context': 'https://schema.org', '@type': 'Service',
    serviceType: name, name,
    description: desc,
    areaServed: { '@type': 'City', name: 'Bordeaux' },
    provider: {
      '@type': 'ProfessionalService', name: 'OR-Web', url: SITE + '/',
      telephone: '+33649951225', email: 'contact@or-web.fr',
      address: { '@type': 'PostalAddress', addressLocality: 'Bordeaux', addressRegion: 'Nouvelle-Aquitaine', addressCountry: 'FR' },
    },
    url,
  };
}

function ctaBand(title, note) {
  return `
<section class="lp-cta">
  <div class="ed">
    <h2 class="reveal">${title}</h2>
    <p class="reveal d1">${note}</p>
    <div class="lp-actions reveal d2">
      <a class="btn btn-primary" href="/contact"><span class="bicon" aria-hidden="true">$</span> Demander un devis gratuit <span class="bicon" aria-hidden="true">→</span></a>
    </div>
    <ul class="lp-links reveal d3" aria-label="Autres services">
      <li><a href="/services/creation-site-vitrine-bordeaux">Site vitrine</a></li>
      <li><a href="/services/creation-site-e-commerce-bordeaux">Site e-commerce</a></li>
      <li><a href="/services/developpement-application-web-bordeaux">Application web</a></li>
      <li><a href="/services/optimisation-seo-performance-bordeaux">SEO &amp; performance</a></li>
      <li><a href="/blog">Blog</a></li>
    </ul>
  </div>
</section>`;
}

function features(eyebrow, h2, items) {
  const cards = items.map((it, i) => `
    <li class="feature-card ${revealStagger(i)}">
      <span class="fc-num">${String(i + 1).padStart(2, '0')}</span>
      <h3>${it.h}</h3>
      <p>${it.p}</p>
    </li>`).join('');
  return `
<section class="lp-section">
  <div class="ed">
    <span class="marginalia reveal" aria-hidden="true">(${eyebrow})</span>
    <h2 class="lp-h2 reveal d1">${h2}</h2>
    <ul class="feature-grid" role="list">${cards}</ul>
  </div>
</section>`;
}

/* ── Liste éditoriale services (même motif que l'accueil) ── */
function servicesListHTML(items, headingTag = 'h3') {
  return items.map((s, i) => `
      <li class="svc-item ${revealStagger(i)}">
        <a class="svc-link" href="${s.url}">
          <span class="svc-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <${headingTag} class="svc-name">${s.name}</${headingTag}>
          <p class="svc-line">${s.short}</p>
        </a>
      </li>`).join('');
}

/* ════════════════════════ PAGES ════════════════════════ */
const pages = [];

/* —— HUB : liste des services —— */
const SERVICES = [
  { name: 'Création de site vitrine', short: "Des sites élégants qui convertissent vos visiteurs en clients. Sur mesure, rapides, optimisés SEO.", url: '/services/creation-site-vitrine-bordeaux' },
  { name: 'Site e-commerce', short: "Des boutiques en ligne pensées pour vendre : parcours d'achat fluide, paiement sécurisé, SEO produit.", url: '/services/creation-site-e-commerce-bordeaux' },
  { name: 'Application web sur mesure', short: "Dashboards, espaces clients et outils métier accessibles depuis un navigateur, sécurisés et évolutifs.", url: '/services/developpement-application-web-bordeaux' },
  { name: 'SEO & performance', short: "On rend votre site plus rapide et plus visible sur Google. La preuve : notre propre site est passé de 77 à 100/100 sur mobile.", url: '/services/optimisation-seo-performance-bordeaux' },
];
{
  const url = '/services';
  const title = 'Nos services — Agence web à Bordeaux | OR-Web';
  const desc = "Les services d'OR-Web, agence web à Bordeaux : création de site vitrine, e-commerce, application web sur mesure et optimisation SEO & performance. Devis gratuit.";
  pages.push({
    out: 'services',
    title, desc, canonical: SITE + url,
    jsonld: [
      {
        '@context': 'https://schema.org', '@type': 'CollectionPage',
        name: title, description: desc, url: SITE + url,
        hasPart: SERVICES.map(s => ({ '@type': 'Service', name: s.name, url: SITE + s.url })),
      },
      breadcrumbLD([{ name: 'Accueil', url: '/' }, { name: 'Services', url }]),
    ],
    body: `
${breadcrumb([{ name: 'Accueil', url: '/' }, { name: 'Services', url }])}
${pageHero('(Services)', 'Nos <span class="gold">services</span>', "De la vitrine à l'application sur mesure, en passant par l'e-commerce et l'optimisation SEO : tout ce qu'il faut pour une présence web rapide, élégante et qui performe sur Google.")}
<section class="sec services-ed">
  <ol class="svc-list ed">${servicesListHTML(SERVICES, 'h2')}
  </ol>
</section>
${ctaBand('Un projet en tête ?', 'Premier appel gratuit de 30 minutes. Réponse sous 24h.')}`,
  });
}

/* —— SERVICE : site vitrine —— */
{
  const url = '/services/creation-site-vitrine-bordeaux';
  const title = 'Création de site vitrine à Bordeaux | OR-Web';
  const desc = "Agence web à Bordeaux : création de sites vitrines sur mesure, rapides et optimisés SEO. Design premium, 100/100 PageSpeed, sans template. Devis gratuit.";
  const faqs = [
    { q: 'Combien coûte un site vitrine à Bordeaux ?', a: "Cela dépend du nombre de pages, du niveau de personnalisation et des fonctionnalités souhaitées (formulaire, galerie, prise de rendez-vous…). Nous vous proposons un devis gratuit après un premier échange de 30 minutes, une fois vos besoins clarifiés." },
    { q: 'Combien de temps faut-il pour créer un site vitrine ?', a: "Comptez en général 2 à 5 semaines. Nous avançons par étapes : comprendre votre activité, vous montrer des maquettes à valider, construire le site, puis le mettre en ligne. Plus vous validez vite, plus on avance vite." },
    { q: 'Mon site sera-t-il visible sur Google ?', a: "Oui, c'est prévu dès le départ. Titres clairs, textes utiles, pages bien organisées et site rapide sur mobile : tout ce qui aide Google à comprendre votre activité — et vos clients à vous trouver." },
    { q: 'Est-ce un site « fait maison » ou un template acheté ?', a: "C'est un site fait pour vous, pas un modèle dupliqué. Vous n'avez pas le même site que vos voisins, et vous gardez une base saine, rapide et simple à faire évoluer." },
  ];
  pages.push({
    out: 'services/creation-site-vitrine-bordeaux',
    title, desc, canonical: SITE + url,
    jsonld: [serviceLD('Création de site vitrine', desc, SITE + url), breadcrumbLD([{ name: 'Accueil', url: '/' }, { name: 'Site vitrine', url }]), faqLD(faqs)],
    body: `
${breadcrumb([{ name: 'Accueil', url: '/' }, { name: 'Site vitrine Bordeaux', url }])}
${pageHero('(Service — Site vitrine)', 'Création de <span class="gold">site vitrine</span> à Bordeaux', 'Un site clair et soigné qui donne envie de vous contacter. Pensé pour votre activité, agréable sur mobile, prêt à vous apporter des demandes.', SERVICE_ACTIONS)}
${introSection('Pourquoi', 'Votre vitrine en ligne, à la hauteur de votre marque', [
  "Avant de vous appeler ou de passer en boutique, vos futurs clients regardent votre site. En quelques secondes, ils se font une idée : est-ce que cette entreprise inspire confiance ? Est-ce clair ce qu'elle propose ? Si la réponse est floue ou si la page met du temps à s'afficher, ils partent ailleurs.",
  "Nous créons un site qui vous ressemble vraiment — pas un modèle recyclé vu chez dix concurrents. Des pages lisibles sur mobile, un parcours simple pour vous contacter, et une base solide pour durer dans le temps sans mauvaises surprises.",
])}
${features('Comment ça se passe', 'Du premier échange à la mise en ligne', [
  { h: '1. On fait connaissance', p: 'Un premier appel pour comprendre votre activité, vos clients et ce que vous attendez du site. On clarifie le nombre de pages et les fonctionnalités utiles (formulaire, galerie…).' },
  { h: '2. On vous montre le rendu', p: 'Avant de construire, on vous présente à quoi ressembleront les pages principales. Vous validez le design et les textes — pas de surprise le jour du lancement.' },
  { h: '3. On construit votre site', p: 'Intégration de vos visuels, rédaction des contenus, tests sur téléphone et ordinateur. Le site reste rapide et agréable à parcourir.' },
  { h: '4. On le met en ligne', p: 'Publication, vérification du formulaire de contact, des liens et des pages importantes. Vous repartez avec un site prêt à recevoir des demandes.' },
  { h: '5. On le rend visible', p: 'Pages bien nommées, contenus clairs, structure logique : pour que les personnes qui cherchent vos services à Bordeaux (et ailleurs) vous trouvent sur Google.' },
  { h: '6. On reste disponibles', p: 'Premiers conseils après le lancement et réponses à vos questions. Vous n\'êtes pas livré seul face à votre nouveau site.' },
])}
${faqSection(faqs)}
${ctaBand('Prêt à lancer votre site vitrine ?', 'Premier appel gratuit de 30 minutes. Réponse sous 24h.')}`,
  });
}

/* —— SERVICE : e-commerce —— */
{
  const url = '/services/creation-site-e-commerce-bordeaux';
  const title = 'Création de site e-commerce à Bordeaux | OR-Web';
  const desc = "Création de boutiques en ligne sur mesure à Bordeaux : sites e-commerce rapides, optimisés conversion et SEO. Design premium, sans template. Devis gratuit.";
  const faqs = [
    { q: 'Comment se passe la création de ma boutique ?', a: "On commence par comprendre ce que vous vendez et comment vos clients achètent. Ensuite : présentation des pages clés à valider, mise en place du catalogue et du paiement, tests de commande, puis ouverture. Vous êtes guidé à chaque étape." },
    { q: 'Puis-je modifier mes produits moi-même ?', a: "Oui. Vous disposez d'un espace simple pour ajouter ou modifier vos produits, vos prix et vos stocks — sans avoir besoin de nous pour chaque petite mise à jour." },
    { q: 'Le paiement en ligne est-il sécurisé ?', a: "Oui. Nous utilisons des solutions reconnues (carte bancaire via Stripe, PayPal…). Vos clients paient sur une page sécurisée ; l'argent arrive sur votre compte professionnel selon les règles de la solution choisie." },
    { q: 'Ma boutique peut-elle être trouvée sur Google ?', a: "C'est même indispensable pour vendre. Chaque produit a une fiche claire, votre boutique charge vite, et la structure aide Google à proposer vos articles aux bonnes recherches." },
  ];
  pages.push({
    out: 'services/creation-site-e-commerce-bordeaux',
    title, desc, canonical: SITE + url,
    jsonld: [serviceLD('Création de site e-commerce', desc, SITE + url), breadcrumbLD([{ name: 'Accueil', url: '/' }, { name: 'Site e-commerce', url }]), faqLD(faqs)],
    body: `
${breadcrumb([{ name: 'Accueil', url: '/' }, { name: 'Site e-commerce Bordeaux', url }])}
${pageHero('(Service — E-commerce)', 'Création de <span class="gold">site e-commerce</span> à Bordeaux', "Une boutique en ligne simple à parcourir, rassurante pour payer, et facile à gérer au quotidien — pour vendre même quand vous n'êtes pas devant l'écran.", SERVICE_ACTIONS)}
${introSection('Pourquoi', 'Une boutique en ligne conçue pour convertir', [
  "Un client qui hésite, qui ne trouve pas le produit ou qui abandonne au moment de payer, c'est une vente perdue. Sur mobile, la moindre friction suffit : formulaire compliqué, page lente, bouton mal visible.",
  "Nous construisons une boutique claire : fiches produits soignées, panier simple, paiement rassurant. Vous gardez la main sur votre catalogue au quotidien, et votre boutique reste ouverte — même quand vous êtes en rendez-vous ou en week-end.",
])}
${features('Comment ça se passe', 'De l\'idée à votre première vente en ligne', [
  { h: '1. On cadre ensemble', p: 'Ce que vous vendez, comment vos clients achètent, quels moyens de paiement et de livraison vous conviennent. On pose les bases avant de construire.' },
  { h: '2. On valide les pages clés', p: 'Accueil, fiches produits, panier : vous voyez le parcours d\'achat avant la mise en place technique. On ajuste tant que ce n\'est pas clair pour vous.' },
  { h: '3. On installe la boutique', p: 'Catalogue, paiement sécurisé (carte, PayPal…), frais de port, mails de confirmation. Tout est branché et testé en interne.' },
  { h: '4. On teste une vraie commande', p: 'Du clic « acheter » jusqu\'à la confirmation — comme le ferait un client. On corrige les frictions avant l\'ouverture.' },
  { h: '5. On vous rend autonome', p: 'Formation rapide pour ajouter des produits, modifier les prix et suivre les commandes au quotidien, sans nous appeler à chaque fois.' },
  { h: '6. On ouvre et on suit', p: 'Mise en ligne, premiers contrôles et conseils pour attirer vos premiers acheteurs. La boutique reste rapide et confortable sur téléphone.' },
])}
${faqSection(faqs)}
${ctaBand('Prêt à vendre en ligne ?', 'Premier appel gratuit de 30 minutes. Réponse sous 24h.')}`,
  });
}

/* —— SERVICE : SEO & performance —— */
{
  const url = '/services/optimisation-seo-performance-bordeaux';
  const title = 'Optimisation SEO & performance web à Bordeaux | OR-Web';
  const desc = "Optimisation SEO et Core Web Vitals à Bordeaux : audit, performance, référencement technique. De 77 à 100/100 PageSpeed sur notre propre site. Devis gratuit.";
  const faqs = [
    { q: 'Pourquoi mon site est-il lent sur mobile ?', a: "Souvent : images trop lourdes, trop d'éléments qui se chargent en même temps, ou une page mal organisée. Résultat : le visiteur attend, s'impatiente et part. Google le voit aussi, et finit par vous montrer moins souvent." },
    { q: 'Qu\'est-ce que vous faites concrètement ?', a: "On teste votre site comme le ferait un client (surtout sur téléphone), on liste ce qui coince, puis on corrige : alléger les images, simplifier le chargement, clarifier les pages importantes. Vous recevez un avant/après chiffré." },
    { q: 'Pouvez-vous travailler sur un site déjà en ligne ?', a: "Oui, c'est même le cas le plus fréquent. Pas besoin de tout refaire : on améliore ce qui existe, comme nous l'avons fait sur or-web.fr (passé de 77 à 100/100 sur mobile)." },
    { q: 'Quand verrai-je des résultats ?', a: "La vitesse, vous la constatez dès la mise en ligne des corrections. Pour la visibilité sur Google, comptez plutôt quelques semaines — le temps que Google repasse sur votre site et prenne en compte les améliorations." },
  ];
  pages.push({
    out: 'services/optimisation-seo-performance-bordeaux',
    title, desc, canonical: SITE + url,
    jsonld: [serviceLD('Optimisation SEO et performance web', desc, SITE + url), breadcrumbLD([{ name: 'Accueil', url: '/' }, { name: 'SEO & performance', url }]), faqLD(faqs)],
    body: `
${breadcrumb([{ name: 'Accueil', url: '/' }, { name: 'SEO & performance Bordeaux', url }])}
${pageHero('(Service — SEO & Performance)', '<span class="gold">SEO &amp; performance</span> web à Bordeaux', 'On rend votre site plus rapide et plus visible sur Google. Audit, corrections concrètes, résultats mesurés — comme sur notre propre site (77 → 100/100 sur mobile).', `
    <a class="btn btn-primary" href="/contact"><span class="bicon" aria-hidden="true">[</span> Auditer mon site <span class="bicon" aria-hidden="true">]</span></a>
    <a class="hero-link" href="/portfolio">Voir l'étude de cas <span aria-hidden="true">→</span></a>`)}
${introSection('Pourquoi', 'Un site lent, c\'est des clients qui partent', [
  "Vous l'avez déjà vécu : une page qui met plusieurs secondes à s'afficher sur le téléphone, on ferme l'onglet. Résultat : moins de contacts, moins de ventes, et Google finit par vous montrer moins souvent aux personnes qui cherchent vos services.",
  "Nous passons votre site au crible, on repère ce qui le freine (images trop lourdes, éléments inutiles, mauvaise organisation…) et on corrige concrètement. La preuve : nous l'avons fait sur notre propre site — de 77 à 100/100 sur mobile, résultat mesurable et vérifiable.",
])}
<section class="lp-section" style="border-top:none;padding-top:0">
  <div class="ed">${PROOF_BAND}</div>
</section>
${features('Comment ça se passe', 'Notre approche, étape par étape', [
  { h: '1. On teste votre site', p: 'Comme un vrai visiteur — surtout sur téléphone. On note ce qui ralentit, ce qui bloque, ce qui décourage à rester.' },
  { h: '2. On allège et on simplifie', p: 'Images optimisées, chargement rationalisé, pages inutiles supprimées ou allégées. Votre site s\'affiche plus vite.' },
  { h: '3. On clarifie pour Google', p: 'Titres, descriptions et organisation des pages : pour que Google comprenne votre activité et vous propose aux bonnes recherches.' },
  { h: '4. On vérifie l\'accessibilité', p: 'Textes lisibles, contrastes corrects, navigation utilisable : mieux pour vos visiteurs, et mieux perçu par Google.' },
  { h: '5. On vous montre les chiffres', p: 'Rapport avant/après, vérifiable (comme sur PageSpeed). Vous voyez la différence, pas seulement un discours.' },
  { h: '6. On vous guide après', p: 'Conseils pour garder un site rapide dans la durée — éviter que les mêmes problèmes ne reviennent.' },
])}
${faqSection(faqs)}
${ctaBand('Votre site mérite un meilleur score', 'Audit et premier appel gratuits. Réponse sous 24h.')}`,
  });
}

/* —— SERVICE : application web —— */
{
  const url = '/services/developpement-application-web-bordeaux';
  const title = 'Développement d\'application web sur mesure à Bordeaux | OR-Web';
  const desc = "Développement d'applications web et outils métier sur mesure à Bordeaux : dashboards, espaces clients, SaaS. Performants, sécurisés et évolutifs. Devis gratuit.";
  const faqs = [
    { q: 'C\'est quoi la différence avec un site vitrine ?', a: "Un site vitrine présente votre activité. Une application web, c'est un outil en ligne : vos clients ou vos équipes se connectent, consultent des infos, remplissent des formulaires, suivent des dossiers… Comme un logiciel, mais accessible depuis un navigateur." },
    { q: 'Comment se déroule un projet ?', a: "On cartographie d'abord votre quotidien : qui fait quoi, quelles infos manquent, quels irritants à supprimer. Ensuite maquettes à valider, construction par étapes avec des points de test, puis mise en service et prise en main." },
    { q: 'Pourra-t-on ajouter des fonctions plus tard ?', a: "Oui, c'est prévu. On ne construit pas un outil figé : quand votre activité grandit, on peut ajouter des modules (nouveau tableau de bord, nouvel espace client…) sans repartir de zéro." },
    { q: 'Mes données et celles de mes clients sont-elles protégées ?', a: "Oui. Connexion sécurisée, mots de passe, accès limités selon les rôles (un collaborateur ne voit pas tout par défaut). Vos données sont traitées avec sérieux dès la conception." },
  ];
  pages.push({
    out: 'services/developpement-application-web-bordeaux',
    title, desc, canonical: SITE + url,
    jsonld: [serviceLD('Développement d\'application web sur mesure', desc, SITE + url), breadcrumbLD([{ name: 'Accueil', url: '/' }, { name: 'Application web', url }]), faqLD(faqs)],
    body: `
${breadcrumb([{ name: 'Accueil', url: '/' }, { name: 'Application web Bordeaux', url }])}
${pageHero('(Service — Application web)', 'Développement d\'<span class="gold">application web</span> à Bordeaux', 'Un outil en ligne sur mesure : suivi de dossiers, espace client, tableau de bord… Pensé pour votre façon de travailler, accessible partout sans installation.', `
    <a class="btn btn-primary" href="/contact"><span class="bicon" aria-hidden="true">[</span> Discuter de mon projet <span class="bicon" aria-hidden="true">]</span></a>
    <a class="hero-link" href="/portfolio">Voir nos réalisations <span aria-hidden="true">→</span></a>`)}
${introSection('Pourquoi', 'Un outil pensé pour votre métier, pas l\'inverse', [
  "Les logiciels « tout faits » vous obligent souvent à contourner leurs limites : exports manuels, doubles saisies, abonnements qui s'empilent, fonctionnalités dont vous n'avez pas besoin — et celles qui vous manquent vraiment.",
  "Nous concevons un outil qui suit votre façon de travailler : tableau de bord, espace client, suivi de dossiers, devis… Accessible depuis n'importe quel ordinateur ou téléphone, sans rien installer. Il évolue avec vous quand votre activité grandit.",
])}
${features('Comment ça se passe', 'Comment nous construisons votre outil', [
  { h: '1. On part de votre quotidien', p: 'Qui fait quoi aujourd\'hui ? Quelles infos sont dispersées dans des fichiers ou des mails ? On liste ce qui vous fait perdre du temps.' },
  { h: '2. On dessine des écrans simples', p: 'Peu de clics pour les tâches fréquentes, libellés clairs, parcours logique. L\'objectif : que vos équipes l\'adoptent vite.' },
  { h: '3. On construit par étapes', p: 'Vous testez au fur et à mesure — pas une livraison surprise après trois mois sans nouvelles. On ajuste avant d\'aller plus loin.' },
  { h: '4. On sécurise les accès', p: 'Chacun se connecte avec son compte et ne voit que ce qui le concerne. Vos données et celles de vos clients sont protégées.' },
  { h: '5. On relie à vos outils', p: 'Paiement, mails, CRM, exports… On connecte votre nouvel outil à ce que vous utilisez déjà pour éviter les doubles saisies.' },
  { h: '6. On prépare la suite', p: 'Besoin d\'une nouvelle fonction dans six mois ? On l\'ajoute sur une base solide, sans tout reprendre depuis le début.' },
])}
${faqSection(faqs)}
${ctaBand('Un outil métier ou une plateforme en tête ?', 'Premier appel gratuit de 30 minutes. Réponse sous 24h.')}`,
  });
}

/* —— ARTICLES BLOG —— */
const ARTICLES = [
  {
    slug: 'de-77-a-100-optimisation-core-web-vitals',
    url: '/blog/de-77-a-100-optimisation-core-web-vitals',
    title: 'De 77 à 100/100 : comment nous avons optimisé les Core Web Vitals d\'or-web.fr',
    h1: 'De 77 à 100/100 : optimiser les Core Web Vitals d\'un site, en vanilla',
    cardTitle: 'De 77 à 100/100 : optimiser les Core Web Vitals, en vanilla',
    desc: "Étude de cas technique : comment OR-Web a fait passer son site de 77 à 100/100 sur Google PageSpeed mobile (FCP 3,8→1,1s, LCP 3,8→1,7s), en vanilla.",
    excerpt: "Comment nous avons fait passer or-web.fr d'un score PageSpeed mobile de 77 à un 100/100 parfait — 13 requêtes ramenées à 2, polices auto-hébergées, élément LCP peint immédiatement. La méthode, étape par étape.",
    date: '2026-06-21', dateLabel: '21 juin 2026', tag: 'Étude de cas',
    image: SITE + '/img/pagespeed-mobile-avant.png',
    prose: `
    <p>Un bon design ne suffit pas : si une page met quatre secondes à s'afficher sur mobile, Google la déclasse et les visiteurs partent. Voici, étape par étape, comment nous avons fait passer <a href="/">or-web.fr</a> d'un score Google PageSpeed mobile de <strong>77</strong> à un <strong>100/100</strong> parfait — sans framework, en HTML/CSS/JS vanilla.</p>
    <figure class="ba-compare">
      <div class="ba-item">
        <img src="/img/pagespeed-mobile-avant.png" alt="Rapport PageSpeed Insights mobile d'or-web.fr avant optimisation : Performances 77, Accessibilité 89, FCP et LCP à 3,8 s." loading="lazy"/>
        <figcaption><span class="ba-tag ba-before">Avant</span> 77 en performance · FCP et LCP à 3,8 s</figcaption>
      </div>
      <div class="ba-item">
        <img src="/img/pagespeed-mobile-apres.png" alt="Rapport PageSpeed Insights mobile d'or-web.fr après optimisation : 100/100 en Performances, Accessibilité, Bonnes pratiques et SEO, FCP 1,1 s, LCP 1,7 s, TBT 0 ms, CLS 0." loading="lazy"/>
        <figcaption><span class="ba-tag ba-after">Après</span> 100/100 · FCP 1,1 s · LCP 1,7 s</figcaption>
      </div>
    </figure>
    <h2>Le diagnostic</h2>
    <p>Le rapport était clair : <strong>FCP et LCP à 3,8 s</strong> sur mobile, là où Google considère « bon » en dessous de 1,8 s (FCP) et 2,5 s (LCP). Le serveur répondait vite (TTFB ≈ 0 ms) : le problème venait du <strong>chargement des ressources</strong>.</p>
    <p>La cause principale : <strong>13 requêtes HTTP bloquantes</strong> chargées dès le départ — 7 fichiers CSS et 6 fichiers JavaScript séparés. Chaque fichier était minuscule, mais sur le réseau mobile bridé, c'est le <em>nombre</em> de requêtes qui coûte cher (latence par connexion).</p>
    <h2>Les leviers actionnés</h2>
    <h3>1. Réduire les requêtes : un build esbuild</h3>
    <p>Nous avons mis en place une étape de build (<code>esbuild</code>) qui concatène et minifie les 7 CSS en un seul fichier et les 6 JS en un seul autre. Les fichiers sources restent séparés pour le développement. Résultat : <strong>13 requêtes bloquantes ramenées à 2</strong>. C'est le plus gros gain réseau.</p>
    <h3>2. Sortir Google Fonts du chemin critique</h3>
    <p>Les polices Google bloquaient l'affichage : un aller-retour vers <code>fonts.googleapis.com</code> (~750 ms) puis le téléchargement des fichiers. Nous les avons <strong>auto-hébergées</strong> (sous-ensemble latin, woff2 variables) et préchargées. Plus aucune requête tierce bloquante.</p>
    <h3>3. Peindre l'élément LCP immédiatement</h3>
    <p>L'élément le plus grand de la page (le titre du hero) était animé depuis <code>opacity: 0</code>. Tant que l'animation ne le rendait pas visible, Google ne comptait pas la page comme « affichée » — d'où un retard de ~2,5 s. Nous avons remplacé l'animation par un effet sans opacité : le texte est peint <strong>immédiatement</strong>.</p>
    <h3>4. Libérer le thread principal</h3>
    <p>Un canvas décoratif lançait un calcul de mise en page au démarrage (<em>forced reflow</em> de ~84 ms). Nous l'avons différé après le premier rendu (<code>requestIdleCallback</code>) : le <strong>Total Blocking Time tombe à 0 ms</strong>.</p>
    <h3>5. Accessibilité</h3>
    <p>En parallèle, nous avons corrigé l'accessibilité (attribut <code>inert</code> sur le menu mobile, repère <code>&lt;main&gt;</code>, contrastes conformes AA), faisant passer ce score de 89 à 100.</p>
    <h2>Le résultat</h2>
    <blockquote>De 77 à 100 en performance. FCP 3,8 → 1,1 s. LCP 3,8 → 1,7 s. TBT 0 ms. CLS 0.</blockquote>
    <p>Et 100/100 également en accessibilité, bonnes pratiques et SEO. Le tout en restant 100 % vanilla : aucun framework, juste un outil de build. Vous pouvez le vérifier vous-même sur <a href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2For-web.fr%2F&form_factor=mobile" target="_blank" rel="noopener">PageSpeed Insights</a>.</p>
    <h2>Ce qu'il faut retenir</h2>
    <ul>
      <li>Sur mobile, le <strong>nombre de requêtes</strong> compte souvent plus que leur poids.</li>
      <li>Les <strong>polices tierces</strong> sont un frein classique : auto-hébergez et préchargez.</li>
      <li>Une animation d'entrée sur l'élément LCP peut <strong>ruiner</strong> votre score sans qu'on s'en rende compte.</li>
      <li>Performance, accessibilité et SEO se renforcent mutuellement.</li>
    </ul>
    <p>Votre site est lent ou mal classé ? Nous appliquons exactement cette méthode à votre projet. <a href="/services/optimisation-seo-performance-bordeaux">Découvrir notre service SEO &amp; performance</a> ou <a href="/contact">demander un audit gratuit</a>.</p>`,
  },
  {
    slug: 'site-sur-mesure-ou-wordpress',
    url: '/blog/site-sur-mesure-ou-wordpress',
    title: 'Site sur mesure ou WordPress : que choisir pour votre entreprise ?',
    h1: 'Site sur mesure ou WordPress : que choisir ?',
    cardTitle: 'Site sur mesure ou WordPress : que choisir ?',
    desc: "Site sur mesure ou WordPress/template ? Comparatif honnête : performance, SEO, sécurité, coût et évolutivité, pour bien choisir comment construire votre site.",
    excerpt: "WordPress, template ou code sur mesure ? Un comparatif honnête sur la performance, le SEO, la sécurité et l'évolutivité — pour choisir la bonne fondation pour votre site.",
    date: '2026-06-21', dateLabel: '21 juin 2026', tag: 'Guide',
    image: SITE + '/og-image.jpg',
    prose: `
    <p>Avant même de parler design, une question décide de la qualité de votre futur site : <strong>comment le construire ?</strong> WordPress avec un thème acheté, un constructeur de pages, ou un développement sur mesure ? Voici un comparatif honnête pour choisir en connaissance de cause.</p>
    <h2>WordPress et les templates : l'option « rapide »</h2>
    <p>WordPress fait tourner une grande partie du web, et pour cause : on installe un thème, quelques extensions, et un site existe en quelques jours pour un budget de départ réduit. C'est tentant.</p>
    <p>Mais cette facilité a un prix, qui apparaît plus tard :</p>
    <ul>
      <li><strong>Performance</strong> : thèmes et extensions empilent du code que vous n'utilisez pas. Résultat fréquent : des pages lourdes, lentes sur mobile — et Google n'aime pas ça.</li>
      <li><strong>Sécurité</strong> : c'est la cible n°1 des attaques automatisées. Chaque extension est une porte potentielle, qu'il faut mettre à jour en permanence.</li>
      <li><strong>Uniformité</strong> : des milliers de sites partagent le même thème. Difficile de se démarquer.</li>
      <li><strong>Dépendances</strong> : une extension abandonnée ou une mise à jour qui casse tout, et c'est votre site qui trinque.</li>
    </ul>
    <h2>Le sur-mesure : l'option « durable »</h2>
    <p>Développer un site sur mesure, c'est écrire exactement le code nécessaire — ni plus, ni moins. L'investissement initial est plus élevé, mais ce que vous obtenez en retour change la donne :</p>
    <ul>
      <li><strong>Vitesse</strong> : sans surcouche inutile, un site sur mesure se charge en une fraction du temps. Notre propre site obtient <a href="/portfolio">100/100 sur Google PageSpeed</a>.</li>
      <li><strong>SEO</strong> : structure propre, balises maîtrisées, performances au vert — autant de signaux qui aident au classement.</li>
      <li><strong>Unicité</strong> : une interface qui ressemble à votre marque, pas à un template croisé partout.</li>
      <li><strong>Sécurité & sérénité</strong> : pas de zoo d'extensions à surveiller, une surface d'attaque réduite.</li>
      <li><strong>Évolutivité</strong> : une base saine sur laquelle ajouter des fonctionnalités sans tout casser.</li>
    </ul>
    <blockquote>La vraie question n'est pas « combien ça coûte au départ », mais « combien ça vous coûte sur trois ans ».</blockquote>
    <h2>Alors, lequel choisir ?</h2>
    <p>Un blog personnel ou un site jetable ? WordPress fait le travail. Mais dès que votre site est un <strong>outil commercial sérieux</strong> — votre vitrine principale, une boutique, une image de marque premium — le sur-mesure devient le choix rentable : plus rapide, mieux référencé, plus sûr, et réellement à vous.</p>
    <p>C'est notre parti pris chez OR-Web : <strong>zéro template</strong>, du code propre et performant. <a href="/services/creation-site-vitrine-bordeaux">Voir nos sites vitrines</a> ou <a href="/contact">parler de votre projet</a>.</p>`,
  },
];

ARTICLES.forEach(a => {
  pages.push({
    out: 'blog/' + a.slug,
    title: a.title + ' | Blog OR-Web',
    desc: a.desc, canonical: SITE + a.url,
    jsonld: [
      {
        '@context': 'https://schema.org', '@type': 'Article',
        headline: a.title, description: a.desc,
        datePublished: a.date, dateModified: a.date, image: a.image,
        author: { '@type': 'Organization', name: 'OR-Web', url: SITE + '/' },
        publisher: { '@type': 'Organization', name: 'OR-Web', url: SITE + '/' },
        mainEntityOfPage: SITE + a.url,
      },
      breadcrumbLD([{ name: 'Accueil', url: '/' }, { name: 'Blog', url: '/blog' }, { name: a.cardTitle, url: a.url }]),
    ],
    body: `
${breadcrumb([{ name: 'Accueil', url: '/' }, { name: 'Blog', url: '/blog' }, { name: a.tag, url: a.url }])}
<header class="port-head ed">
  <span class="port-eyebrow marginalia" aria-hidden="true">${a.tag} · ${a.dateLabel}</span>
  <h1 class="port-h1 reveal">${a.h1}</h1>
</header>
<article class="article ed">
  <div class="prose reveal d1">${a.prose}
  </div>
</article>
${ctaBand('Un projet web en tête ?', 'Premier appel gratuit de 30 minutes. Réponse sous 24h.')}`,
  });
});

/* —— BLOG : index —— */
{
  const url = '/blog';
  const title = 'Blog — Web, performance & SEO | OR-Web Bordeaux';
  const desc = "Le blog d'OR-Web, agence web à Bordeaux : études de cas, performance web, Core Web Vitals, SEO et bonnes pratiques de développement.";
  const cards = ARTICLES.map((a, i) => `
      <li>
        <a class="blog-card ${revealStagger(i)}" href="${a.url}">
          <span class="bc-meta">${a.tag} · ${a.dateLabel}</span>
          <h2>${a.cardTitle}</h2>
          <p>${a.excerpt}</p>
          <span class="bc-more">Lire l'article →</span>
        </a>
      </li>`).join('');
  pages.push({
    out: 'blog',
    title, desc, canonical: SITE + url,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'Blog', name: 'Blog OR-Web', url: SITE + url, description: desc },
      breadcrumbLD([{ name: 'Accueil', url: '/' }, { name: 'Blog', url }]),
    ],
    body: `
${breadcrumb([{ name: 'Accueil', url: '/' }, { name: 'Blog', url }])}
${pageHero('(Blog)', 'Le <span class="gold">blog</span> d\'OR-Web', 'Études de cas, performance web, SEO et coulisses de nos projets. Du concret, mesuré et vérifiable.')}
<section class="lp-section" style="border-top:none;padding-top:0">
  <div class="ed">
    <ul class="blog-list" role="list">${cards}
    </ul>
  </div>
</section>
${ctaBand('Un projet web en tête ?', 'Premier appel gratuit de 30 minutes. Réponse sous 24h.')}`,
  });
}

/* ════════════════════════ PAGES LÉGALES ════════════════════════ */
function legalIdentityBlock() {
  const rows = [
    LEGAL.legalForm && `<p><strong>Raison sociale :</strong> ${LEGAL.legalForm}</p>`,
    `<p><strong>Dénomination :</strong> ${LEGAL.siteName} — ${LEGAL.tagline}</p>`,
    `<p><strong>Siège :</strong> ${LEGAL.address}</p>`,
    LEGAL.siret && `<p><strong>SIRET :</strong> ${LEGAL.siret}</p>`,
    LEGAL.rcs && `<p><strong>RCS :</strong> ${LEGAL.rcs}</p>`,
    LEGAL.tva && `<p><strong>N° TVA intracommunautaire :</strong> ${LEGAL.tva}</p>`,
    LEGAL.capital && `<p><strong>Capital social :</strong> ${LEGAL.capital}</p>`,
    `<p><strong>Email :</strong> <a href="mailto:${LEGAL.email}">${LEGAL.email}</a></p>`,
    `<p><strong>Téléphone :</strong> <a href="tel:${LEGAL.phone.replace(/\s/g, '')}">${LEGAL.phone}</a></p>`,
  ].filter(Boolean).join('\n');
  return rows;
}

{
  const url = '/mentions-legales';
  const title = 'Mentions légales | OR-Web';
  const desc = "Mentions légales du site or-web.fr : éditeur, hébergement, propriété intellectuelle et contact.";
  pages.push({
    out: 'mentions-legales',
    title, desc, canonical: SITE + url,
    jsonld: [breadcrumbLD([{ name: 'Accueil', url: '/' }, { name: 'Mentions légales', url }])],
    body: `
${breadcrumb([{ name: 'Accueil', url: '/' }, { name: 'Mentions légales', url }])}
<article class="article ed">
  <header class="article-head">
    <span class="article-meta">Légal</span>
    <h1 class="article-h1">Mentions légales</h1>
  </header>
  <div class="prose">
    <p>Conformément aux dispositions des articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), les présentes mentions légales s'appliquent au site <a href="/">or-web.fr</a>.</p>
    <h2>Éditeur du site</h2>
    ${legalIdentityBlock()}
    <p><strong>Directeur de la publication :</strong> ${LEGAL.publisher} (<a href="mailto:${LEGAL.email}">${LEGAL.email}</a>)</p>
    <h2>Hébergement</h2>
    <p>Le site est hébergé par :</p>
    <p><strong>${LEGAL.host.name}</strong><br>${LEGAL.host.address}<br><a href="${LEGAL.host.website}" target="_blank" rel="noopener">${LEGAL.host.website}</a></p>
    <h2>Propriété intellectuelle</h2>
    <p>L'ensemble des éléments du site (textes, visuels, charte graphique, code source, logos) est la propriété exclusive d'OR-Web ou de ses partenaires, sauf mention contraire. Toute reproduction, représentation ou adaptation, totale ou partielle, sans autorisation écrite préalable, est interdite.</p>
    <h2>Responsabilité</h2>
    <p>OR-Web s'efforce d'assurer l'exactitude des informations publiées sur ce site. Toutefois, OR-Web ne saurait être tenue responsable des omissions, inexactitudes ou indisponibilités temporaires du service.</p>
    <h2>Contact</h2>
    <p>Pour toute question relative au site ou à son contenu : <a href="mailto:${LEGAL.email}">${LEGAL.email}</a> ou via le <a href="/contact">formulaire de contact</a>.</p>
  </div>
</article>`,
  });
}

{
  const url = '/politique-de-confidentialite';
  const title = 'Politique de confidentialité | OR-Web';
  const desc = "Politique de confidentialité d'OR-Web : données collectées via le formulaire de contact, finalités, durée de conservation et vos droits RGPD.";
  pages.push({
    out: 'politique-de-confidentialite',
    title, desc, canonical: SITE + url,
    jsonld: [breadcrumbLD([{ name: 'Accueil', url: '/' }, { name: 'Politique de confidentialité', url }])],
    body: `
${breadcrumb([{ name: 'Accueil', url: '/' }, { name: 'Politique de confidentialité', url }])}
<article class="article ed">
  <header class="article-head">
    <span class="article-meta">Légal — RGPD</span>
    <h1 class="article-h1">Politique de confidentialité</h1>
  </header>
  <div class="prose">
    <p>La présente politique décrit comment <strong>${LEGAL.siteName}</strong> traite les données personnelles collectées via le site <a href="/">or-web.fr</a>, conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés.</p>
    <h2>Responsable du traitement</h2>
    ${legalIdentityBlock()}
    <p>Contact données personnelles : <a href="mailto:${LEGAL.email}">${LEGAL.email}</a></p>
    <h2>Données collectées</h2>
    <p>Via le <a href="/contact">formulaire de contact</a>, nous collectons uniquement les informations que vous saisissez volontairement :</p>
    <ul>
      <li>nom ;</li>
      <li>adresse email ;</li>
      <li>sujet de la demande ;</li>
      <li>contenu du message.</li>
    </ul>
    <p>Nous ne collectons pas de données sensibles. Un champ « honeypot » technique, invisible pour les visiteurs, peut être utilisé pour détecter les envois automatisés (spam).</p>
    <h2>Finalités et base légale</h2>
    <p>Vos données sont traitées pour :</p>
    <ul>
      <li>répondre à votre demande de contact ou de devis ;</li>
      <li>assurer le suivi commercial de votre projet ;</li>
      <li>prévenir les abus (limitation du nombre d'envois, filtrage anti-spam).</li>
    </ul>
    <p>La base légale est votre <strong>consentement</strong> (case à cocher au moment de l'envoi) et, le cas échéant, notre <strong>intérêt légitime</strong> à gérer les demandes entrantes.</p>
    <h2>Durée de conservation</h2>
    <p>Les messages reçus sont conservés le temps nécessaire au traitement de votre demande, puis archivés ou supprimés au plus tard <strong>3 ans</strong> après le dernier contact, sauf obligation légale contraire.</p>
    <h2>Destinataires</h2>
    <p>Les données sont accessibles uniquement aux personnes habilitées chez OR-Web. Elles ne sont ni vendues ni cédées à des tiers. Les emails transitent par notre prestataire SMTP (OVH) et peuvent transiter par notre hébergeur (Render) dans le cadre technique du service.</p>
    <h2>Cookies et traceurs</h2>
    <p>Le site vitrine or-web.fr ne dépose pas de cookies publicitaires ou de mesure d'audience tiers à ce jour. Seuls des cookies techniques strictement nécessaires au fonctionnement du site peuvent être utilisés par l'hébergeur.</p>
    <h2>Vos droits</h2>
    <p>Vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité. Pour les exercer, écrivez à <a href="mailto:${LEGAL.email}">${LEGAL.email}</a> en précisant votre demande et un moyen de vous identifier.</p>
    <p>Vous pouvez également introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener">CNIL</a>.</p>
    <h2>Sécurité</h2>
    <p>Nous mettons en œuvre des mesures raisonnables (validation des entrées, limitation des envois, chiffrement SMTP) pour protéger vos données contre l'accès non autorisé.</p>
    <h2>Mise à jour</h2>
    <p>Cette politique peut être modifiée pour refléter l'évolution du site ou de la réglementation. Date de dernière mise à jour : juillet 2026.</p>
  </div>
</article>`,
  });
}

/* ════════════════════════ ÉCRITURE ════════════════════════ */
function writePages() {
  pages.forEach(p => {
    const dir = path.join(FE, p.out);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), layout(p));
  });
  console.log(`Pages OK → ${pages.length} pages générées (${pages.map(p => '/' + p.out).join(', ')})`);
}

/* ── Sitemap ──
   Généré ici plutôt que maintenu à la main : `pages` + portfolio-data
   connaissent toutes les URL — aucune étape manuelle à l'ajout d'un projet. */
function writeSitemap() {
  const urls = [
    { loc: '/', cf: 'monthly', pr: '1.0' },
    { loc: '/portfolio', cf: 'monthly', pr: '0.9' },
    { loc: '/contact', cf: 'yearly', pr: '0.8' },
    ...pages.map(p => ({
      loc: '/' + p.out,
      cf: p.out === 'blog' ? 'weekly' : 'yearly',
      pr: (p.out === 'mentions-legales' || p.out === 'politique-de-confidentialite')
        ? '0.3'
        : p.out.startsWith('blog') ? '0.7' : '0.9',
    })),
    ...portfolio.getDetailProjects().map(p => ({
      loc: `/projets/${p.id}.html`, cf: 'yearly', pr: '0.6',
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <changefreq>${u.cf}</changefreq>
    <priority>${u.pr}</priority>
  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(FE, 'sitemap.xml'), xml);
  console.log(`Sitemap OK → ${urls.length} URL`);
}

writePages();
writeProjectPages();
writeSitemap();
module.exports = { pages };
