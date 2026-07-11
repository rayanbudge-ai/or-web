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
      subType: 'ecommerce',
      subTypeLabel: 'E-commerce',
      title: 'IznoGrillz',
      tags: ['E-commerce', 'Hero vidéo', 'Panier', 'JS Vanilla'],
      desc: "Bijouterie grillz sur mesure — hero vidéo plein écran, catalogue filtrable et panier persisté. Univers cyberpunk brutaliste.",
      accent: '#C9A84C',
      year: '2025',
      demo: true,
      previewUrl: 'projets/iznogrillz/index.html',
      siteUrl: 'iznogrillz.com',
      url: 'projets/iznogrillz.html',
      detail: {
        metaTitle: 'IznoGrillz — E-commerce sur mesure | Portfolio OR-Web',
        metaDesc: "Étude de cas IznoGrillz : e-commerce grillz custom or et argent, hero vidéo et panier intégré. Réalisé en HTML/CSS/JS vanilla par OR-Web.",
        label: 'E-commerce',
        heroTitle: 'IZNO<span class="gold">GRILLZ</span>',
        heroDesc: "Site vitrine & e-commerce pour un artisan bijoutier spécialisé dans la fabrication de grillz custom sur mesure — or 18k, argent 925, diamants VVS. Design Cyberpunk / Brutaliste avec effets glitch, hero vidéo plein écran et catalogue avec panier intégré.",
        client: 'IznoGrillz',
        category: 'E-commerce & Vitrine',
        duration: '4 semaines',
        demoPath: 'iznogrillz/index.html',
        heroMockupClass: 'proj-visual',
        screens: [
          { addr: 'iznogrillz.com/#shop',    src: 'iznogrillz/index.html#shop',    title: 'IznoGrillz — Boutique',   featured: true },
          { addr: 'iznogrillz.com/#process', src: 'iznogrillz/index.html#process', title: 'IznoGrillz — Processus' },
          { addr: 'iznogrillz.com/#contact', src: 'iznogrillz/index.html#contact', title: 'IznoGrillz — Contact' },
        ],
        paragraphs: [
          "IznoGrillz est un artisan bijoutier proposant des grillz entièrement sur mesure — pièces forgées à la main en or 18 carats, argent 925 ou sertis de diamants VVS. Le défi était de créer une identité digitale à la hauteur de l'univers underground et haut de gamme de la marque.",
          'Le design adopte une direction artistique <strong style="color:var(--white)">Cyberpunk / Brutaliste</strong> : fond noir profond, accents néon vert acide et violet électrique, effets glitch sur les titres, scanlines et bruit numérique en arrière-plan. L\'expérience est immersive sans jamais sacrifier la lisibilité.',
          "Le site intègre un hero vidéo plein écran, une section processus en 4 étapes, un catalogue produits avec système de panier persisté en localStorage, et un formulaire de contact. Entièrement responsive, sans framework.",
        ],
        stack: ['HTML5 Sémantique', 'CSS3 / Keyframes', 'JS Vanilla', 'Canvas API', 'Panier localStorage', 'Effets Glitch', 'Mobile-first', 'SEO optimisé'],
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
      accent: '#9b7fff',
      year: '2025',
      demo: true,
      previewUrl: 'projets/lhomme-invisible/index.html',
      siteUrl: 'lhomme-invisible-tattoo.fr',
      url: 'projets/lhomme-invisible.html',
      detail: {
        metaTitle: "L'Homme Invisible — Vitrine tatouage | Portfolio OR-Web",
        metaDesc: "Étude de cas L'Homme Invisible : vitrine tatouage à Bordeaux, galerie immersive et réservation en ligne. Réalisé en vanilla par OR-Web.",
        label: 'Vitrine',
        heroTitle: "L'HOMME <span class=\"gold\">INVISIBLE</span>",
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
          'Le design adopte une direction artistique <strong style="color:var(--white)">gothique / fine line</strong> : palette sombre, typographies sérifs élégantes, illustrations SVG artisanales. Un curseur personnalisé accompagne chaque interaction.',
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
      accent: '#d4a96a',
      year: '2025',
      demo: true,
      previewUrl: 'projets/casa-terra/index.html',
      siteUrl: 'casa-terra-bordeaux.fr',
      url: 'projets/casa-terra.html',
      detail: {
        metaTitle: 'Casa Terra — Vitrine premium | Portfolio OR-Web',
        metaDesc: "Étude de cas Casa Terra : vitrine premium pour un concept store bordelais. Design éditorial, marquee et animations fluides, en vanilla.",
        label: 'Vitrine',
        heroTitle: 'CASA <span class="gold">TERRA</span>',
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
          'Le design adopte une direction artistique <strong style="color:var(--white)">éditorialiste / voyage</strong> : textures de papier, typographies sérifs élégantes, palette chaude terracotta et crème. Un marquee animé, des transitions fluides et des animations au scroll créent une expérience premium.',
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
      accent: '#c9a84c',
      year: '2026',
      img: 'projets/img/voxline/dashboard.png',
      siteUrl: 'app.voxline.fr',
      url: 'projets/voxline.html',
      detail: {
        metaTitle: "Voxline — Application prospection centre d'appel | Portfolio OR-Web",
        metaDesc: "Étude de cas Voxline : application web de prospection B2B pour centre d'appel. Pipeline, fiches prospects, interactions et import CSV, en Node.js et PostgreSQL.",
        label: 'Application web',
        heroTitle: 'VOX<span class="gold">LINE</span>',
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
          "L'application propose un <strong style=\"color:var(--white)\">tableau de bord pipeline</strong> en 7 étapes, une liste prospects filtrable (secteur, statut site, recherche full-text), des fiches détaillées avec historique d'interactions et un module d'<strong style=\"color:var(--white)\">import CSV</strong> en deux temps : prévisualisation puis validation transactionnelle, sans écraser les données existantes.",
          "Côté technique : API REST Express, PostgreSQL, sessions persistées en base, authentification Argon2id et rôles admin / prospecteur. Interface vanilla dense et lisible, conçue pour des journées de prospection au téléphone.",
        ],
        stack: ['Node.js', 'Express', 'PostgreSQL', 'Sessions sécurisées', 'Argon2id', 'Import CSV', 'Vanilla JS', 'Rôles & permissions'],
      },
    },

    {
      id: 'or-web-perf',
      service: 'seo',
      subTypeLabel: 'SEO & Performance',
      title: 'OR-Web',
      tags: ['PageSpeed 100', 'Core Web Vitals', 'esbuild', 'Accessibilité AA'],
      desc: "Refonte technique d'or-web.fr : score mobile 77 → 100/100 sur PageSpeed Insights. Build esbuild, polices self-hostées, zéro blocage.",
      accent: '#C6FF3D',
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
  function projMedia(p) {
    if (p.previewUrl)
      return `<div class="pin-viewport"><iframe src="${p.previewUrl}" loading="lazy" scrolling="no" tabindex="-1" title="Aperçu live — ${p.title}"></iframe></div>`;
    if (p.img)
      return `<img class="pin-img" src="${p.img}" alt="Aperçu — ${p.title}" loading="lazy">`;
    return '';
  }

  function renderBadge(p) {
    if (p.badge) return `<span class="pin-badge">${p.badge}</span>`;
    if (p.demo) return `<span class="pin-badge">live</span>`;
    return '';
  }

  function renderProjectCard(p, i) {
    if (p.upcoming) {
      return `
      <li class="port-card port-card-soon reveal" style="--accent:${p.accent}">
        <article class="port-card-inner">
          <div class="port-card-body">
            <div class="port-card-meta">
              <span class="port-card-tag">${p.subTypeLabel}</span>
              <span class="port-card-year">${p.year}</span>
            </div>
            <h2 class="port-card-title">${p.title}</h2>
            <p class="port-card-desc">${p.desc}</p>
            <span class="port-soon-badge">Bientôt</span>
            <span class="soon-dots" aria-hidden="true">◦ ◦ ◦</span>
          </div>
        </article>
      </li>`;
    }

    const num = String(i + 1).padStart(2, '0');
    const tags = p.tags.map(t => `<li>${t}</li>`).join('');
    return `
    <li class="port-card reveal" style="--accent:${p.accent}">
      <a class="port-card-link" href="${p.url}">
        <article class="port-card-inner">
          <figure class="port-card-media pin-media">
            <div class="pin-bar">
              <span class="pbd r"></span><span class="pbd y"></span><span class="pbd g"></span>
              <span class="pin-url">${p.siteUrl || ''}</span>
              ${renderBadge(p)}
            </div>
            ${projMedia(p)}
          </figure>
          <div class="port-card-body">
            <span class="port-card-num" aria-hidden="true">${num}</span>
            <h2 class="port-card-title">${p.title}</h2>
            <p class="port-card-desc">${p.desc}</p>
            <div class="port-card-meta">
              <span class="port-card-tag">${p.subTypeLabel}</span>
              <span class="port-card-year">${p.year}</span>
            </div>
            <ul class="pin-tags port-card-tags">${tags}</ul>
            <span class="pin-cta">Voir le projet <span aria-hidden="true">→</span></span>
          </div>
        </article>
      </a>
    </li>`;
  }

  function renderPanelHTML(serviceId, { active = false } = {}) {
    const items = projects.filter(p => p.service === serviceId);
    const live = items.filter(p => !p.upcoming);
    const cards = items.map(p => {
      const idx = live.indexOf(p);
      return renderProjectCard(p, idx >= 0 ? idx : live.length);
    }).join('');

    const activeClass = active ? ' port-panel-on' : '';
    const hidden = active ? '' : ' hidden';

    return `
    <div class="port-panel${activeClass}" id="panel-${serviceId}" role="tabpanel" aria-labelledby="tab-${serviceId}"${hidden}>
      <ul class="port-grid ed" role="list">${cards}</ul>
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
      <button type="button" class="port-tab${selected ? ' port-tab-on' : ''}"
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
    <div class="port-filters-wrap ed">
      <span class="port-filter-eyebrow marginalia" aria-hidden="true">(Filtrer par service)</span>
      <div class="port-tabs" role="tablist" aria-label="Filtrer les réalisations par service">${tabs}</div>
      <a class="port-service-link" id="port-service-link" href="${SERVICE_FILTERS[0].serviceUrl}" data-label="Voir notre offre">Voir notre offre <span aria-hidden="true">→</span></a>
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

  /* ── TEMPLATE page étude de cas (corps — build-pages assemble le document) ── */
  function renderProjectDetailBody(p) {
    const d = p.detail;
    const demoTag = p.demo ? ' <span class="demo-tag">Démo</span>' : '';
    const demoBtn = d.demoPath
      ? `<a href="${d.demoPath}" target="_blank" rel="noopener" class="btn btn-primary">Voir le site démo →</a>`
      : '';
    const heroWrapClass = d.heroMockupClass
      ? `${d.heroMockupClass} browser-mockup`
      : 'browser-mockup';

    function renderScreen(s) {
      const media = s.img
        ? `<img src="${assetUrl(s.img)}" alt="${s.title}" loading="lazy">`
        : `<iframe src="${assetUrl(s.src)}" title="${s.title}" loading="lazy"></iframe>`;
      return `
    <div class="proj-screen${s.featured ? ' featured' : ''} browser-mockup">
      <div class="browser-bar">
        <div class="browser-dots"><span class="b-dot r"></span><span class="b-dot y"></span><span class="b-dot g"></span></div>
        <div class="browser-addr">${s.addr}</div>
      </div>
      <div class="browser-frame${s.img ? ' browser-frame-img' : ''}">
        ${media}
      </div>
    </div>`;
    }

    const screens = d.screens.map(renderScreen).join('');
    const heroMedia = d.heroImg
      ? `<img src="${assetUrl(d.heroImg)}" alt="Aperçu — ${p.title}" loading="lazy">`
      : `<iframe src="${assetUrl(d.demoPath)}" title="${p.title}" loading="lazy"></iframe>`;
    const heroFrameClass = d.heroImg ? ' browser-frame-img' : '';

    const paragraphs = d.paragraphs.map(para => `<p>${para}</p>`).join('\n      ');
    const stack = d.stack.map(t => `<span class="proj-tag-item">${t}</span>`).join('\n        ');

    return `
  <a class="back-link" href="/portfolio">← Retour au portfolio</a>

  <div class="proj-hero">
    <div>
      <div class="proj-hero-label"><span class="gold-line"></span>${d.label}${demoTag}</div>
      <h1>${d.heroTitle}</h1>
      <p class="proj-hero-desc">${d.heroDesc}</p>
      <div class="proj-hero-actions">
        ${demoBtn}
        <a href="/portfolio" class="btn btn-outline">← Retour au portfolio</a>
      </div>
      <div class="proj-meta-list">
        <div class="proj-meta-item"><span>Client</span>    <span>${d.client}</span></div>
        <div class="proj-meta-item"><span>Catégorie</span> <span>${d.category}</span></div>
        <div class="proj-meta-item"><span>Année</span>     <span>${p.year}</span></div>
        <div class="proj-meta-item"><span>Durée</span>     <span>${d.duration}</span></div>
      </div>
    </div>
    <div class="${heroWrapClass}">
      <div class="browser-bar">
        <div class="browser-dots"><span class="b-dot r"></span><span class="b-dot y"></span><span class="b-dot g"></span></div>
        <div class="browser-addr">${p.siteUrl}</div>
      </div>
      <div class="browser-frame${heroFrameClass}">
        ${heroMedia}
      </div>
    </div>
  </div>

  <div class="proj-screens">${screens}</div>

  <div class="proj-body">
    <div>
      <h2>Le <span class="gold">projet</span></h2>
      ${paragraphs}
    </div>
    <div>
      <h2>Stack <span class="gold">technique</span></h2>
      <div class="proj-tags-section">
        ${stack}
      </div>
    </div>
  </div>

  <div class="proj-footer-cta">
    <h2>Un projet <span class="gold">similaire ?</span></h2>
    <p>Parlons-en lors d'un premier appel gratuit de 30 minutes.</p>
    <a href="/contact" class="btn btn-primary">
      <span class="bicon" aria-hidden="true">$</span> Demander un devis gratuit <span class="bicon" aria-hidden="true">→</span>
    </a>
  </div>`;
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