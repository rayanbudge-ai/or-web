# Brief — refonte du site or-web.fr

**Objet** : faire passer la vitrine du positionnement « agence web premium sur
mesure » au modèle **WaaS** (Website as a Service), avec affichage public des
tarifs.

**Périmètre** : `orweb/site` uniquement. **Le CRM n'est pas concerné** — ni
`orweb/crm`, ni le VPS, ni la base de prospection. Aucune modification de ce
dépôt ne doit en dépendre.

Date : 17/08/2026 · Source des tarifs : `crm-web/public/tools/devis_orweb.html`

---

## 1. Le problème à résoudre

Le site actuel dit : **« Agence Web Premium à Bordeaux · Sites sur mesure »**.
Il n'affiche **aucun prix**, propose « Découverte → Design → Développement →
Lancement », et vend quatre lignes : Sites Vitrines, E-Commerce, Applications
Web, SEO & Performance.

C'est un site de vente au projet. Or l'offre réelle est devenue un abonnement à
**29 €/mois pour une vitrine**. Les deux ne peuvent pas cohabiter :

| | Ancien modèle | Nouveau modèle |
|---|---|---|
| Facturation | Devis unique, quelques milliers d'euros | Acompte + mensuel |
| Engagement | Livraison, puis plus rien | 12 mois, service continu |
| Cible | Entreprises avec budget projet | TPE/PME, artisans, commerces |
| Décision | Plusieurs semaines, plusieurs interlocuteurs | Un appel, un gérant |
| Rôle du site | Rassurer, montrer le savoir-faire | **Qualifier et faire prendre RDV** |

Un artisan qui cherche un site à 30 €/mois et qui atterrit sur « agence
premium sur mesure » se dit que ce n'est pas pour lui et ferme l'onglet. C'est
le taux de rebond qu'on vient corriger.

---

## 2. Le changement de modèle à raconter

### Ce qui change vraiment pour le client

L'ancien modèle vendait un **livrable**. Le nouveau vend un **service continu**.
C'est l'argument central de toute la page :

> Vous ne payez pas un site. Vous payez le fait d'avoir un site qui marche,
> tous les mois, sans vous en occuper.

Ce que couvre le mensuel, et qui n'existait pas avant :
- hébergement et nom de domaine
- certificat HTTPS et renouvellements
- mises à jour mineures (horaires, tarifs, photos, textes)
- sauvegardes
- correction des pannes
- suivi d'audience

### Pourquoi c'est un meilleur deal pour un artisan

Un site classique coûte 2 000 à 4 000 € d'un coup, puis vieillit sans que
personne n'y touche. Ici, **180 € pour démarrer** et le site reste à jour tant
que l'abonnement court. C'est l'argument à mettre en avant, chiffres à l'appui.

### L'objection à traiter frontalement

> « Et si j'arrête, je perds tout ? »

Il faut y répondre **sur le site**, pas seulement au téléphone. Le brief impose
une section dédiée : que devient le site en fin de contrat, qui possède le nom
de domaine, quelles conditions de sortie. Ne pas l'écrire alimente le soupçon.

**À trancher avant rédaction** — ces points ne sont documentés nulle part :
- [ ] Que se passe-t-il à la fin des 12 mois ? Reconduction tacite, mensuel sans engagement, ou arrêt ?
- [ ] Le client peut-il racheter son site ? À quel prix ?
- [ ] Qui détient le nom de domaine ?
- [ ] Y a-t-il des frais de résiliation anticipée ?

---

## 3. Les tarifs à afficher

Tous les packs incluent : **design pro, responsive mobile, formulaire de
contact, SEO de base, HTTPS, hébergement, mises à jour mineures, statistiques**.

Engagement **12 mois**. Prix HT.

### Grille principale

| Pack | Pour qui | Démarrage | Par mois | **1ʳᵉ année** |
|---|---|---:|---:|---:|
| **Landing** — 1 page | Test, événement, lancement | 120 € | 19 € | **348 €** |
| **Vitrine** ⭐ *le plus vendu* | 1 à 5 pages, cas général | 180 € | 29 € | **528 €** |
| **Portfolio** | Photographe, architecte, artisan d'art | 220 € | 35 € | **640 €** |
| **Local SEO** | Artisans qui veulent être trouvés | 220 € | 39 € | **688 €** |
| **Resto & food** | Bar, traiteur, pizzeria, food truck | 230 € | 39 € | **698 €** |
| **RDV & beauté** | Coiffeur, institut, santé, coach | 240 € | 39 € | **708 €** |
| **Refonte** | Site existant daté ou cassé | 250 € | 35 € | **670 €** |
| **Pro+** | Jusqu'à 10 pages, blog, multi-services | 280 € | 49 € | **868 €** |
| **Vitrine + Auto** | Volume de demandes, automatisations | 320 € | 59 € | **1 028 €** |
| **E-commerce** | Boutique, 25 produits | 450 € | 79 € | **1 398 €** |
| **E-commerce Pro** | 100 produits, variantes, stock | 590 € | 99 € | **1 778 €** |

> **La colonne « 1ʳᵉ année » est obligatoire.** Afficher « 29 €/mois » seul, sans
> le coût réel de l'engagement, est une pratique trompeuse. La montrer coûte
> quelques conversions et évite les litiges, les avis négatifs et les impayés.
> C'est aussi ce qui distingue une offre honnête d'un piège à abonnement.

### Options courantes

| Option | Démarrage | Par mois |
|---|---:|---:|
| Rédaction jusqu'à 5 pages | 79 € | — |
| Rédaction jusqu'à 10 pages | 129 € | — |
| Logo simple | 49 € | — |
| Banque d'images pro | 19 € | — |
| Design premium / direction artistique | 90 € | 5 € |
| Pages supplémentaires (jusqu'à 10) | 40 € | 5 € |

### Automatisations n8n

À présenter comme un **étage au-dessus**, pas comme une option de départ. La
cible n'est pas la même : entreprise qui reçoit déjà du volume et perd des
demandes.

| Pack | Démarrage | Par mois |
|---|---:|---:|
| n8n Starter — capture de leads, notifications | 99 € | 15 € |
| n8n Pro — scénarios avancés | 199 € | 29 € |
| Parcours RDV + devis automatique | 120 € | 19 € |

---

## 4. Ce que devient le site

### Structure de page proposée

1. **Accroche** — la promesse en une phrase et le prix d'entrée visible sans
   défilement. *« Un site professionnel, en ligne en 7 jours, à partir de
   180 € puis 29 €/mois. »*
2. **Le problème** — trois situations que le visiteur reconnaît : pas de site,
   site à l'abandon depuis 2019, site qui ne marche pas sur mobile.
3. **Ce qui est inclus tous les mois** — la liste du §2, c'est le cœur de l'offre.
4. **Les tarifs** — grille complète, sans formulaire à remplir pour y accéder.
5. **Choisir son pack** — aide au choix par métier plutôt que par fonctionnalité.
6. **Réalisations** — conservées du site actuel.
7. **Questions fréquentes** — engagement, sortie, propriété, délais.
8. **Prise de contact** — un seul appel à l'action, répété.

### Ce qu'il faut retirer

- **« Agence Web Premium »** et **« sur mesure »** — en contradiction directe
  avec un abonnement à 29 €/mois.
- **« Applications Web »** — hors modèle WaaS. Soit on le sort, soit on le
  bascule en ligne « sur devis » clairement séparée de la grille.
- **Le tunnel « Découverte → Design → Développement → Lancement »** — c'est un
  discours de projet long. Le remplacer par un délai concret : *« Vous
  remplissez un formulaire, votre site est en ligne en 7 jours. »*
  *(À confirmer : quel délai réel tiens-tu ?)*

### Ton

Direct, concret, sans jargon. Le lecteur est un plombier ou une esthéticienne,
pas un directeur marketing. Bannir « solutions digitales », « écosystème »,
« expérience utilisateur ». Préférer « votre site », « vos clients vous
trouvent », « on s'occupe de tout ».

---

## 5. Contraintes techniques

Stack actuelle à conserver — elle fonctionne et n'est pas le sujet :

- HTML/CSS/JS **vanilla**, Express minimal (`server.js`)
- SSR léger : injection des balises meta par route dans `frontend/index.html`
- `build-pages.js` / `build.js` pour la génération
- `nodemailer` pour le formulaire de contact
- Déploiement Render

**Points de vigilance**

- Le site est hébergé sur Render, à l'IP `216.24.57.1`. Le CRM vit désormais sur
  un VPS séparé (`crm.or-web.fr`). **Ne toucher à aucun enregistrement DNS**
  autre que ceux de la vitrine.
- La grille tarifaire doit vivre dans **un seul fichier de données**, pas
  dispersée dans le HTML. Les prix bougeront.
- Vérifier que les identifiants SMTP de `nodemailer` ne sont pas dans un fichier
  versionné.

---

## 6. Cohérence avec le configurateur de devis

Les tarifs de ce brief viennent de `crm-web/public/tools/devis_orweb.html`. Ce
fichier est **la source de vérité** et il vit dans le dépôt du CRM.

Deux grilles vont donc coexister : celle du site public et celle du
configurateur utilisé par les prospecteurs. **Elles vont diverger.**

Trois options, à trancher :

1. **Recopier les prix dans le site** et se donner une règle : toute
   modification du configurateur déclenche une mise à jour du site. Simple,
   mais repose sur la discipline.
2. **Extraire la grille dans un JSON partagé**, consommé par les deux. Propre,
   mais crée un couplage entre les deux dépôts.
3. **Le site n'affiche que les packs principaux** (Landing, Vitrine, Pro+,
   E-commerce) et renvoie au devis pour le détail. Réduit la surface de
   divergence.

*Recommandation : option 3 pour démarrer, option 2 si les prix bougent souvent.*

---

## 7. Hors périmètre

- Toute modification du CRM, de son API, de sa base ou de son déploiement.
- Le branchement du formulaire de contact sur le CRM. C'est tentant — un
  visiteur qui remplit le formulaire deviendrait un lead automatiquement — mais
  ça crée une dépendance entre les deux projets. **À traiter comme un chantier
  distinct**, une fois la refonte livrée et stabilisée.
- Le moteur d'emailing du CRM.

---

## 8. À valider avant de commencer

- [ ] Conditions de fin de contrat (reconduction, rachat, propriété du domaine)
- [ ] Délai de mise en ligne annoncé
- [ ] Les prix sont-ils HT ou TTC sur le site ? *(cible pro → HT, mais à afficher explicitement)*
- [ ] « Applications Web » : retiré ou conservé en ligne sur devis ?
- [ ] Option retenue pour la synchronisation des tarifs (§6)
- [ ] Faut-il des CGV distinctes du modèle projet précédent ?
