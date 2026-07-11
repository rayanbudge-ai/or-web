/* ── FOOTER UNIQUE — évite la duplication HTML ── */
const FOOTER_HTML = `
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

document.querySelectorAll('.page-footer-slot').forEach(slot => {
  slot.innerHTML = FOOTER_HTML;
});
