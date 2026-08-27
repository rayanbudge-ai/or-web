# Brief de refonte — or-web.fr

**Objectif** : aligner le site vitrine sur l'offre réellement vendue.
**Date** : 17 août 2026
**Sources** : configurateur de devis, playbook de prospection, et les 301 prospects
réels en base dans le CRM.

---

## 1. Le constat qui justifie la refonte

Le site actuel et l'offre réelle racontent deux histoires différentes.

| | Site actuel | Offre réellement vendue |
|---|---|---|
| Titre | « Agence Web **Premium** à Bordeaux — Sites **sur mesure** » | WaaS : site en abonnement |
| Prix affichés | **aucun** — « sur mesure » ×5, « devis » ×2 | 120 à 590 € + **19 à 99 €/mois** |
| Promesse | artisanat, projet unique | produit packagé, mise en ligne rapide |
| Frein levé | aucun | **le coût d'entrée** |
| Pages | **1** (`index.html` + `404.html`) | 128 secteurs × 10 zones ciblés en prospection |

Le site vend une agence premium. Le commerce vend un abonnement à partir de
19 €/mois. **Un prospect qui arrive sur le site n'a aucun moyen de comprendre
l'offre**, et le seul appel à l'action est un formulaire de devis — exactement le
frein que le modèle WaaS est censé supprimer.

C'est le problème central à résoudre. Tout le reste en découle.

---

## 2. Ce que disent les données de prospection

Base CRM au 17/08/2026, 301 prospects qualifiés :

| Signal | Valeur | Lecture |
|---|---|---|
| **Sans aucun site web** | **167 / 301 (55 %)** | La cible principale n'a jamais franchi le pas |
| Avec un site | 134 | Cible refonte / modernisation |
| E-mail exploitable | 5 (1,7 %) | **Le canal d'entrée est le téléphone, pas l'e-mail** |
| Téléphone | 301 (100 %) | |
| Score moyen | 29 / 100 | |

**Conséquence directe pour le site** : il ne reçoit pas de trafic de campagne
e-mail. Il est consulté par des prospects **après un appel** (« je vous envoie le
lien, regardez ») ou trouvés en **recherche locale**. Le site doit donc être une
page qu'un artisan ouvre sur son téléphone, entre deux chantiers, et qui doit
répondre en 30 secondes à : *combien ça coûte, en combien de temps, et est-ce
que c'est pour moi ?*

### Grille de score utilisée en prospection

Elle dit ce qui, chez un prospect, déclenche l'intérêt — donc ce que le site doit
adresser :

| Signal détecté | Points | Argument du site |
|---|---|---|
| Pas de site | +35 | « Exister sur Google » |
| Site en HTTP | +20 | « Votre site est signalé "non sécurisé" » |
| Non responsive | +15 | « 7 clients sur 10 vous cherchent au téléphone » |
| Site daté | +10 | « Un site de 2015 fait fuir » |
| Bonne note Google | +10/+5 | « Vous avez déjà la réputation, pas la vitrine » |

---

## 3. L'offre à mettre en avant

Structure réelle du configurateur : **acompte unique + abonnement mensuel**,
engagement 12 mois indicatif.

| Pack | Acompte | Mensuel | Positionnement |
|---|---|---|---|
| Landing / 1 page | 120 € | 19 € | Entrée de gamme |
| **Vitrine** | **180 €** | **29 €** | **Le plus vendu** |
| Local SEO | 220 € | 39 € | Artisans / zone |
| Portfolio | 220 € | 35 € | Créatifs |
| Resto & food | 230 € | 39 € | Carte / menu |
| RDV & beauté | 240 € | 39 € | Agenda en ligne |
| Refonte | 250 € | 35 € | Site existant |
| Pro+ | 280 € | 49 € | Multi-services |
| Vitrine + Auto | 320 € | 59 € | Upsell automatisations n8n |
| E-commerce | 450 € | 79 € | Boutique |
| E-commerce Pro | 590 € | 99 € | Catalogue étendu |

Inclus dans tous les packs : responsive, formulaire de contact, SEO de base,
HTTPS, hébergement, mises à jour mineures, analytics.

> **À trancher** : le configurateur porte la mention « offre encore flexible ».
> Publier des prix engage. Si la grille n'est pas figée, publier **le pack Vitrine
> seul** avec « à partir de 180 € + 29 €/mois » et garder le reste sur devis.

### L'argument massue à formuler explicitement

Une agence classique demande 2 000 à 5 000 € d'un coup. Ici : **180 € puis
29 €/mois**. Sur 12 mois cela fait 528 € — soit un dixième du prix, hébergement,
maintenance et mises à jour compris. **C'est ça, le message d'accueil.** Pas
« agence premium ».

---

## 4. Cible

**Qui** : TPE et commerces de proximité, 0 à 10 salariés, dirigeant = décideur =
utilisateur. Artisans du bâtiment, automobile, beauté, restauration, santé,
commerces, sport et loisirs — 128 métiers dans le catalogue de prospection.

**Zones** : Bordeaux et sa périphérie en priorité, puis Lyon, Paris, Marseille,
Toulouse, Nantes, Lille, Strasbourg, Montpellier, Nice.

**Ce qu'il n'est pas** : ni startup, ni DSI, ni acheteur habitué au web. Il ne
connaît pas « CMS », « responsive » ni « SEO ». Il connaît « être trouvé sur
Google » et « le téléphone qui sonne ».

**Deux profils à distinguer sur le site**

1. **Sans site (55 %)** — n'a jamais osé, croit que c'est cher et long.
   Objections : *« j'ai déjà Facebook »*, *« je marche au bouche-à-oreille »*,
   *« je n'ai pas le temps »*.
   → Message : **coût d'entrée bas, zéro travail de votre côté, en ligne en X jours**.

2. **Avec un site daté (45 %)** — a payé une fois, le site n'a pas bougé depuis.
   Objections : *« on a déjà un site »*, *« trop cher »*.
   → Message : **refonte + maintenance incluse, plus jamais de site abandonné**.

---

## 5. Arborescence proposée

Le site actuel fait **une seule page**. Pour capter la recherche locale, il faut
une surface.

```
/                        Accueil — promesse, prix, preuves, CTA
/offres                  Les packs, comparatif, ce qui est inclus
/offres/[pack]           Une page par pack (vitrine, local-seo, resto, rdv…)
/metiers/[metier]        Landing par métier — plombier, coiffeur, restaurant…
/villes/[ville]          Landing par zone — Bordeaux, Mérignac, Pessac…
/realisations            Portfolio (à alimenter)
/tarifs                  Grille complète + simulateur
/contact                 Formulaire + téléphone + prise de RDV
/mentions-legales /cgv   Obligatoire, et attendu pour la confiance
```

**Priorité 1** : accueil, offres, tarifs, contact.
**Priorité 2** : `/metiers/*` et `/villes/*`, générés depuis un même gabarit.

### Pourquoi les landings métier × ville

C'est le seul levier d'acquisition entrante cohérent avec la prospection. Un
plombier bordelais qui cherche « site internet plombier Bordeaux » doit tomber sur
une page qui lui parle de **son** métier. Le catalogue de secteurs et de communes
existe déjà dans `scrappo/config.json` et `scrappo/data/communes_fr.json` — le
contenu peut être généré depuis ces sources.

Attention : générer 128 × 160 = 20 000 pages quasi identiques serait pénalisé
comme du contenu dupliqué. **Commencer par une trentaine** : les 10 métiers les
plus démarchés × les 3 zones principales, avec du contenu réellement différencié
(exemples, vocabulaire, cas d'usage du métier).

---

## 6. Structure de la page d'accueil

Dans cet ordre, chaque bloc répondant à une objection réelle du playbook.

1. **Titre** — la promesse chiffrée.
   *« Votre site professionnel en ligne pour 180 € puis 29 €/mois. Hébergement,
   maintenance et mises à jour compris. »*
   Sous-titre : pour qui, et en combien de temps.

2. **Réassurance immédiate** — 3 points : sans engagement lourd / en ligne en
   X jours / on s'occupe de tout.

3. **Le problème, dit avec ses mots** — « Vos clients vous cherchent sur Google.
   Ils trouvent vos concurrents. » Deux colonnes : *sans site* / *avec un site
   qui date*.

4. **Les packs** — 3 cartes maximum en avant (Landing, **Vitrine** mis en
   évidence, Pro+), lien vers la grille complète. Prix visibles, pas de « à
   partir de » flou.

5. **Ce qui est inclus** — la liste qui justifie l'abonnement : hébergement,
   nom de domaine, HTTPS, sauvegardes, mises à jour, support. C'est la réponse à
   « pourquoi payer tous les mois ».

6. **Comment ça se passe** — 3 ou 4 étapes datées. Répond à « je n'ai pas le
   temps » : montrer que le client fournit peu de choses.

7. **Réalisations** — même 2 ou 3. Un site d'agence sans preuve visuelle ne
   convainc pas un artisan.

8. **Objections** — en FAQ, reprises telles quelles du playbook (§7).

9. **Appel à l'action** — téléphone cliquable en priorité, formulaire ensuite.
   Sur mobile, un bandeau d'appel permanent : la cible **appelle**, elle ne
   remplit pas de formulaire.

---

## 7. Objections à traiter, mot pour mot

Issues du playbook de prospection, donc réellement entendues au téléphone :

| Objection | Où la traiter | Angle |
|---|---|---|
| **« Trop cher »** | Bloc prix + FAQ | Comparer à une agence classique : 528 € la première année, tout compris |
| **« On a déjà un site »** | Bloc problème + pack Refonte | Quand l'avez-vous mis à jour ? est-il en HTTPS ? lisible au téléphone ? |
| **« J'ai déjà Facebook / Insta / Maps »** | FAQ | Vous louez chez quelqu'un d'autre. Un site vous appartient, et Google le référence |
| **« Je n'ai pas le temps »** | Bloc « comment ça se passe » | Un appel de 20 min, on s'occupe du reste |
| **« Je n'en ai pas besoin, bouche-à-oreille »** | Bloc problème | Vos clients vous recommandent — le suivant vérifie sur Google avant d'appeler |

---

## 8. Ce qui manque aujourd'hui et doit exister

- **Les prix.** Aucun chiffre sur le site actuel. C'est le principal frein levé
  par l'offre, et il est invisible.
- **La notion d'abonnement.** Rien n'indique que c'est un service récurrent.
- **Les preuves.** Aucune réalisation, aucun avis, aucun chiffre.
- **Le téléphone en évidence.** La cible appelle.
- **Les pages d'atterrissage locales.** Aucune surface de recherche.
- **Les mentions légales et CGV.** Obligatoires, et attendues pour un abonnement.
- **La cohérence avec le configurateur de devis**, qui est déjà l'outil de vente
  et devrait être proposé publiquement en version simplifiée (simulateur).

---

## 9. Contraintes techniques

**L'existant** : `orweb/site`, HTML/CSS/JS **vanilla** servi par un Express
minimal, avec injection des balises meta par route dans `frontend/index.html`.
Dépendances : `express`, `compression`, `cors`, `express-rate-limit`,
`nodemailer`, `dotenv`. Déployé sur Render.

**À décider** : rester en vanilla ou passer à un générateur statique. Le passage
à des dizaines de pages métier × ville rend le gabarit répétitif difficile à tenir
à la main. Un générateur (Astro, ou Next en export statique comme le CRM) rendrait
la génération triviale depuis les catalogues existants.

**Contraintes fermes**

- **Performance mobile** — la cible consulte sur son téléphone, souvent en 4G.
- **Le domaine `or-web.fr` reste sur Render**, `crm.or-web.fr` et
  `api.crm.or-web.fr` pointent vers le VPS Hetzner. Ne pas toucher à
  l'enregistrement A de `or-web.fr` (216.24.57.1) lors des modifications DNS.
- **Formulaire** — `nodemailer` déjà en place. Idéalement, un envoi de formulaire
  devrait **créer un lead dans le CRM** via `POST /leads/upsert` sur
  `api.crm.or-web.fr`. La déduplication est déjà gérée côté serveur.
- **RGPD** — case de consentement, mentions, et si l'e-mail part en séquence
  commerciale, lien de désinscription fonctionnel.

---

## 10. Ce qu'on réutilise

- **`crm-web/public/tools/devis_orweb.html`** — le configurateur, source de
  vérité de l'offre. Une version publique allégée ferait un excellent
  simulateur de prix sur `/tarifs`.
- **`scrappo/config.json`** — les 128 secteurs, pour les pages métier.
- **`scrappo/data/communes_fr.json`** — les communes, pour les pages ville.
- **Le playbook** — les objections et le vocabulaire, déjà éprouvés au téléphone.

---

## 11. Comment on mesurera

- **Appels reçus** depuis le site (numéro de suivi ou clics `tel:`)
- **Formulaires envoyés**, et leur transformation en leads dans le CRM
- **Positions** sur « site internet [métier] [ville] » pour les pages créées
- **Taux de rebond mobile** sur l'accueil
- **Taux de closing** des prospects ayant consulté le site avant l'appel,
  comparé aux autres — mesurable dans le CRM via la timeline

---

## 12. À trancher avant de commencer

1. **Publie-t-on les prix ?** Recommandation : oui, au moins le pack Vitrine.
   C'est l'argument différenciant, le cacher revient à se présenter comme une
   agence classique.
2. **La grille est-elle figée ?** Le configurateur la dit « encore flexible ».
3. **Quel engagement affiche-t-on ?** Le configurateur mentionne 12 mois
   indicatifs — à confirmer, et à écrire noir sur blanc.
4. **Vanilla ou générateur statique ?** Dépend du nombre de pages visé.
5. **Combien de réalisations peut-on montrer ?** Sans preuve, le reste porte moins.
6. **Garde-t-on « Premium » dans le positionnement ?** Il entre en tension avec
   « à partir de 19 €/mois ». Recommandation : troquer *premium* contre
   *professionnel*, et *sur mesure* contre *prêt à l'emploi, adapté à votre métier*.

---

## Limites de ce brief

Il s'appuie sur le code, le configurateur, le playbook et les données CRM.
**Il ne contient aucune donnée de performance réelle** : pas de trafic actuel,
pas de taux de conversion, pas de retour client, pas d'analyse concurrentielle.
Les recommandations de message reposent sur la cohérence interne offre / cible /
canal, pas sur des tests. À confronter à ce que tu observes au téléphone.
