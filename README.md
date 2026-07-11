# OR-Web — Vitrine or-web.fr

Site de l'agence OR-Web (Bordeaux) : HTML/CSS/JS vanilla, Express minimal, déployé sur Render.

## Structure du projet

```
or-web/
├── server.js              ← Serveur Express (SSR léger + statique + API contact)
├── build.js               ← Bundle CSS/JS fingerprintés → frontend/dist/
├── build-pages.js         ← Pages SEO (services, blog, légal) + sitemap.xml
├── legal-info.js          ← Données mentions légales (SIRET, etc. à compléter)
├── render.yaml            ← Config déploiement Render (vitrine)
├── package.json
├── .env.example
│
├── frontend/
│   ├── index.html         ← AE : accueil, portfolio, contact (routes SSR)
│   ├── og-image.jpg       ← Image Open Graph (partages sociaux)
│   ├── css/               ← Sources CSS (concaténées au build)
│   ├── js/                ← Sources JS (concaténées au build)
│   ├── fonts/             ← Polices self-hostées (woff2)
│   ├── img/
│   ├── projets/           ← Études de cas + démos clients
│   ├── robots.txt
│   └── 404.html
```

Les dossiers `frontend/dist/`, `frontend/services/`, `frontend/blog/`,
`frontend/mentions-legales/`, `frontend/politique-de-confidentialite/` et
`frontend/sitemap.xml` sont **générés au build** (gitignorés).

## Démarrage local

```bash
cp .env.example .env    # Renseigner SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL
npm install
npm run build           # Requis avant npm start
npm start               # http://localhost:3000
```

Mode développement (rebuild auto des bundles CSS/JS) :

```bash
npm run dev             # Terminal 1 — watch build.js
npm start               # Terminal 2
```

## API vitrine

| Méthode | Route          | Description                          |
|---------|----------------|--------------------------------------|
| GET     | /api/health    | Health check Render                  |
| POST    | /api/contact   | Formulaire de contact (email SMTP)   |

### POST /api/contact

```json
{
  "name": "Dupont",
  "email": "jean@exemple.fr",
  "subject": "Création d'un site vitrine",
  "message": "Bonjour, je souhaite…",
  "privacy_consent": true,
  "website": ""
}
```

Le champ `website` est un honeypot (doit rester vide). `privacy_consent` est obligatoire (RGPD).

## Routes du site

| Type        | URLs                                              |
|-------------|---------------------------------------------------|
| AE + SSR    | `/`, `/portfolio`, `/contact`                     |
| Générées    | `/services`, `/services/*`, `/blog`, `/blog/*`    |
| Légal       | `/mentions-legales`, `/politique-de-confidentialite` |
| Statiques   | `/projets/*`, assets (`/dist/`, `/fonts/`, …)     |

## Déploiement (Render)

- **Build Command :** `npm install --include=dev && npm run build`
- **Start Command :** `npm start`
- **Health Check :** `/api/health`

## Mentions légales

Compléter `legal-info.js` (SIRET, forme juridique, RCS…) si l'entreprise est immatriculée.
Les pages légales sont régénérées à chaque `npm run build`.
