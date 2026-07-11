# CLAUDE.md

Guide pour Claude Code sur ce dépôt. Projet en français (code commenté en français, commits en français).

## Vue d'ensemble

Deux services web dans ce répertoire de travail, déployés séparément sur Render :

1. **Vitrine or-web.fr** (racine) — site de l'agence. Express minimal ([server.js](server.js)) :
   SSR léger (injection des meta par route dans `frontend/index.html`), formulaire de
   contact par email (SMTP OVH, protégé par rate-limit + honeypot), fichiers statiques.
   C'est le contenu de ce dépôt (public).
2. **CRM app.or-web.fr** (`app/`) — CRM interne de prospection B2B. Express + PostgreSQL,
   sessions en base, import CSV avec dédup. **Non versionné dans ce dépôt** (gitignoré :
   repo et service Render séparés) — le dossier existe seulement en local.

## Contrainte forte : stack vanilla

**Aucun framework runtime** (pas de React/Vue/etc.). Front en HTML/CSS/JS vanilla.
esbuild sert uniquement au build de la vitrine (concat + minify, mode `transform`,
pas de renommage des globales — les handlers inline du HTML en dépendent).

## Commandes

### Vitrine (racine)
- `npm run build` — bundles fingerprintés dans `frontend/dist/` + manifest.json,
  pages services/blog générées, sitemap.xml. **Requis avant `npm start`.**
- `npm run dev` — rebuild auto des bundles à chaque modif CSS/JS
- `npm start` — serveur sur :3000 (PORT surchargeable)

### CRM (`cd app`)
- `npm start` / `npm run dev` — serveur sur :10000 (exige `DATABASE_URL`, `SESSION_SECRET`)
- `npm test` — tests unitaires (runner intégré `node --test`, zéro dépendance)
- `npm run migrate` — migrations SQL idempotentes (`app/migrations/*.sql`)
- `npm run seed:admin` / `seed:resources` — données initiales

Il n'y a **pas** de lint, typecheck ni formatter configurés. Pas de TypeScript.

## Architecture

### Vitrine
- `frontend/` — sources statiques. `css/*.css` et `js/*.js` sont concaténés dans
  l'ordre défini par [build.js](build.js) (l'ordre compte : cascade CSS, dépendances JS).
- [build-pages.js](build-pages.js) — génère les pages SEO services/blog/légal, les
  études de cas (`frontend/projets/*.html`, depuis `portfolio-data.js`) + sitemap
  depuis des templates JS. Sorties gitignorées (`frontend/services/`, `frontend/blog/`,
  `frontend/mentions-legales/`, `frontend/politique-de-confidentialite/`,
  `frontend/projets/*.html`, `frontend/sitemap.xml`, `frontend/dist/`).
- Les routes `/`, `/portfolio`, `/contact` sont SSR ; le reste est statique.
- SEO : `ROUTE_META` de [server.js](server.js) est la seule source de vérité des
  meta des routes SSR ; les meta par défaut de `frontend/index.html` doivent rester
  alignées avec son entrée `/`.

### CRM (`app/`)
- `src/routes/*.routes.js` → `src/services/*.service.js` → `src/config/db.js` (pool pg).
- Auth : sessions Postgres (`connect-pg-simple`), argon2id, rôles `admin`/`prospecteur`
  re-vérifiés en base à chaque requête (`src/middleware/auth.js`).
- Import CSV (`src/services/import/`) : preview → plan en session (TTL 15 min) →
  commit transactionnel. Garde-fous : `statut_pipeline`/`assigned_to` jamais modifiés
  par un import, champ vide n'écrase jamais une valeur, tout-ou-rien.
- Front vanilla dans `public/` (aucun build), wrapper fetch commun `public/js/api.js`.
- Tests dans `tests/*.test.js` — à maintenir quand on touche à l'import ou aux
  normalisations.

## Déploiement (Render)

- Deux services web ; les `render.yaml` (racine et `app/`) documentent la config mais
  un service créé via dashboard ne les relit pas — reporter les changements au dashboard.
- Vitrine : Build Command `npm install --include=dev && npm run build` (esbuild est en
  devDependencies). CRM : `npm ci` + preDeploy `npm run migrate`.
- Les deux serveurs gèrent SIGTERM (arrêt propre). Health checks : `/api/health`.

## Conventions

- Commits : `type(scope): description` en français (`feat(crm):`, `fix(blog):`, `sec(contact):`).
- Commentaires : expliquer le *pourquoi* (contraintes, pièges), en français.
- Sécurité : toute donnée utilisateur affichée passe par un échappement HTML
  (`escapeHtml` côté vitrine, `esc()` côté CRM) ; requêtes SQL toujours paramétrées ;
  tri/filtres SQL par liste blanche uniquement.
