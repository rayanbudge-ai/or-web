/* ── ACCUEIL — machine à états intro → home → panel ──
   L'étape courante est portée par html[data-stage] (posé avant le premier
   rendu par le script de tête de index.html, puis piloté ici). Le CSS décrit
   les états de repos ; les transitions sont des timelines nommées, jouées
   avec l'API Web Animations (aucune dépendance) et limitées à transform,
   opacity et clip-path. Pendant une transition, html[data-anim] est posé et
   tout clic de navigation est ignoré.

   Historique : pas de hash = intro ou home (history.state.stage) ; #services,
   #methode, #contact = panneau. Le bouton retour remonte d'un cran :
   panel → home → intro. */
(function () {
  'use strict';
  const root = document.documentElement;
  const home = document.getElementById('page-home');
  if (!home || !home.classList.contains('active') || !root.dataset.stage) return;

  // Moteur de timelines et effets d'entrée partagés : js/reveal.js
  const { play, fade, rise, titleSteps, itemSteps, reduce } = window.OrReveal;
  const $ = sel => home.querySelector(sel);
  const el = {
    hero: $('.hero'),
    title: $('.hero-title'),
    enter: document.getElementById('introEnter'),
    hint: $('.intro-hint'),
    veil: $('.veil'),
    bright: $('.stage-bright'),
    place: $('.hero-place'),
    sub: $('.hero-sub'),
    bar: document.querySelector('.home-bar'),   // commune à toutes les pages
    navbar: document.getElementById('navbar'),
    nav: document.querySelector('#navbar .nav-links'),
    logo: document.querySelector('#navbar .logo'),
    close: document.getElementById('navClose'),
  };
  const panels = {};
  home.querySelectorAll('[data-panel]').forEach(p => { panels[p.id] = p; });
  const PANEL_HASH = /^#(services|methode|contact)$/;

  /* ── ÉTAT ── */
  let stage = root.dataset.stage;              // 'intro' | 'home' | 'panel'
  let current = null;                          // panneau ouvert
  let busy = false;
  let pendingSync = false;

  function setStage(s) {
    stage = s;
    root.dataset.stage = s;
    // Derrière un dialogue ouvert, la vue d'accueil sort de l'arbre et de la tabulation
    el.hero.inert = s === 'panel';
    document.dispatchEvent(new CustomEvent('panel:change', { detail: { id: s === 'panel' && current ? current.id : null } }));
  }

  /* Joue une timeline. L'étape cible (état de repos du CSS) est posée dès le
     départ ; les animations (fill both) en masquent l'effet jusqu'à leur fin,
     puis sont annulées dans la même frame : le CSS prend le relais sur des
     valeurs identiques. before/after : bascules de classes autour du jeu. */
  function run(target, steps, opts) {
    opts = opts || {};
    busy = true;
    root.dataset.anim = '';
    if (opts.before) opts.before();
    setStage(target);
    return play(steps, opts).then(anims => {
      if (opts.after) opts.after();
      delete root.dataset.anim;
      anims.forEach(a => a.cancel());
      busy = false;
      if (opts.focus) opts.focus();
      if (pendingSync) { pendingSync = false; sync(); }
    });
  }

  /* ── TIMELINES NOMMÉES ── */
  const EASE_IN_OUT = 'cubic-bezier(.77, 0, .18, 1)';
  const EASE_OUT_TITLE = 'cubic-bezier(.55, 0, .75, .2)';
  const cards = () => Array.from(home.querySelectorAll('.home-cards > li'));

  /* Rayon qui couvre l'écran depuis (x, y) : distance au coin le plus loin */
  const coverRadius = (x, y) => Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))) + 2;
  const centerOf = node => { const r = node.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

  /* clip-path qui épouse un élément : son rectangle et ses coins arrondis */
  function insetOf(node) {
    const r = node.getBoundingClientRect();
    const radius = parseFloat(getComputedStyle(node).borderTopLeftRadius) || 0;
    const px = v => Math.round(v * 10) / 10 + 'px';
    return `inset(${px(r.top)} ${px(innerWidth - r.right)} ${px(innerHeight - r.bottom)} ${px(r.left)} round ${px(radius)})`;
  }
  const cardOf = id => home.querySelector(`.hc-link[href="/#${id}"]`);

  const TIMELINES = {
    /* intro → home, ~1,45 s. Rejouée à l'envers par leave().
       1. le cercle révèle la couche non assombrie depuis le point de clic
       2. en même temps, le titre part vers le haut et s'efface
       3. le voile sombre s'efface sous le cercle
       4. label + paragraphe montent  5. cartes en cascade  6. header, pied */
    enter(origin) {
      const o = origin || centerOf(el.title);
      const r = coverRadius(o.x, o.y);
      const out = -Math.ceil(el.title.getBoundingClientRect().bottom + 40);   // hors écran
      if (reduce.matches) {
        return [
          { el: el.title, kf: fade(1, 0), at: 0, dur: 250 },
          { el: el.hint, kf: fade(1, 0), at: 0, dur: 250 },
          { el: el.veil, kf: fade(.6, 0), at: 0, dur: 300 },
          { el: el.logo, kf: fade(.55, 1), at: 0, dur: 300 },
          ...[el.place, el.sub, ...cards(), el.nav, el.bar].map(n => ({ el: n, kf: fade(0, 1), at: 150, dur: 300 })),
        ];
      }
      return [
        { el: el.bright, at: 0, dur: 900, ease: EASE_IN_OUT,
          kf: [{ clipPath: `circle(0px at ${o.x}px ${o.y}px)` }, { clipPath: `circle(${r}px at ${o.x}px ${o.y}px)` }] },
        { el: el.title, at: 0, dur: 750, ease: EASE_OUT_TITLE,
          kf: [{ transform: 'none', opacity: 1 }, { opacity: 1, offset: .3 }, { transform: `translateY(${out}px)`, opacity: 0 }] },
        { el: el.hint, kf: fade(1, 0), at: 0, dur: 250 },
        { el: el.veil, kf: fade(.6, 0), at: 450, dur: 550, ease: 'ease-out' },
        { el: el.logo, kf: fade(.55, 1), at: 450, dur: 550 },
        { el: el.place, kf: rise('1.5rem'), at: 650, dur: 550 },
        { el: el.sub, kf: rise('2rem'), at: 720, dur: 600 },
        ...cards().map((c, i) => ({ el: c, kf: rise('2.5rem'), at: 820 + i * 80, dur: 520 })),
        { el: el.nav, kf: fade(0, 1), at: 1050, dur: 400 },
        { el: el.bar, kf: rise('8px'), at: 1050, dur: 400 },
      ];
    },

    /* arrivée directe sur home (lien interne, rechargement) : sans intro */
    arrive() {
      return [
        { el: el.place, kf: rise('1.5rem'), at: 0, dur: 550 },
        { el: el.sub, kf: rise('2rem'), at: 70, dur: 600 },
        ...cards().map((c, i) => ({ el: c, kf: rise('2.5rem'), at: 170 + i * 80, dur: 520 })),
        { el: el.bar, kf: fade(0, 1), at: 400, dur: 400 },
      ];
    },

    /* home → panel, ~1,1 s. Rejouée à l'envers à la fermeture.
       1. le panneau sort du rectangle de la carte (coins arrondis compris)
          et recouvre l'écran  2. la teinte du panneau apparaît
       3. le titre monte ligne par ligne derrière son masque
       4. le contenu arrive en cascade ; le pied reste visible au-dessus */
    openPanel(panel, from) {
      const tint = panel.querySelector('.panel-tint');
      const items = Array.from(panel.querySelectorAll('.pn'));
      if (reduce.matches) {
        return [
          { el: panel, kf: fade(0, 1), at: 0, dur: 250, ease: 'ease' },
          { el: tint, kf: fade(1, 1), at: 0, dur: 250 },
          ...items.map(n => ({ el: n, kf: fade(1, 1), at: 0, dur: 250 })),
        ];
      }
      return [
        { el: panel, at: 0, dur: 650, ease: EASE_IN_OUT,
          kf: [{ clipPath: from ? insetOf(from) : 'inset(50% 50% 50% 50% round 14px)' },
               { clipPath: 'inset(0px 0px 0px 0px round 0px)' }] },
        { el: tint, kf: fade(0, 1), at: 300, dur: 450, ease: 'ease-out' },
        // Effets d'entrée partagés avec les pages internes (js/reveal.js)
        ...titleSteps(panel.querySelector('.panel-title'), 420),
        ...itemSteps(items, 480),
      ];
    },
  };

  /* ── TRANSITIONS ── */
  /* Toutes les transitions refusent de démarrer pendant une autre : un
     clic (ou un appel) pendant une timeline est ignoré. */
  const idle = () => Promise.resolve();

  function enter(opts) {
    if (busy || stage !== 'intro') return idle();
    opts = opts || {};
    if (opts.history !== false) history.pushState({ stage: 'home', pushed: true }, '', location.pathname + location.search);
    resetParallax();
    // Focus sur la première carte, quel que soit le déclencheur (clic, retour/suivant)
    return run('home', TIMELINES.enter(opts.origin), {
      // Le slogan reste affiché pendant sa sortie vers le haut (home.css, .intro)
      before() { root.dataset.anim = 'intro'; },
      focus() { const c = cardOf('services'); if (c) c.focus({ preventScroll: true }); },
    });
  }

  function leave(opts) {
    if (busy || stage !== 'home') return idle();
    opts = opts || {};
    if (opts.history !== false) {
      // Entrée d'historique créée par enter() : on recule (le retour arrière
      // et le logo font la même chose). Sinon on remplace l'état.
      if (history.state && history.state.pushed) history.back();
      else history.replaceState(null, '', location.pathname + location.search);
    }
    // Le cercle se referme vers le logo (l'élément cliqué), le titre redescend
    const origin = opts.origin || (el.logo ? centerOf(el.logo) : null);
    return run('intro', TIMELINES.enter(origin), {
      reverse: true, rate: 1.15,
      focus() { el.enter.focus({ preventScroll: true }); },
    });
  }

  /* home → panel, ou panel → panel (bascule directe, sans repasser par home) */
  function openPanel(id, opts) {
    opts = opts || {};
    const next = panels[id];
    if (busy || stage === 'intro' || !next || next === current) return idle();
    const prev = current;
    const from = opts.from || cardOf(id);
    current = next;

    if (opts.history !== false) {
      const url = `${location.pathname}${location.search}#${id}`;
      if (prev) history.replaceState({ stage: 'panel', panel: id, pushed: !!(history.state && history.state.pushed) }, '', url);
      else history.pushState({ stage: 'panel', panel: id, pushed: true }, '', url);
    }
    return run('panel', TIMELINES.openPanel(next, from), {
      before() {
        if (prev) { prev.classList.remove('is-front'); prev.classList.add('is-back'); }
        next.classList.add('is-open', 'is-front');
      },
      after() {
        // L'ancien panneau, entièrement recouvert, se retire
        if (prev) prev.classList.remove('is-open', 'is-back');
      },
      focus() { next.focus({ preventScroll: true }); },
    });
  }

  /* panel → home : la timeline d'ouverture à l'envers, jusqu'à la carte du
     panneau ; le focus revient sur cette carte. */
  function closePanel(opts) {
    opts = opts || {};
    const panel = current;
    if (busy || !panel) return idle();
    if (opts.history !== false) {
      if (history.state && history.state.pushed) history.back();
      else history.replaceState({ stage: 'home' }, '', location.pathname + location.search);
    }
    const card = cardOf(panel.id);
    return run('home', TIMELINES.openPanel(panel, card), {
      reverse: true, rate: 1.25,
      after() { panel.classList.remove('is-open', 'is-front'); current = null; },
      focus() { if (card) card.focus({ preventScroll: true }); },
    });
  }

  /* ── ÉTAPE VOULUE PAR L'URL ET L'HISTORIQUE ── */
  function wanted() {
    if (PANEL_HASH.test(location.hash)) return { stage: 'panel', id: location.hash.slice(1) };
    const s = history.state;
    return { stage: s && (s.stage === 'home' || s.stage === 'panel') ? 'home' : 'intro' };
  }

  /* Rejoint l'étape voulue, un cran à la fois (retour/suivant, hash tapé) */
  function sync() {
    if (busy) { pendingSync = true; return; }
    const w = wanted();
    const again = () => sync();
    if (w.stage === 'panel') {
      if (stage === 'intro') { setStage('home'); resetParallax(); }   // on saute l'intro
      if (!current || current.id !== w.id) openPanel(w.id, { history: false });
    } else if (stage === 'panel') {
      closePanel({ history: false }).then(again);
    } else if (w.stage === 'home' && stage === 'intro') {
      enter({ history: false });
    } else if (w.stage === 'intro' && stage === 'home') {
      leave({ history: false });
    }
  }
  window.addEventListener('popstate', sync);

  /* ── DÉCLENCHEURS ── */
  el.enter.addEventListener('click', e => {
    if (busy || stage !== 'intro') return;
    // Clavier (detail 0) : origine au centre du titre
    const origin = e.detail === 0 ? centerOf(el.title) : { x: e.clientX, y: e.clientY };
    enter({ origin });
  });

  // Logo : depuis home, rejoue l'intro ; depuis un panneau, ramène à home
  if (el.logo) el.logo.addEventListener('click', e => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (busy) return;
    if (stage === 'home') leave();
    else if (stage === 'panel') closePanel();
  });

  // Tout lien /#id d'un panneau (cartes, lien Contact, liens internes aux panneaux)
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const m = a.getAttribute('href').match(/^\/?#([\w-]+)$/);
    if (!m || !panels[m[1]]) return;
    e.preventDefault();
    if (busy || stage === 'intro') return;
    openPanel(m[1], { from: a });
  });

  if (el.close) el.close.addEventListener('click', () => { if (!busy) closePanel(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && stage === 'panel' && !busy) closePanel();
  });

  /* Piège de focus (étape panel) : Tab circule entre la navbar (au-dessus du
     dialogue), le panneau ouvert et la barre de pied. */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  const visible = node => !!node && !node.closest('[inert]') &&
    (node.checkVisibility ? node.checkVisibility({ visibilityProperty: true }) : node.getClientRects().length > 0);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || stage !== 'panel' || !current) return;
    const items = [el.navbar, current, el.bar].filter(Boolean)
      .flatMap(z => Array.from(z.querySelectorAll(FOCUSABLE))).filter(visible);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    const i = items.indexOf(document.activeElement);
    if (i === -1) {
      // Focus sur le dialogue lui-même (à l'ouverture) : Tab natif → 1er lien du panneau
      if (current.contains(document.activeElement) && !e.shiftKey) return;
      e.preventDefault(); (e.shiftKey ? last : first).focus();
    } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  });

  /* ── PARALLAXE DU TITRE (intro, souris uniquement) ──
     Quelques pixels, lissés (interpolation à chaque frame), la 2e ligne un
     peu plus que la 1re pour un léger effet de profondeur. transform seul ;
     la boucle s'arrête dès que le titre est au repos. */
  const lines = el.title.querySelectorAll('.ht-line');
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  function tick() {
    cx += (tx - cx) * .08;
    cy += (ty - cy) * .08;
    lines.forEach((l, i) => {
      const k = i ? 1.6 : 1;
      l.style.transform = `translate3d(${(cx * 8 * k).toFixed(2)}px, ${(cy * 5 * k).toFixed(2)}px, 0)`;
    });
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .0005 ? requestAnimationFrame(tick) : 0;
  }
  function resetParallax() {
    tx = ty = cx = cy = 0;
    cancelAnimationFrame(raf); raf = 0;
    lines.forEach(l => { l.style.transform = ''; });
  }
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', e => {
      if (stage !== 'intro' || busy || reduce.matches) return;
      tx = e.clientX / innerWidth - .5;
      ty = e.clientY / innerHeight - .5;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  /* ── DÉMARRAGE ── */
  const w0 = wanted();
  if (w0.stage === 'panel') {
    // Lien direct /#panneau : on insère une entrée « home » dessous, pour que
    // le retour arrière remonte d'un cran au lieu de quitter le site.
    history.replaceState({ stage: 'home' }, '', location.pathname + location.search);
    history.pushState({ stage: 'panel', panel: w0.id, pushed: true }, '', location.pathname + location.search + '#' + w0.id);
    // Contenu affiché tout de suite, sans timeline : l'animation depuis la
    // carte n'a de sens qu'après un clic (au chargement, elle laissait le
    // panneau vide le temps que la page se stabilise).
    const panel = panels[w0.id];
    current = panel;
    run('panel', [], {
      before() { panel.classList.add('is-open', 'is-front'); },
      focus() { panel.focus({ preventScroll: true }); },
    });
  } else if (stage === 'home') {
    // Arrivée par un lien interne ou rechargement : l'entrée devient « home »
    if (!history.state) history.replaceState({ stage: 'home' }, '', location.href);
    run('home', TIMELINES.arrive());
  }

  window.OrAccueil = {
    stage: () => stage, busy: () => busy, current: () => current,
    enter, leave, openPanel, closePanel,
  };
})();
