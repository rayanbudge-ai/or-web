// ── CUSTOM CURSOR ──
const cur = document.getElementById('cursor');

document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});

document.querySelectorAll('a, button, .svc, .gi, .fq, .artist').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('hov'));
  el.addEventListener('mouseleave', () => cur.classList.remove('hov'));
});

// ── FAQ ACCORDION ──
function tfaq(el) {
  const item = el.parentElement;
  const was  = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!was) item.classList.add('open');
}

// ── BOOKING FORM ──
function hbk(e) {
  e.preventDefault();
  document.getElementById('bk-ok').style.display = 'block';
  const btn = e.target.querySelector('button');
  btn.style.opacity = '0.4';
  btn.disabled = true;
}

// ── SCROLL REVEAL ──
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.07 });

document.querySelectorAll('.svc, .artist, .gi, .stat, .mb').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  io.observe(el);
});

// ── SCROLL TO HASH (previews iframe portfolio) ──
window.addEventListener('load', () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  setTimeout(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }), 200);
});
