# CLAUDE.md

Guide pour Claude Code sur ce dépôt. Projet en français : code commenté en
français, commits en français.

## Vue d'ensemble

Ce dépôt contient **la vitrine or-web.fr**, et elle seule : un serveur Express
minimal ([server.js](server.js)) qui fait du SSR léger (injection des meta par
route dans `frontend/index.html`), sert les fichiers statiques et expose un
formulaire de contact par email (SMTP OVH, protégé par rate-limit et honeypot).
Dépôt public.

> Un dossier `app/` a longtemps traîné ici : le premier CRM (Express +
> PostgreSQL), jamais versionné dans ce dépôt et devenu inutile. Supprimé le
> 27/08/2026, conservé hors dépôt dans les archives locales. Le CRM actuel est
> un projet séparé (FastAPI + Next.js, dépôt privé) sans aucun lien avec celui-ci.

## Contrainte forte : stack vanilla

**Aucun framework runtime** (pas de React/Vue/etc.) ni librairie d'animation.
Front en HTML/CSS/JS vanilla. esbuild sert uniquement au build (concat + minify, mode `transform`,
pas de renommage des globales — les handlers inline du HTML en dépendent).

## Commandes

- `npm run build` — bundles fingerprintés dans `frontend/dist/` (styles, app,
  pages) + manifest.json, puis `build-pages.js` : pages services/blog/légal,
  études de cas, 404.html, sitemap.xml. **Requis avant `npm start`.**
- `npm run dev` — rebuild auto des bundles ET des pages générées à chaque modif
  CSS/JS, `index.html` ou `build-pages.js` (les pages pointent toujours vers le
  CSS du dernier build)
- `npm run check` — serveur lancé (`BASE=` pour un autre port) : classes HTML
  absentes du CSS compilé, même feuille sur toutes les pages, aucune couleur en
  dur hors `:root`. Doit sortir vide.
- `npm start` — serveur sur :3000 (PORT surchargeable)

Il n'y a **pas** de lint, typecheck ni formatter configurés. Pas de TypeScript.

## Architecture

- `frontend/` — sources statiques. `css/*.css` et `js/*.js` sont concaténés dans
  l'ordre défini par [build.js](build.js) (l'ordre compte : cascade CSS,
  dépendances JS). Deux bundles JS : `app` (index.html) et `pages`
  (`reveal.js` + `pages.js`, pour les pages générées).
- [build-pages.js](build-pages.js) — génère les pages SEO services/blog/légal,
  les études de cas (`frontend/projets/*.html`, depuis `portfolio-data.js`) et le
  sitemap, ainsi que `frontend/404.html` (suivie dans git), depuis des
  templates JS. La barre de pied est lue dans `index.html` (source unique).
  Sorties **gitignorées** :
  `frontend/services/`, `frontend/blog/`, `frontend/mentions-legales/`,
  `frontend/politique-de-confidentialite/`, `frontend/projets/*.html`,
  `frontend/sitemap.xml`, `frontend/dist/`.
- Ne jamais éditer une page générée : la modification est perdue au prochain
  build. Corriger le template ou les données.
- Les routes `/`, `/portfolio`, `/contact` sont SSR (la section `.page` de la
  route est active dès le HTML) ; le reste est statique.
- **Système de design = l'accueil.** Couleurs uniquement en tokens dans `:root`
  (`css/base.css`), un seul accent lime. Composants partagés dans
  [css/components.css](frontend/css/components.css) : `.btn` (`btn-primary` /
  `btn-secondary`), `.card` (+ `card-num` contour→lime, `card-go`), `.row-list`
  (lignes des panneaux), `.info-list`, `.tag`, `.breadcrumb`, `.page-head`,
  `.sec` (marginalia col. 1–2, corps col. 3+), `.faq`, `.home-bar` (pied commun,
  fixe sur l'accueil). Eyebrows = `.marginalia` « (Libellé) », sans numéro.
  Titres en casse normale, un mot clé `<em class="kw">`. Pas de CSS par page
  sauf nécessité. Header identique partout (logo, Portfolio, Contact →
  `/#contact`), sans burger. Un seul fond : le calque `.ambient`
  ([css/scene.css](frontend/css/scene.css)).
- Accueil = machine à états intro → home → panel
  ([js/accueil.js](frontend/js/accueil.js)), portée par `html[data-stage]`,
  posée avant le premier rendu par le script de tête de `index.html` (intro à
  l'arrivée de l'extérieur ; home pour un référent interne, un rechargement,
  un retour arrière via `history.state`, un lien `/#panneau`). Jamais de
  `sessionStorage` pour « intro déjà vue » (invariant de la mesure ci-dessous).
  Transitions = timelines nommées (Web Animations), `html[data-anim]` pendant
  qu'elles jouent (`data-anim="intro"` pendant intro → home : le slogan reste
  visible le temps de sa sortie). Le CSS ne décrit que des états de repos.
  Panneaux Services / Méthode / Contact : `role="dialog"` toujours dans le DOM,
  ouverts depuis la carte cliquée (`clip-path: inset()`), hash synchronisé,
  piège de focus.
- Mouvement : n'animer que `transform`, `opacity`, `clip-path`. Toujours une
  variante `prefers-reduced-motion`. Un seul langage d'entrée, dans
  [js/reveal.js](frontend/js/reveal.js) (`window.OrReveal`) : titre ligne par
  ligne (`.ht-line` > `.ht-in`) puis contenu en décalé ; durées/décalages =
  tokens `--rv-*` de `:root`. Utilisé par les panneaux de l'accueil et, au
  scroll (IntersectionObserver, une fois), par les pages internes. L'en-tête
  `.page-head` est animé en CSS ([css/reveal.css](frontend/css/reveal.css))
  sans jamais partir de `opacity: 0` (titre = LCP). Sans JS / mouvement
  réduit : rien n'est masqué.
- SEO : `ROUTE_META` de [server.js](server.js) est la seule source de vérité des
  meta des routes SSR ; les meta par défaut de `frontend/index.html` doivent
  rester alignées avec son entrée `/`.

## Mesure d'audience (suivi sans cookie)

Le site mesure sa fréquentation avec son propre dispositif, sans cookie ni
stockage local, et relaie les visites au CRM (dépôt séparé) qui les stocke.

- `frontend/js/mesure.js` — script client. **Hors du bundle** `app.min.js` à
  dessein : les pages générées ne chargent pas le bundle et doivent pourtant
  être mesurées. La balise est injectée par `MESURE_TAG` dans
  [build-pages.js](build-pages.js) (pages générées, 404 comprise), et en dur
  dans `index.html`.
- `POST /api/mesure` dans [server.js](server.js) — **seul endroit du code où
  l'IP et le user-agent existent**. Ils servent à calculer un HMAC à sel
  quotidien, puis disparaissent : ni journalisés, ni transmis, ni stockés.
- Trois variables d'environnement, toutes requises : `CRM_API_URL`,
  `MESURE_API_KEY`, `SEL_MESURE`. L'une manque → mesure inactive, le site
  fonctionne normalement et l'avertit au démarrage.

Deux invariants à ne pas casser :

1. **Aucun cookie, aucun `localStorage`, aucun `sessionStorage`.** C'est ce qui
   fait sortir le site de l'article 82 de la loi Informatique et Libertés,
   donc de l'obligation de bandeau. Y toucher fait basculer le site dans le
   régime du consentement préalable, et rend fausse la page
   politique-de-confidentialité.
2. **Ni l'IP, ni le user-agent, ni l'URL référente complète ne sortent du
   serveur.** Le client n'envoie que l'hôte du référent ; le serveur n'envoie
   qu'un hash. Une URL référente entière peut contenir une requête de
   recherche, donc une donnée personnelle.

`SEL_MESURE` ne se change pas sans raison : sa rotation remet à zéro
l'identification et gonfle le compte de visiteurs uniques du jour.

## Mentions légales

[legal-info.js](legal-info.js) est la source de vérité : identité de l'éditeur,
SIREN/SIRET, régime de TVA, hébergeur. Les pages légales en sont régénérées à
chaque build.

Régime actuel : entreprise individuelle en franchise en base de TVA, sans RCS
(activité libérale). Le champ `tva` vide fait afficher la mention 293 B ; le
renseigner bascule automatiquement la ligne vers le n° intracommunautaire. Ne
jamais afficher les deux.

## Direction produit — bascule WaaS

Le positionnement passe de « agence web au projet » à un **abonnement mensuel
avec engagement de 12 mois**, tarifs affichés publiquement. Le brief de
référence est `brief-refonte-or-web-waas-v2.md` (non versionné).

Deux règles en découlent, à respecter dans toute rédaction ou tout composant
touchant au prix :

1. **Un prix mensuel ne s'affiche jamais seul.** Partout où un « x €/mois »
   apparaît, le bloc complet doit être visible sans interaction : frais de mise
   en service, mensuel, durée d'engagement, total dû la première année. Ce n'est
   pas une préférence de rédaction, c'est une contrainte d'implémentation — le
   composant de prix doit rendre l'affichage partiel impossible.
2. **La grille tarifaire vit dans un seul fichier de données**, jamais en dur
   dans le HTML, et les totaux sont **calculés au build**, jamais saisis. Un
   total désynchronisé du mensuel affiché est une erreur de prix opposable.

Plusieurs points contractuels (conditions de sortie, rachat du site, propriété
du domaine, délai de mise en ligne) ne sont **pas tranchés** : la refonte de la
page tarifs ne peut pas être rédigée avant. Ne pas les inventer.

## Déploiement

Hébergé sur Render. `render.yaml` documente la configuration, mais un service
créé via le dashboard ne le relit pas — reporter les changements au dashboard.

- Build Command : `npm install --include=dev && npm run build` (esbuild est en
  devDependencies)
- Start Command : `npm start`
- Health check : `/api/health`
- Le serveur gère SIGTERM (arrêt propre).

## Conventions

- Commits : `type(scope): description` en français (`feat(portfolio):`,
  `fix(blog):`, `sec(contact):`).
- Commentaires : expliquer le *pourquoi* (contrainte, piège, décision).
- Sécurité : toute donnée utilisateur affichée passe par `escapeHtml`. Aucun
  secret versionné — seul `.env.example` est suivi, et le dépôt est **public**.
