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
  fg.classList.toggle('err', !!err);
  errEl.textContent = err;
  errEl.hidden = !err;
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
  const errBox = document.getElementById('form-error');
  if (errBox) { errBox.hidden = true; errBox.textContent = ''; }
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

    if (!res.ok) {
      // Le serveur renvoie un message explicite (rate-limit, validation) :
      // on le relaie tel quel, injecté en textContent plus bas (pas de HTML).
      const data = await res.json().catch(() => null);
      throw new Error(data && typeof data.error === 'string' ? data.error : '');
    }

    // Annonce accessible (aria-live) + affichage succès
    const region = document.getElementById('form-status');
    if (region) region.textContent = 'Message envoyé avec succès. Nous reviendrons vers vous dans les 24 heures.';

    document.getElementById('contact-right').innerHTML = `
      <div class="form-success" role="status">
        <span class="marginalia">(Message envoyé)</span>
        <h2 class="card-title">Merci, c'est <em class="kw">bien reçu.</em></h2>
        <p>Nous reviendrons vers vous dans les 24 heures.</p>
        <button type="button" class="btn btn-secondary" onclick="location.reload()">Envoyer un autre message <span class="bicon" aria-hidden="true">→</span></button>
      </div>`;
  } catch (err) {
    btn.disabled  = false;
    btn.innerHTML = '<span class="bicon" aria-hidden="true">$</span> Envoyer le message <span class="bicon" aria-hidden="true">→</span>';

    // Erreur affichée sous le bouton (role=alert → annoncée), avec une voie
    // de repli directe. textContent : aucun HTML interprété.
    const msg = (err && err.message) || 'Une erreur est survenue.';
    if (errBox) {
      errBox.textContent = `${msg} Réessayez ou écrivez-nous à contact@or-web.fr.`;
      errBox.hidden = false;
    }
  }
}