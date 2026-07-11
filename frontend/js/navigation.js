/* ── NAVIGATION (AE — pages servies par route, rechargement complet) ──
   Le serveur injecte les meta SEO par URL (server.js). Ce script ne fait
   qu'afficher la bonne section au chargement et gérer la navbar / reveals.
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

  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const nl = document.getElementById('nl-' + page);
  if (nl) nl.classList.add('active');

  const main = document.getElementById('main-content');
  if (main) {
    main.setAttribute('tabindex', '-1');
    requestAnimationFrame(() => {
      main.focus({ preventScroll: true });
      triggerReveal();
    });
  } else {
    triggerReveal();
  }
}

/* Anciens liens hash (#portfolio, #contact) → URL canonique. */
(function redirectLegacyHash() {
  const h = (location.hash || '').replace('#', '').trim();
  if (!VALID_PAGES.includes(h) || h === 'home') return;
  location.replace('/' + h);
})();

showPage(pageFromUrl());

/* ── NAVBAR SCROLL ── */
window.addEventListener('scroll', () => {
  const bar = document.getElementById('navbar');
  if (bar) bar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── BURGER ── */
function toggleMenu() {
  const burger  = document.getElementById('burger');
  const mobMenu = document.getElementById('mobMenu');
  if (!burger || !mobMenu) return;
  const isOpen  = burger.classList.toggle('open');
  mobMenu.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  mobMenu.setAttribute('aria-hidden', String(!isOpen));
  mobMenu.inert = !isOpen;
}