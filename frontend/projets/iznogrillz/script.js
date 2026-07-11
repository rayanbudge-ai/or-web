/* ═══════════════════════════════════════════════════
   IZNOGRAILLZ — script.js
   Vanilla JS : catalogue, panier, bruit, révélation
═══════════════════════════════════════════════════ */

'use strict';

/* ── CATALOGUE PRODUITS ── */
const PRODUCTS = [
  {
    id: 1,
    name: 'TOP 8 — OR 18K',
    desc: 'Huit dents du haut en or 18 carats. Finition polie miroir. Ajustement parfait sur empreinte dentaire.',
    price: 1200,
    badge: 'OR 18K',
    badgeClass: 'badge-gold',
    img: '../img/iznogrillz/1.png',
    alt: 'Grillz top 8 en or 18k — IznoGrillz',
  },
  {
    id: 2,
    name: 'BOTTOM 8 — ARGENT 925',
    desc: "Huit dents du bas en argent 925. Finition rhodium anti-ternissement. Confort et éclat longue durée.",
    price: 450,
    badge: 'ARGENT 925',
    badgeClass: 'badge-silver',
    img: '../img/iznogrillz/3.png',
    alt: 'Grillz bottom 8 en argent 925 — IznoGrillz',
  },
  {
    id: 3,
    name: 'FULL SET — VVS DIAMANTS',
    desc: 'Set complet haut et bas, sertis de diamants VVS à la main. La pièce ultime — éclat garanti sous tous les feux.',
    price: 4500,
    badge: 'VVS DIAMONDS',
    badgeClass: 'badge-vvs',
    img: '../img/iznogrillz/4.png',
    alt: 'Full set grillz diamants VVS — IznoGrillz',
  },
  {
    id: 4,
    name: 'CUSTOM OR + DIAMANTS',
    desc: "Design 100% sur mesure. Or 18k avec sertissage diamants et pierres de couleur selon ta vision artistique.",
    price: 2800,
    badge: 'CUSTOM',
    badgeClass: 'badge-gold',
    img: '../img/iznogrillz/5.png',
    alt: 'Grillz custom or et diamants — IznoGrillz',
  },
];

/* ── ÉTAT DU PANIER ── */
let cart = JSON.parse(localStorage.getItem('izno_cart') || '[]');

/* ─────────────────────────────────────────────────
   RENDU DU CATALOGUE
───────────────────────────────────────────────── */
function renderProducts() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card reveal" data-id="${p.id}">
      <div class="product-img">
        <span class="product-badge ${p.badgeClass}">${p.badge}</span>
        <img src="${p.img}" alt="${p.alt}" loading="lazy" width="600" height="450"/>
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <div class="product-price">
            À partir de ${fmt(p.price)}
            <span class="product-price-note">Devis définitif sur empreinte</span>
          </div>
          <button class="add-btn" data-id="${p.id}" aria-label="Ajouter ${p.name} au panier">
            + AJOUTER
          </button>
        </div>
      </div>
    </article>
  `).join('');

  /* Délégation d'événements sur la grille */
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    addToCart(Number(btn.dataset.id));
    flashBtn(btn);
  });

  observeReveal();
}

function fmt(n) {
  return n.toLocaleString('fr-FR') + ' €';
}

/* ─────────────────────────────────────────────────
   PANIER
───────────────────────────────────────────────── */
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }

  persistCart();
  renderCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  persistCart();
  renderCart();
}

function persistCart() {
  try { localStorage.setItem('izno_cart', JSON.stringify(cart)); } catch (_) {}
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = count;

  const itemsEl  = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Ton panier est vide.</p>';
    footerEl.style.display = 'none';
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <div class="cart-item-name">${item.name}</div>
        ${item.qty > 1 ? `<div class="cart-item-qty">×${item.qty}</div>` : ''}
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">${fmt(item.price * item.qty)}</span>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Retirer ${item.name}">
          ✕ retirer
        </button>
      </div>
    </div>
  `).join('');

  /* Délégation pour les boutons "retirer" */
  itemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
  });

  document.getElementById('cartTotal').textContent = fmt(total);
  footerEl.style.display = 'block';
}

function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

/* Flash visuel sur le bouton "ajouter" */
function flashBtn(btn) {
  btn.textContent = '✓ AJOUTÉ';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = '+ AJOUTER';
    btn.classList.remove('added');
  }, 1400);
}

/* Flash sur l'icône panier dans la nav */
function flashCartIcon() {
  const btn = document.getElementById('cartBtn');
  btn.style.borderColor = 'var(--green)';
  btn.style.boxShadow   = '0 0 20px rgba(0,255,65,.4)';
  setTimeout(() => {
    btn.style.borderColor = '';
    btn.style.boxShadow   = '';
  }, 600);
}

/* ─────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 55);
  }, { passive: true });

  /* Burger mobile */
  const burger = document.getElementById('burger');
  const mobNav = document.getElementById('mobNav');

  burger.addEventListener('click', () => {
    const open = mobNav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });

  /* Ferme le menu mobile sur clic lien */
  mobNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobNav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* Ferme le panier en cliquant sur le lien "Finaliser" */
  document.getElementById('cartOrderBtn')?.addEventListener('click', closeCart);
}

/* ─────────────────────────────────────────────────
   REVEAL AU SCROLL
───────────────────────────────────────────────── */
function observeReveal() {
  const els = document.querySelectorAll('.reveal:not([data-observed])');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    });
  }, { threshold: 0.12 });

  els.forEach(el => {
    el.dataset.observed = '1';
    observer.observe(el);
  });
}

/* ─────────────────────────────────────────────────
   BRUIT NUMÉRIQUE (canvas)
───────────────────────────────────────────────── */
function initNoise() {
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let frame = 0;
  function loop() {
    frame++;
    /* Rafraîchit 1 frame sur 3 pour économiser le CPU */
    if (frame % 3 === 0) {
      const img = ctx.createImageData(W, H);
      const d   = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/* ─────────────────────────────────────────────────
   FORMULAIRE DE CONTACT
───────────────────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const success = document.getElementById('formSuccess');

  /* Pré-remplit le sujet si un modèle est dans le panier */
  const subject = document.getElementById('f-type');
  if (subject && !subject.value && cart.length > 0) {
    subject.value = cart.map(i => i.name).join(', ');
  }

  success.style.display = 'block';
  form.reset();
  setTimeout(() => { success.style.display = 'none'; }, 6000);
}

/* ─────────────────────────────────────────────────
   SCROLL TO HASH — previews iframe portfolio (multi-retry)
───────────────────────────────────────────────── */
(function () {
  if (!window.location.hash) return;
  function tryScroll() {
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    window.scrollTo({ top: target.offsetTop, behavior: 'instant' });
  }
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(tryScroll, 80);
    setTimeout(tryScroll, 400);
    setTimeout(tryScroll, 1000);
  });
})();

/* ─────────────────────────────────────────────────
   INIT GLOBAL
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
  initNavbar();
  initNoise();
  observeReveal();

  /* Panier — événements */
  document.getElementById('cartBtn').addEventListener('click', () => { openCart(); flashCartIcon(); });
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
});
