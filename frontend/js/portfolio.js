/* ── PORTFOLIO — interactivité (les données + templates sont dans
      portfolio-data.js, partagé avec le serveur pour le rendu SEO). ──

   Hydratation : si le serveur a déjà rendu le HTML (#port-catalog non vide),
   on ne ré-injecte pas — on attache juste les comportements. Sinon (dev sans
   serveur, ou si le SSR échoue), on rend côté client. */

const PORT_HASHES = { 'site-web': 'site-web', 'app-web': 'app-web', seo: 'seo' };

const SERVICE_LINKS = {
  'site-web': { href: '/services/creation-site-vitrine-bordeaux', label: 'site vitrine' },
  'app-web':  { href: '/services/developpement-application-web-bordeaux', label: 'application web' },
  seo:        { href: '/services/optimisation-seo-performance-bordeaux', label: 'SEO & performance' },
};

function renderPortfolio() {
  const wrap = document.getElementById('port-catalog');
  if (!wrap) return;
  if (!wrap.querySelector('.port-catalog')) wrap.innerHTML = renderPortfolioHTML();
  initPortfolioFilters();
  setTimeout(() => {
    triggerReveal();
    scalePinIframes();
  }, 50);
}
renderPortfolio();

/* ── FILTRES PAR SERVICE (onglets + deep link #site-web / #seo) ── */
function initPortfolioFilters() {
  const catalog = document.querySelector('.port-catalog');
  if (!catalog || catalog.dataset.filtersReady) return;
  catalog.dataset.filtersReady = '1';

  const tabs = catalog.querySelectorAll('.port-tab');
  const panels = catalog.querySelectorAll('.port-panel');

  function activate(serviceId, { updateHash = true } = {}) {
    tabs.forEach(tab => {
      const on = tab.dataset.service === serviceId;
      tab.classList.toggle('port-tab-on', on);
      tab.setAttribute('aria-selected', String(on));
    });
    panels.forEach(panel => {
      const on = panel.id === `panel-${serviceId}`;
      panel.classList.toggle('port-panel-on', on);
      panel.hidden = !on;
    });

    const link = catalog.querySelector('#port-service-link');
    const svc = SERVICE_LINKS[serviceId] || SERVICE_LINKS['site-web'];
    if (link) {
      link.href = svc.href;
      link.innerHTML = `Voir notre offre ${svc.label} <span aria-hidden="true">→</span>`;
    }

    if (updateHash) {
      const hash = PORT_HASHES[serviceId] || 'site-web';
      const base = `${location.pathname}${location.search}`;
      history.replaceState(null, '', `${base}#${hash}`);
    }

    setTimeout(() => {
      triggerReveal();
      scalePinIframes();
    }, 30);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab.dataset.service));
  });

  const fromHash = (location.hash || '').replace('#', '').trim();
  if (PORT_HASHES[fromHash]) activate(fromHash, { updateHash: false });
  else activate('site-web', { updateHash: false });

  window.addEventListener('hashchange', () => {
    const h = (location.hash || '').replace('#', '').trim();
    if (PORT_HASHES[h]) activate(h, { updateHash: false });
  });
}

/* ── SCALING DES IFRAMES LIVE (rendu 1440px mis à l'échelle du conteneur) ── */
function scalePinIframes() {
  document.querySelectorAll('.pin-viewport').forEach(vp => {
    const iframe = vp.querySelector('iframe');
    if (!iframe) return;
    const scale = vp.clientWidth / 1440;
    iframe.style.transform = `scale(${scale})`;
    vp.style.height = (900 * scale) + 'px';
  });
}
setTimeout(scalePinIframes, 0);
window.addEventListener('resize', scalePinIframes);