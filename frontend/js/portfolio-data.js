/* ──────────────────────────────────────────────────────────────────────────
   PORTFOLIO — DONNÉES + TEMPLATES HTML PURS (partagés navigateur ↔ serveur)

   Source unique des réalisations : cartes portfolio (SSR + client) et pages
   études de cas (générées par build-pages.js depuis renderProjectDetailBody).

   Toute interactivité (filtres, scaling iframes) reste dans portfolio.js.
   ────────────────────────────────────────────────────────────────────────── */
(function (global) {
  'use strict';

  const SERVICE_FILTERS = [
    { id: 'site-web', label: 'Site web',          hash: 'site-web', serviceUrl: '/services/creation-site-vitrine-bordeaux' },
    { id: 'app-web',  label: 'Application web',   hash: 'app-web',  serviceUrl: '/services/developpement-application-web-bordeaux' },
    { id: 'seo',      label: 'SEO & Performance', hash: 'seo',      serviceUrl: '/services/optimisation-seo-performance-bordeaux' },
  ];

  const projects = [
    {
      id: 'iznogrillz',
      service: 'site-web',
      subType: 'vitrine',
      subTypeLabel: 'Vitrine',
      title: 'IznoGrillz',
      tags: ['Site en ligne', 'Configurateur', 'Hero vidéo', 'JS Vanilla'],
      desc: "Atelier de grillz sur mesure à Bordeaux — univers néo-gothique glitch, galerie « grimoire » et configurateur de set avec estimation. En ligne sur iznogrillz.fr.",
      year: '2026',
      img: 'projets/img/iznogrillz/hero.jpg',
      siteUrl: 'iznogrillz.fr',
      badge: 'en ligne',
      url: 'projets/iznogrillz.html',
      detail: {
        metaTitle: 'IznoGrillz — Vitrine & configurateur de grillz | Portfolio OR-Web',
        metaDesc: "Étude de cas IznoGrillz : vitrine néo-gothique et configurateur de grillz sur mesure, en ligne sur iznogrillz.fr. Réalisé en HTML/CSS/JS vanilla par OR-Web.",
        label: 'Vitrine',
        heroTitle: 'Izno<em class="kw">Grillz</em>',
        heroDesc: "Site vitrine et configurateur pour un atelier bordelais de grillz sur mesure — pièces uniques en cobalt-chrome forgées sur empreinte. Univers néo-gothique glitch (typographies blackletter, néons cyan et magenta), écran d'intro « invocation », galerie « grimoire » et configurateur de set en 3 étapes. Le site est en ligne sur iznogrillz.fr.",
        client: 'IznoGrillz',
        category: 'Vitrine & Configurateur',
        duration: '4 semaines',
        liveUrl: 'https://www.iznogrillz.fr/',
        heroImg: 'projets/img/iznogrillz/hero.jpg',
        screens: [
          { addr: 'iznogrillz.fr/realisations', img: 'projets/img/iznogrillz/galerie-grimoire.jpg', title: 'IznoGrillz — Le grimoire', featured: true },
          { addr: 'iznogrillz.fr/contact',      img: 'projets/img/iznogrillz/configurateur.jpg',    title: 'IznoGrillz — Configurateur' },
          { addr: 'iznogrillz.fr/realisations', img: 'projets/img/iznogrillz/pacte.jpg',            title: 'IznoGrillz — Prise de rendez-vous' },
        ],
        paragraphs: [
          "IznoGrillz est un atelier bordelais qui forge des grillz entièrement sur mesure à partir d'une empreinte dentaire — pièces uniques en cobalt-chrome ou chrome noir, émail fluo, gravure main, pierres serties. Il fallait un site à la hauteur de cet univers underground, qui donne envie de commander une pièce.",
          'Le design assume une direction artistique <strong>néo-gothique / glitch</strong> : typographies blackletter lumineuses, néons cyan et magenta sur noir profond, curseur personnalisé et écran d\'intro « invocation » avec log de boot. La galerie « Le grimoire » présente les œuvres numérotées, photos et vidéos à l\'appui.',
          "Cœur du site : un <strong>configurateur en 3 étapes</strong> — sélection des dents sur un schéma dentaire SVG interactif (notation FDI), choix de la matière (cobalt ou chrome), coordonnées puis validation avec estimation. La prise d'empreinte se fait à Bordeaux ou en déplacement. Entièrement responsive, sans framework.",
        ],
        stack: ['HTML5 Sémantique', 'CSS3 / Keyframes', 'JS Vanilla', 'Configurateur 3 étapes', 'Schéma dentaire SVG', 'Hero vidéo', 'Effets Glitch', 'Mobile-first'],
      },
    },
    {
      id: 'lhomme-invisible',
      service: 'site-web',
      subType: 'vitrine',
      subTypeLabel: 'Vitrine',
      title: "L'Homme Invisible",
      tags: ['Vitrine', 'Galerie', 'Réservation', 'JS Vanilla'],
      desc: "Salon de tatouage à Bordeaux — curseur sur mesure, galerie filtrable, fiches artistes et réservation en ligne.",
      year: '2025',
      demo: true,
      preview: 'projets/img/lhomme-invisible/preview.webp',
      siteUrl: 'lhomme-invisible-tattoo.fr',
      url: 'projets/lhomme-invisible.html',
      detail: {
        metaTitle: "L'Homme Invisible — Vitrine tatouage | Portfolio OR-Web",
        metaDesc: "Étude de cas L'Homme Invisible : vitrine tatouage à Bordeaux, galerie immersive et réservation en ligne. Réalisé en vanilla par OR-Web.",
        label: 'Vitrine',
        heroTitle: "L'Homme <em class=\"kw\">Invisible</em>",
        heroDesc: "Site vitrine pour un salon de tatouage d'exception à Bordeaux. Curseur personnalisé, galerie artistique immersive, fiches artistes, formulaire de réservation et animations soignées. Un univers sombre et élégant à l'image de l'artiste.",
        client: "L'Homme Invisible",
        category: 'Site Vitrine',
        duration: '3 semaines',
        demoPath: 'lhomme-invisible/index.html',
        screens: [
          { addr: 'lhomme-invisible-tattoo.fr/#galerie', src: 'lhomme-invisible/index.html#galerie', title: 'Galerie',      featured: true },
          { addr: 'lhomme-invisible-tattoo.fr/#about',   src: 'lhomme-invisible/index.html#about',   title: "L'Atelier" },
          { addr: 'lhomme-invisible-tattoo.fr/#booking', src: 'lhomme-invisible/index.html#booking', title: 'Réservation' },
        ],
        paragraphs: [
          "L'Homme Invisible est un salon de tatouage haut de gamme basé à Bordeaux. L'enjeu était de créer une présence digitale aussi soignée et singulière que l'art proposé — une expérience immersive qui plonge le visiteur dans l'univers artistique de l'équipe.",
          'Le design adopte une direction artistique <strong>gothique / fine line</strong> : palette sombre, typographies sérifs élégantes, illustrations SVG artisanales. Un curseur personnalisé accompagne chaque interaction.',
          "Le site intègre une galerie filtrable, des fiches artistes, une FAQ accordéon, un formulaire de réservation et une section contact. Entièrement responsive, sans framework.",
        ],
        stack: ['HTML5 Sémantique', 'CSS3 / Keyframes', 'JS Vanilla', 'Curseur Custom', 'Galerie Filtrée', 'SVG Artisanal', 'Scroll Reveal', 'Mobile-first'],
      },
    },
    {
      id: 'casa-terra',
      service: 'site-web',
      subType: 'vitrine',
      subTypeLabel: 'Vitrine',
      title: 'Casa Terra',
      tags: ['Vitrine', 'Design éditorial', 'Marquee', 'Scroll Reveal'],
      desc: "Concept store déco à Bordeaux — identité voyage et artisanat, marquee animé et scroll reveal. Vitrine premium sans framework.",
      year: '2025',
      demo: true,
      preview: 'projets/img/casa-terra/preview.webp',
      siteUrl: 'casa-terra-bordeaux.fr',
      url: 'projets/casa-terra.html',
      detail: {
        metaTitle: 'Casa Terra — Vitrine premium | Portfolio OR-Web',
        metaDesc: "Étude de cas Casa Terra : vitrine premium pour un concept store bordelais. Design éditorial, marquee et animations fluides, en vanilla.",
        label: 'Vitrine',
        heroTitle: 'Casa <em class="kw">Terra</em>',
        heroDesc: "Vitrine premium pour un concept store de décoration du monde situé à Bordeaux. Design éditorial haut de gamme, effets de textures naturelles, marquee animé, scroll reveal et une identité visuelle ancrée dans les voyages et l'artisanat mondial.",
        client: 'Casa Terra',
        category: 'Site Vitrine',
        duration: '3 semaines',
        demoPath: 'casa-terra/index.html',
        screens: [
          { addr: 'casa-terra-bordeaux.fr/#univers',  src: 'casa-terra/index.html#univers',  title: 'Collections',    featured: true },
          { addr: 'casa-terra-bordeaux.fr/#origines', src: 'casa-terra/index.html#origines', title: 'Origines' },
          { addr: 'casa-terra-bordeaux.fr/#lisa',      src: 'casa-terra/index.html#lisa',      title: 'La Fondatrice' },
        ],
        paragraphs: [
          "Casa Terra est un concept store bordelais proposant des objets de décoration et d'artisanat du monde entier. Le défi était de concevoir une vitrine digitale qui transmette la chaleur, le voyage et l'authenticité de la boutique physique.",
          'Le design adopte une direction artistique <strong>éditorialiste / voyage</strong> : textures de papier, typographies sérifs élégantes, palette chaude terracotta et crème. Un marquee animé, des transitions fluides et des animations au scroll créent une expérience premium.',
          "Le site présente les collections, les origines géographiques des produits, la fondatrice et les informations de visite. Entièrement responsive, sans framework.",
        ],
        stack: ['HTML5 Sémantique', 'CSS3 / Keyframes', 'JS Vanilla', 'Marquee Animé', 'Scroll Reveal', 'Curseur Custom', 'Design Éditorial', 'Mobile-first'],
      },
    },

    {
      id: 'voxline',
      service: 'app-web',
      subType: 'crm',
      subTypeLabel: 'Application web',
      title: 'Voxline',
      tags: ['Pipeline B2B', 'Centre d\'appel', 'Import CSV', 'PostgreSQL'],
      desc: "Hub de prospection pour un centre d'appel : pipeline visuel, fiches prospects, journal d'appels et import CSV contrôlé.",
      year: '2026',
      img: 'projets/img/voxline/dashboard.png',
      siteUrl: 'app.voxline.fr',
      url: 'projets/voxline.html',
      detail: {
        metaTitle: "Voxline — Application prospection centre d'appel | Portfolio OR-Web",
        metaDesc: "Étude de cas Voxline : application web de prospection B2B pour centre d'appel. Pipeline, fiches prospects, interactions et import CSV, en Node.js et PostgreSQL.",
        label: 'Application web',
        heroTitle: 'Vox<em class="kw">line</em>',
        heroDesc: "Application métier pour un centre d'appel B2B : suivi du pipeline commercial, fiches prospects enrichies, journal des interactions (appels, emails) et import CSV avec prévisualisation et dédoublonnage — pensée pour des équipes de téléprospecteurs.",
        client: 'Voxline',
        category: "Centre d'appel B2B",
        duration: '3 semaines',
        heroImg: 'projets/img/voxline/dashboard.png',
        screens: [
          { addr: 'app.voxline.fr/prospects', img: 'projets/img/voxline/prospects.png', title: 'Liste prospects', featured: true },
          { addr: 'app.voxline.fr/prospect/128', img: 'projets/img/voxline/prospect.png', title: 'Fiche prospect' },
          { addr: 'app.voxline.fr/admin', img: 'projets/img/voxline/admin.png', title: 'Import CSV & comptes' },
        ],
        paragraphs: [
          "Voxline opère un centre d'appel dédié à la prospection commerciale B2B. L'équipe gérait ses leads dans des tableurs éclatés : pas de vision pipeline partagée, interactions difficiles à tracer, imports CSV risqués. Il fallait un outil unique, rapide et sécurisé.",
          "L'application propose un <strong>tableau de bord pipeline</strong> en 7 étapes, une liste prospects filtrable (secteur, statut site, recherche full-text), des fiches détaillées avec historique d'interactions et un module d'<strong>import CSV</strong> en deux temps : prévisualisation puis validation transactionnelle, sans écraser les données existantes.",
          "Côté technique : API REST Express, PostgreSQL, sessions persistées en base, authentification Argon2id et rôles admin / prospecteur. Interface vanilla dense et lisible, conçue pour des journées de prospection au téléphone.",
        ],
        stack: ['Node.js', 'Express', 'PostgreSQL', 'Sessions sécurisées', 'Argon2id', 'Import CSV', 'Vanilla JS', 'Rôles & permissions'],
      },
    },

    {
      id: 'crm-or-web',
      service: 'app-web',
      subType: 'crm',
      subTypeLabel: 'Application web',
      title: 'CRM Or-Web',
      tags: ['FastAPI', 'Next.js 15', 'PostgreSQL', 'Docker'],
      desc: "Notre outil commercial interne, utilisé tous les jours : chaque prospect a une fiche unique, un historique d'échanges horodaté et des relances qui remontent d'elles-mêmes. Pas une démo.",
      year: '2026',
      /* Badge « interne » et non « en ligne » : app.or-web.fr est derrière
         authentification. Un visiteur ne tomberait que sur un écran de login,
         d'où l'absence volontaire de lien externe (pas de liveUrl, pas de demo). */
      badge: 'interne',
      /* Maquette anonymisée rendue par scripts/capture-crm.js : l'application
         réelle est derrière authentification et ne peut pas être capturée.
         Identités floutées, chiffres illustratifs et cohérents entre eux. */
      img: 'projets/img/crm-or-web/dashboard.png',
      siteUrl: 'app.or-web.fr',
      url: 'projets/crm-or-web.html',
      detail: {
        metaTitle: 'CRM Or-Web — Notre CRM de prospection interne | Portfolio OR-Web',
        metaDesc: "Étude de cas CRM Or-Web : notre outil interne de prospection B2B locale. Fiche entreprise unique, pipeline de qualification, journal d'appels et relances programmées. FastAPI, Next.js 15 et PostgreSQL.",
        label: 'Application web',
        heroTitle: 'CRM <em class="kw">OR-Web</em>',
        heroDesc: "Notre outil commercial, construit pour nous : fiche entreprise unique, pipeline de qualification du premier contact à la signature, journal d'appels horodaté et relances programmées. Application interne, derrière authentification — pas de démo publique.",
        client: 'OR-Web (interne)',
        category: 'CRM prospection B2B',
        heroImg: 'projets/img/crm-or-web/dashboard.png',
        /* Pas de champ `duration` : la durée réelle n'est pas connue. Le gabarit
           omet la ligne plutôt que d'afficher un chiffre inventé. */
        screens: [],
        paragraphs: [
          '<strong>Le problème.</strong> Prospecter en solo, c\'est un tableur qui devient ingérable à 200 lignes. Plus personne ne sait qui a été appelé, quand, ni ce qui a été dit. Les relances passent à la trappe.',
          '<strong>La réponse.</strong> Un CRM taillé pour un seul usage : la prospection B2B locale. Pas de modules inutiles, pas de configuration à rallonge. Import contrôlé d\'une base de prospects avec dédoublonnage par SIRET, fiche entreprise unique, pipeline visuel du premier contact à la signature, journal d\'appels horodaté, et relances qui remontent d\'elles-mêmes.',
          '<strong>L\'architecture.</strong> API FastAPI (SQLAlchemy, migrations Alembic) sur PostgreSQL, interface Next.js 15, le tout en monorepo. Déployé sur VPS auto-hébergé via Docker Compose derrière Caddy — base jamais exposée hors du réseau Docker, accès applicatif par clé d\'API.',
        ],
        /* Rendu en commentaire HTML dans la page : section à compléter avec un
           chiffre réel. Ne rien inventer ici. */
        note: 'Ce qu\'on en retient : À COMPLÉTER avec un chiffre réel (ne pas inventer).',
        stack: ['FastAPI', 'SQLAlchemy', 'Alembic', 'PostgreSQL', 'Next.js 15', 'Docker Compose', 'Caddy', 'Monorepo'],
      },
    },

    {
      id: 'or-web-perf',
      service: 'seo',
      subTypeLabel: 'SEO & Performance',
      title: 'OR-Web',
      tags: ['PageSpeed 100', 'Core Web Vitals', 'esbuild', 'Accessibilité AA'],
      desc: "Refonte technique d'or-web.fr : score mobile 77 → 100/100 sur PageSpeed Insights. Build esbuild, polices self-hostées, zéro blocage.",
      year: '2026',
      img: 'img/pagespeed-mobile-avant.png',
      siteUrl: 'or-web.fr',
      badge: '100/100',
      url: '/blog/de-77-a-100-optimisation-core-web-vitals',
    },
  ];

  function getDetailProjects() {
    return projects.filter(p => p.detail);
  }

  function countByService(serviceId) {
    return projects.filter(p => p.service === serviceId && !p.upcoming).length;
  }

  /* Chemins absolus pour les pages sous /projets/ (évite projets/projets/…). */
  function assetUrl(path) {
    if (!path || path.startsWith('/') || /^https?:\/\//i.test(path)) return path;
    if (path.startsWith('projets/')) return '/' + path;
    return '/projets/' + path;
  }

  /* ── TEMPLATES portfolio (cartes) ── */
  /* preview : capture WebP de 3 écrans (scripts/capture-previews.js), défilée
     au survol de la carte. Remplace les iframes live (~2,7 Mo de démos
     chargées sur /portfolio). Dimensions déclarées → aucun décalage (CLS). */
  /* Aperçu indisponible : projet sans capture au dépôt (application derrière
     authentification). Bloc neutre — évite un cadre navigateur vide côté carte
     et une <iframe src="undefined"> côté étude de cas. */
  const MEDIA_PLACEHOLDER =
    '<div class="media-placeholder"><span>Aperçu non public</span></div>';

  function projMedia(p) {
    if (p.preview)
      return `<div class="pin-viewport pin-scroll"><img class="pin-shot" src="${p.preview}" width="720" height="1350" alt="Aperçu du site ${p.title}" decoding="async"></div>`;
    if (p.img)
      return `<img class="pin-img" src="${p.img}" alt="Aperçu — ${p.title}" loading="lazy">`;
    return MEDIA_PLACEHOLDER;
  }

  /* Nom de View Transition partagé carte ↔ mockup de l'étude de cas : la
     capture « devient » la page projet (css/effects.css). Uniquement pour les
     projets qui ont une page détail. */
  function vtName(p) {
    return p.detail ? ` style="view-transition-name: shot-${p.id}"` : '';
  }

  /* Barre de navigateur des mockups (pastilles neutres : palette du site) */
  function browserBar(addr, badge) {
    return `<div class="browser-bar">
              <span class="browser-dots" aria-hidden="true"><span></span><span></span><span></span></span>
              <span class="browser-addr">${addr || ''}</span>${badge || ''}
            </div>`;
  }

  function renderBadge(p) {
    if (p.badge) return `<span class="tag">${p.badge}</span>`;
    if (p.demo) return `<span class="tag">Live</span>`;
    return '';
  }

  /* Carte projet = carte de l'accueil (composant .card) : numéro en contour
     qui se remplit de lime au survol / focus, flèche, tags en tokens. */
  function renderProjectCard(p, i) {
    const num = String(i + 1).padStart(2, '0');
    // Le type est déjà le 1er tag : pas de doublon (« Vitrine » deux fois)
    const tags = p.tags.filter(t => t.toLowerCase() !== p.subTypeLabel.toLowerCase())
      .map(t => `<li class="tag">${t}</li>`).join('');
    return `
    <li>
      <a class="card port-card" href="${p.url}">
        <figure class="browser-mockup port-card-media"${vtName(p)}>
            ${browserBar(p.siteUrl, renderBadge(p))}
            ${projMedia(p)}
        </figure>
        <div class="port-card-body">
          <span class="card-num" data-n="${num}" aria-hidden="true">${num}</span>
          <span class="card-go port-card-go" aria-hidden="true">→</span>
          <h2 class="card-title">${p.title}</h2>
          <p class="card-text">${p.desc}</p>
          <ul class="tags" aria-label="Type, année et technologies">
            <li class="tag is-on">${p.subTypeLabel}</li><li class="tag">${p.year}</li>${tags}
          </ul>
        </div>
      </a>
    </li>`;
  }

  function renderPanelHTML(serviceId, { active = false } = {}) {
    const items = projects.filter(p => p.service === serviceId);
    const cards = items.map(renderProjectCard).join('');

    const activeClass = active ? ' port-panel-on' : '';
    const hidden = active ? '' : ' hidden';

    return `
    <div class="port-panel${activeClass}" id="panel-${serviceId}" role="tabpanel" aria-labelledby="tab-${serviceId}"${hidden}>
      <ul class="card-grid port-grid ed" role="list">${cards}</ul>
    </div>`;
  }

  function renderSiteWebPanelHTML() { return renderPanelHTML('site-web', { active: true }); }
  function renderAppWebPanelHTML()  { return renderPanelHTML('app-web'); }
  function renderSeoPanelHTML()     { return renderPanelHTML('seo'); }

  function renderFiltersHTML() {
    const tabs = SERVICE_FILTERS.map((f, i) => {
      const count = countByService(f.id);
      const selected = i === 0;
      return `
      <button type="button" class="btn btn-secondary port-tab${selected ? ' is-on' : ''}"
              role="tab" id="tab-${f.id}"
              aria-selected="${selected}"
              aria-controls="panel-${f.id}"
              data-service="${f.id}">
        ${f.label}
        <span class="port-tab-count" aria-hidden="true">(${count})</span>
        <span class="sr-only">${count} réalisation${count > 1 ? 's' : ''}</span>
      </button>`;
    }).join('');

    return `
    <div class="port-filters-wrap ed ed-grid">
      <span class="sec-label marginalia" aria-hidden="true">(Filtrer)</span>
      <div class="sec-body">
        <div class="port-tabs actions" role="tablist" aria-label="Filtrer les réalisations par service">${tabs}</div>
        <a class="link-arrow port-service-link" id="port-service-link" href="${SERVICE_FILTERS[0].serviceUrl}">Voir notre offre <span aria-hidden="true">→</span></a>
      </div>
    </div>`;
  }

  function renderPortfolioHTML() {
    return `
    <div class="port-catalog">
      ${renderFiltersHTML()}
      ${renderSiteWebPanelHTML()}
      ${renderAppWebPanelHTML()}
      ${renderSeoPanelHTML()}
    </div>`;
  }

  function renderPinsHTML() { return renderPortfolioHTML(); }

  /* ── TEMPLATE page étude de cas (corps du <main> — build-pages assemble le
     document et ajoute le bloc CTA commun). Mêmes composants que les autres
     pages internes : en-tête .page-head, sections .sec, fiche .info-list. ── */
  function renderProjectDetailBody(p) {
    const d = p.detail;
    /* liveUrl (site client en production) prime sur demoPath (maquette locale). */
    const link = d.liveUrl
      ? { href: d.liveUrl, label: 'Voir le site en ligne', tag: 'En ligne' }
      : d.demoPath ? { href: assetUrl(d.demoPath), label: 'Voir le site démo', tag: p.demo ? 'Démo' : '' } : null;
    const actions = link
      ? `<div class="actions">
      <a class="btn btn-primary" href="${link.href}" target="_blank" rel="noopener"><span class="bicon" aria-hidden="true">$</span> ${link.label} <span class="bicon" aria-hidden="true">→</span></a>
      ${link.tag ? `<span class="tag">${link.tag}</span>` : ''}
    </div>`
      : '';

    function frame(media, isImg) {
      return `<div class="browser-frame${isImg ? ' browser-frame-img' : ''}">
          ${media}
        </div>`;
    }
    function renderScreen(s) {
      const media = s.img
        ? `<img src="${assetUrl(s.img)}" alt="${s.title}" loading="lazy">`
        // Sans #ancre dans src : la navigation vers un fragment d'une iframe
        // same-origin fait aussi défiler la page parente au chargement. Le
        // défilement interne est fait par js/pages.js (data-anchor).
        : `<iframe src="${assetUrl(s.src.split('#')[0])}"${s.src.includes('#') ? ` data-anchor="${s.src.split('#')[1]}"` : ''} title="${s.title}" loading="lazy"></iframe>`;
      return `
        <figure class="browser-mockup${s.featured ? ' proj-shot-wide' : ''}">
          ${browserBar(s.addr)}
          ${frame(media, !!s.img)}
        </figure>`;
    }

    const heroMedia = d.heroImg
      ? `<img src="${assetUrl(d.heroImg)}" alt="Aperçu — ${p.title}" loading="lazy">`
      : d.demoPath
        ? `<iframe src="${assetUrl(d.demoPath)}" title="${p.title}" loading="lazy"></iframe>`
        : MEDIA_PLACEHOLDER;
    // Durée absente = non connue : la ligne est retirée plutôt qu'inventée
    const facts = [['Client', d.client], ['Catégorie', d.category], ['Année', p.year], ['Durée', d.duration]]
      .filter(([, v]) => v)
      .map(([k, v]) => `
          <li class="info-row"><span class="marginalia">${k}</span><span class="info-val">${v}</span></li>`).join('');
    const paragraphs = d.paragraphs.map(para => `<p class="sec-p">${para}</p>`).join('\n        ')
      // Section laissée à compléter — visible en commentaire dans le HTML livré
      + (d.note ? `\n        <!-- ${d.note} -->` : '');
    const stack = d.stack.map(t => `<li class="tag">${t}</li>`).join('');

    return `
<nav class="breadcrumb ed" aria-label="Retour"><a href="/portfolio">← Retour au portfolio</a></nav>
<header class="page-head ed ed-grid">
  <span class="page-eyebrow marginalia" aria-hidden="true">(${d.label})</span>
  <h1 class="page-title"><span class="ht-line"><span class="ht-in">${d.heroTitle}</span></span></h1>
  <p class="page-lead">${d.heroDesc}</p>
  ${actions}
</header>

<section class="sec" aria-label="Fiche du projet">
  <div class="ed ed-grid">
    <span class="sec-label marginalia" aria-hidden="true">(Fiche)</span>
    <ul class="info-list proj-facts" role="list">${facts}
    </ul>
    <figure class="browser-mockup proj-hero-shot"${vtName(p)}>
      ${browserBar(p.siteUrl)}
      ${frame(heroMedia, !!d.heroImg || !d.demoPath)}
    </figure>
  </div>
</section>

${d.screens.length ? `<section class="sec" aria-label="Écrans">
  <div class="ed ed-grid">
    <span class="sec-label marginalia" aria-hidden="true">(Écrans)</span>
    <div class="sec-body proj-screens">${d.screens.map(renderScreen).join('')}
    </div>
  </div>
</section>` : ''}

<section class="sec" aria-labelledby="proj-about">
  <div class="ed ed-grid">
    <span class="sec-label marginalia" aria-hidden="true">(Projet)</span>
    <div class="sec-body">
      <h2 class="sec-title" id="proj-about">Le projet</h2>
        ${paragraphs}
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="proj-stack">
  <div class="ed ed-grid">
    <span class="sec-label marginalia" aria-hidden="true">(Stack)</span>
    <div class="sec-body">
      <h2 class="sec-title" id="proj-stack">Stack technique</h2>
      <ul class="tags proj-stack" role="list">${stack}</ul>
    </div>
  </div>
</section>`;
  }

  const api = {
    SERVICE_FILTERS, projects, getDetailProjects,
    countByService, projMedia,
    renderPortfolioHTML, renderPinsHTML,
    renderSiteWebPanelHTML, renderAppWebPanelHTML, renderSeoPanelHTML, renderFiltersHTML,
    renderProjectDetailBody,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else Object.assign(global, api);
})(typeof globalThis !== 'undefined' ? globalThis : this);