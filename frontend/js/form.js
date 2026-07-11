/* ── FORM VALIDATION ── */
const touched = {};

function getVal(field) {
  if (field === 'consent') {
    const el = document.getElementById('f-consent');
    return el && el.checked ? '1' : '';
  }
  return document.getElementById('f-' + field).value;
}

function validate(field) {
  const v = getVal(field).trim();
  if (field === 'name')    return v ? '' : 'Votre nom est requis.';
  if (field === 'email') {
    if (!v) return 'Votre email est requis.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : "Format d'email invalide.";
  }
  if (field === 'subject') return v ? '' : 'Précisez le sujet.';
  if (field === 'message') return v.length >= 20 ? '' : 'Votre message doit faire au moins 20 caractères.';
  if (field === 'consent') return v ? '' : 'Vous devez accepter la politique de confidentialité.';
  return '';
}

function setFG(field, err) {
  const fg    = document.getElementById('fg-' + field);
  const errEl = document.getElementById('err-' + field);
  if (!fg || !errEl) return;
  fg.classList.remove('err', 'ok');
  if (err) {
    fg.classList.add('err');
    errEl.textContent    = err;
    errEl.style.display  = 'flex';
  } else {
    fg.classList.add('ok');
    errEl.style.display  = 'none';
  }
}

function liveVal(field) {
  if (!touched[field]) return;
  setFG(field, validate(field));
}

function blurField(field) {
  touched[field] = true;
  setFG(field, validate(field));
}

async function submitForm(e) {
  e.preventDefault();
  const fields = ['name', 'email', 'subject', 'message', 'consent'];
  fields.forEach(f => { touched[f] = true; });
  const errs = fields.map(f => validate(f)).filter(Boolean);
  fields.forEach(f => setFG(f, validate(f)));
  if (errs.length) return;

  const btn = document.getElementById('f-submit');
  btn.disabled  = true;
  btn.innerHTML = '<span class="spinner"></span> Envoi en cours…';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    getVal('name'),
        email:   getVal('email'),
        subject: getVal('subject'),
        message: getVal('message'),
        website: getVal('website'), // honeypot : vide pour un humain
        privacy_consent: !!document.getElementById('f-consent')?.checked,
      }),
    });

    if (!res.ok) throw new Error();

    // Annonce accessible (aria-live) + affichage succès
    const region = document.getElementById('form-status');
    if (region) region.textContent = 'Message envoyé avec succès. Nous reviendrons vers vous dans les 24 heures.';

    document.getElementById('contact-right').innerHTML = `
      <div class="form-success" role="status">
        <div class="success-icon" aria-hidden="true">✓</div>
        <h3>Message envoyé !</h3>
        <p>Merci pour votre message. Nous reviendrons vers vous dans les 24 heures.</p>
        <button type="button" class="btn btn-outline" onclick="location.reload()">Envoyer un autre message</button>
      </div>`;
  } catch {
    btn.disabled  = false;
    btn.innerHTML = '<span class="bicon" aria-hidden="true">→</span> Envoyer le message <span class="bicon" aria-hidden="true">_</span>';

    // Annonce erreur accessible
    const region = document.getElementById('form-status');
    if (region) region.textContent = 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.';
    alert("Une erreur est survenue. Veuillez réessayer ou nous contacter directement.");
  }
}