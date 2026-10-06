/* ── NAVIGATION (AE — pages servies par route, rechargement complet) ──
   Le serveur injecte les meta SEO par URL (server.js). Ce script ne fait
   qu'afficher la bonne section au chargement et gérer la navbar.
   Les liens du site sont de vrais href (/portfolio, /contact…) : pas de
   pushState ni de bascule client sans rechargement. */

const VALID_PAGES = ['home', 'portfolio', 'contact'];

function pageFromUrl() {
  const fromPath = location.pathname.replace(/\//g, '').trim() || 'home';
  if (VALID_PAGES.includes(fromPath)) return fromPath;
  return 'home';
}

/* Affiche la section correspondant à la route courante. */
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const section = document.getElementById('page-' + page);
  if (section) section.classList.add('active');

  // Sur l'accueil, l'item actif est celui du panneau ouvert (voir plus bas)
  // Seul Portfolio est une page du header ; Contact ouvre le panneau /#contact,
  // il n'est donc pas « actif » sur la page /contact (formulaire).
  setActiveNav(page === 'portfolio' ? 'nl-portfolio' : null);

  // Le reveal au scroll de la page active démarre dans js/reveal.js (après ce
  // fichier dans le bundle : la page active est déjà posée).
  const main = document.getElementById('main-content');
  if (main) {
    main.setAttribute('tabindex', '-1');
    requestAnimationFrame(() => main.focus({ preventScroll: true }));
  }
}

/* Ancien lien hash #portfolio → URL canonique. (#contact n'est plus redirigé :
   sur l'accueil, il ouvre le panneau Contact — js/accueil.js.) */
(function redirectLegacyHash() {
  if (location.pathname === '/' && location.hash === '#portfolio') location.replace('/portfolio');
})();

/* Item de nav actif (souligné lime) + aria-current */
function setActiveNav(id) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    const on = a.id === id;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', a.id === 'nl-portfolio' ? 'page' : 'true');
    else a.removeAttribute('aria-current');
  });
}

showPage(pageFromUrl());

/* ── HEADER ↔ PANNEAUX (js/accueil.js) ──
   Panneau ouvert : item actif, bouton « Fermer » visible (son clic et Échap
   sont gérés par accueil.js). */
document.addEventListener('panel:change', e => {
  const id = e.detail.id;
  document.body.classList.toggle('has-panel', !!id);
  setActiveNav(id ? 'nl-' + id : null);
  const close = document.getElementById('navClose');
  if (close) {
    close.hidden = !id;
    if (id) close.setAttribute('aria-controls', id); else close.removeAttribute('aria-controls');
  }
});

/* ── NAVBAR SCROLL ── */
window.addEventListener('scroll', () => {
  const bar = document.getElementById('navbar');
  if (bar) bar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });
