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

**Aucun framework runtime** (pas de React/Vue/etc.). Front en HTML/CSS/JS
vanilla. esbuild sert uniquement au build (concat + minify, mode `transform`,
pas de renommage des globales — les handlers inline du HTML en dépendent).

## Commandes

- `npm run build` — bundles fingerprintés dans `frontend/dist/` + manifest.json,
  pages services/blog/légal générées, sitemap.xml. **Requis avant `npm start`.**
- `npm run dev` — rebuild auto des bundles à chaque modif CSS/JS
- `npm start` — serveur sur :3000 (PORT surchargeable)

Il n'y a **pas** de lint, typecheck ni formatter configurés. Pas de TypeScript.

## Architecture

- `frontend/` — sources statiques. `css/*.css` et `js/*.js` sont concaténés dans
  l'ordre défini par [build.js](build.js) (l'ordre compte : cascade CSS,
  dépendances JS).
- [build-pages.js](build-pages.js) — génère les pages SEO services/blog/légal,
  les études de cas (`frontend/projets/*.html`, depuis `portfolio-data.js`) et le
  sitemap, depuis des templates JS. Sorties **gitignorées** :
  `frontend/services/`, `frontend/blog/`, `frontend/mentions-legales/`,
  `frontend/politique-de-confidentialite/`, `frontend/projets/*.html`,
  `frontend/sitemap.xml`, `frontend/dist/`.
- Ne jamais éditer une page générée : la modification est perdue au prochain
  build. Corriger le template ou les données.
- Les routes `/`, `/portfolio`, `/contact` sont SSR ; le reste est statique.
- SEO : `ROUTE_META` de [server.js](server.js) est la seule source de vérité des
  meta des routes SSR ; les meta par défaut de `frontend/index.html` doivent
  rester alignées avec son entrée `/`.

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
