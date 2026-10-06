/* ──────────────────────────────────────────────────────────────────────────
   MESURE D'AUDIENCE — suivi sans cookie.

   Ce script ne lit ni n'écrit RIEN dans le navigateur : pas de cookie, pas de
   localStorage, pas de sessionStorage. C'est ce qui le fait sortir du champ de
   l'article 82 de la loi Informatique et Libertés, et donc de l'obligation de
   bandeau de consentement. Toute évolution qui y toucherait ferait basculer le
   site dans le régime du consentement préalable : ne pas le faire sans mesurer
   cette conséquence.

   Ce qui part d'ici : le chemin de la page (jamais la query string, qui peut
   porter une donnée personnelle), le titre, l'HÔTE du référent (jamais l'URL
   entière, qui peut contenir une requête de recherche), une classe d'appareil
   et une durée. L'identification du visiteur est faite côté serveur, par un
   hash sous une clé quotidienne jetable — voir /api/mesure dans server.js.

   Le fichier n'est volontairement pas dans le bundle app.min.js : les pages
   générées (services, blog, mentions légales) ne le chargent pas, alors
   qu'elles doivent être mesurées comme les autres.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var ENDPOINT = '/api/mesure';

  // Hors production, on ne mesure pas : les rechargements du `npm run dev` et
  // les pages ouvertes en local fausseraient les chiffres.
  var HOTES = ['or-web.fr', 'www.or-web.fr'];
  if (HOTES.indexOf(location.hostname) === -1) return;

  // Signaux de refus du navigateur. Rien n'y oblige pour un suivi sans cookie,
  // mais les honorer coûte deux lignes et tient la promesse faite sur la page
  // politique de confidentialité.
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  if (navigator.globalPrivacyControl === true) return;

  function identifiant() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    // Repli pour les navigateurs sans randomUUID : l'identifiant ne sert qu'à
    // rapprocher la page vue de sa durée, une collision est sans conséquence.
    return 'e-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function appareil() {
    var l = window.innerWidth || document.documentElement.clientWidth || 0;
    if (l < 768) return 'mobile';
    if (l < 1024) return 'tablette';
    return 'ordinateur';
  }

  // Seul l'hôte du référent sort d'ici, et seulement s'il est externe : une
  // navigation interne n'est pas une source de trafic.
  function referrerHote() {
    if (!document.referrer) return null;
    try {
      var h = new URL(document.referrer).hostname;
      return HOTES.indexOf(h) === -1 ? h : null;
    } catch (e) {
      return null;
    }
  }

  // Seul le nom de campagne est repris. Les autres paramètres d'URL sont
  // ignorés : ils peuvent contenir n'importe quoi, y compris un e-mail.
  function campagne() {
    try {
      var p = new URLSearchParams(location.search);
      var c = p.get('utm_campaign') || p.get('utm_source');
      return c ? c.slice(0, 120) : null;
    } catch (e) {
      return null;
    }
  }

  var evenementId = identifiant();
  var debut = Date.now();
  var dureeEnvoyee = false;

  function envoyer(corps, beacon) {
    var json = JSON.stringify(corps);
    // Au départ de la page, seul sendBeacon survit à la navigation : un fetch
    // classique serait annulé par le navigateur avant d'avoir abouti.
    if (beacon && navigator.sendBeacon) {
      try {
        navigator.sendBeacon(ENDPOINT, new Blob([json], { type: 'application/json' }));
        return;
      } catch (e) {
        /* on retombe sur fetch */
      }
    }
    if (!window.fetch) return;
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(function () {
      /* la mesure ne doit jamais remonter d'erreur au visiteur */
    });
  }

  envoyer(
    {
      evenement_id: evenementId,
      type: 'page',
      chemin: location.pathname.slice(0, 255),
      titre: (document.title || '').slice(0, 255),
      referrer_hote: referrerHote(),
      campagne: campagne(),
      appareil: appareil(),
    },
    false
  );

  function envoyerDuree() {
    if (dureeEnvoyee) return;
    dureeEnvoyee = true;
    envoyer(
      {
        evenement_id: evenementId,
        type: 'page',
        chemin: location.pathname.slice(0, 255),
        duree_ms: Math.min(Date.now() - debut, 7200000),
      },
      true
    );
  }

  // `visibilitychange` plutôt que `beforeunload` : c'est le seul événement que
  // Safari mobile déclenche de façon fiable quand l'onglet part en arrière-plan
  // ou que l'application est fermée. `pagehide` couvre le retour arrière.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') envoyerDuree();
  });
  window.addEventListener('pagehide', envoyerDuree);
})();
