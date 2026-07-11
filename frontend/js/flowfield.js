/* ── FLOW FIELD GÉNÉRATIF — particules dérivantes (bruit de Perlin) ──
   Module réutilisable, vanilla, zéro dépendance externe.

   Contraintes respectées :
   - prefers-reduced-motion  → rendu statique unique, pas d'animation
   - requestAnimationFrame
   - pause hors-écran via IntersectionObserver
   - devicePixelRatio capé (maxDPR)
   - canvas décoratif aria-hidden, zéro layout shift (absolu, dimensionné en CSS)
   - discret : trails en fondu alpha-only (le fond/orbes restent visibles) */
(function () {
  'use strict';

  /* Bruit de Perlin 2D compact (improved noise, table de permutation seedée) */
  function makePerlin(seed) {
    const p = new Uint8Array(512);
    const perm = [];
    for (let i = 0; i < 256; i++) perm[i] = i;
    let s = seed || 1;
    const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = perm[i]; perm[i] = perm[j]; perm[j] = tmp;
    }
    for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

    const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + t * (b - a);
    const grad = (h, x, y) => ((h & 1) ? -x : x) + ((h & 2) ? -y : y);

    return (x, y) => {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
      x -= Math.floor(x); y -= Math.floor(y);
      const u = fade(x), v = fade(y);
      const a = p[X] + Y, b = p[X + 1] + Y;
      return lerp(
        lerp(grad(p[a], x, y),         grad(p[b], x - 1, y),         u),
        lerp(grad(p[a + 1], x, y - 1), grad(p[b + 1], x - 1, y - 1), u),
        v
      ); // ≈ [-1, 1]
    };
  }

  function createFlowField(canvas, opts) {
    opts = opts || {};
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return null;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DPR    = Math.min(window.devicePixelRatio || 1, opts.maxDPR || 1.5);
    const colors = opts.colors || ['#C6FF3D', '#35E5FF', '#A06BFF', '#FF4D8D'];
    const noise  = makePerlin(opts.seed || 7);
    const SCALE  = opts.scale || 0.0016; // échelle du champ
    const SPEED  = opts.speed || 0.45;   // vitesse de dérive (lente)

    let W = 0, H = 0, particles = [], raf = null, running = false, t = 0;

    function spawn() {
      const x = Math.random() * W, y = Math.random() * H;
      return { x, y, px: x, py: y, life: 0,
               ttl: 200 + Math.random() * 320,
               c: colors[(Math.random() * colors.length) | 0] };
    }
    function reset(pt) {
      pt.x = Math.random() * W; pt.y = Math.random() * H;
      pt.px = pt.x; pt.py = pt.y; pt.life = 0; pt.ttl = 200 + Math.random() * 320;
    }
    function seed(n) { particles = []; for (let i = 0; i < n; i++) particles.push(spawn()); }

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      canvas.width  = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const target = Math.min(Math.round((W * H) / 14000), opts.max || 120);
      seed(target);
      ctx.clearRect(0, 0, W, H);
      if (reduce) drawStatic();
    }

    function step() {
      // fondu des traces : on retire de l'alpha (le fond reste transparent)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.045)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 1;

      t += 0.0009;
      for (const pt of particles) {
        const ang = noise(pt.x * SCALE, pt.y * SCALE + t) * Math.PI * 2.5;
        pt.px = pt.x; pt.py = pt.y;
        pt.x += Math.cos(ang) * SPEED;
        pt.y += Math.sin(ang) * SPEED;
        pt.life++;
        if (pt.life > pt.ttl || pt.x < -6 || pt.x > W + 6 || pt.y < -6 || pt.y > H + 6) { reset(pt); continue; }
        ctx.strokeStyle = pt.c;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(pt.px, pt.py);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Fallback statique : une seule passe de filaments, discrète
    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (const pt of particles) {
        let x = pt.x, y = pt.y;
        ctx.strokeStyle = pt.c;
        ctx.globalAlpha = 0.16;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let i = 0; i < 20; i++) {
          const ang = noise(x * SCALE, y * SCALE) * Math.PI * 2.5;
          x += Math.cos(ang) * 4; y += Math.sin(ang) * 4;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function loop() { step(); raf = requestAnimationFrame(loop); }
    function start() { if (running || reduce) return; running = true; raf = requestAnimationFrame(loop); }
    function stop()  { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    // Resize (debounce léger en rAF) — pas de layout shift, canvas absolu
    let rz = null;
    const onResize = () => { if (rz) cancelAnimationFrame(rz); rz = requestAnimationFrame(resize); };
    if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(canvas);
    else window.addEventListener('resize', onResize);

    // Pause hors écran
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        entries.forEach(e => (e.isIntersecting ? start() : stop()));
      }, { threshold: 0 }).observe(canvas);
    }

    resize();
    if (!reduce) start();
    return { start, stop, resize };
  }

  window.createFlowField = createFlowField;

  function init() {
    const c = document.getElementById('hero-flow');
    if (c) createFlowField(c, { max: 120 });
  }
  // Canvas purement décoratif (aria-hidden). Son resize() lit
  // getBoundingClientRect() → force un reflow (~84 ms sur mobile throttlé).
  // On l'initialise APRÈS le premier rendu pour sortir ce coût du chemin
  // critique du LCP/FCP : requestIdleCallback si dispo, sinon après load.
  const boot = () =>
    ('requestIdleCallback' in window)
      ? requestIdleCallback(init, { timeout: 1500 })
      : setTimeout(init, 200);
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot, { once: true });
})();
