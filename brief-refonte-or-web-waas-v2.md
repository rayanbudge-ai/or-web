# Brief — refonte du site or-web.fr (v2)

**Objet** : faire passer la vitrine du positionnement « agence web premium sur
mesure » au modèle **WaaS** (Website as a Service), avec affichage public des
tarifs **et de l'engagement contractuel**.

**Périmètre** : `orweb/site` uniquement. **Le CRM n'est pas concerné** — ni
`orweb/crm`, ni le VPS, ni la base de prospection. Aucune modification de ce
dépôt ne doit en dépendre.

Date : 19/08/2026 · Version 2 · Source des tarifs :
`crm-web/public/tools/devis_orweb.html`

---

## 0. Ce qui change par rapport à la v1

La v1 traitait l'engagement 12 mois comme une simple mention de bas de grille.
C'est en réalité **le fait structurant de l'offre** : le client ne s'abonne pas,
il signe un contrat d'un an. Conséquences reprises dans tout le document :

- La comparaison « 180 € pour démarrer contre 2 000–4 000 € d'un coup » est
  **fausse et juridiquement risquée**. Le client ne s'engage pas à 180 €, il
  s'engage à 528 €. Corrigé au §2.
- La colonne « 1ʳᵉ année » n'est plus un geste de transparence : c'est **le
  montant contractuellement dû**. Renommée et rendue structurante au §3.
- Une **règle d'affichage** interdit désormais de faire apparaître « 29 €/mois »
  seul, où que ce soit sur le site (§3).
- Les conditions de sortie passent de « à trancher » à **bloquantes** : sans
  elles, le site ne peut pas être écrit (§2 et §8).
- Nouveau **§9 — obligations contractuelles et précontractuelles**, dont le
  droit de rétractation qui s'applique probablement à la prospection
  téléphonique actuelle.
- La structure de page gagne une **section « Engagement et sortie » à part
  entière**, sortie de la FAQ (§4).

---

## 1. Le problème à résoudre

Le site actuel dit : **« Agence Web Premium à Bordeaux · Sites sur mesure »**.
Il n'affiche **aucun prix**, propose « Découverte → Design → Développement →
Lancement », et vend quatre lignes : Sites Vitrines, E-Commerce, Applications
Web, SEO & Performance.

C'est un site de vente au projet. Or l'offre réelle est devenue un abonnement à
**29 €/mois pour une vitrine, avec engagement de 12 mois**. Les deux ne peuvent
pas cohabiter :

| | Ancien modèle | Nouveau modèle |
|---|---|---|
| Facturation | Devis unique, quelques milliers d'euros | Frais de démarrage + mensuel |
| Engagement | Livraison, puis plus rien | **12 mois fermes**, service continu |
| Ce que signe le client | Un devis | **Un contrat de prestation à durée déterminée** |
| Cible | Entreprises avec budget projet | TPE/PME, artisans, commerces |
| Décision | Plusieurs semaines, plusieurs interlocuteurs | Un appel, un gérant |
| Rôle du site | Rassurer, montrer le savoir-faire | **Qualifier, lever l'objection de l'engagement, faire prendre RDV** |

Un artisan qui cherche un site à 30 €/mois et qui atterrit sur « agence
premium sur mesure » se dit que ce n'est pas pour lui et ferme l'onglet. C'est
le taux de rebond qu'on vient corriger.

### La tension à ne pas esquiver

Le prix d'appel (29 €/mois) suggère une décision légère, réversible, qu'on
prend en deux minutes. L'engagement (12 mois fermes, 528 €) est une décision
lourde, qui se prend une fois. **Le site doit porter les deux en même temps.**

La tentation est de mettre « 29 €/mois » en gros et l'engagement en note de bas
de page. C'est exactement ce qui produit des litiges, des impayés au 4ᵉ mois et
des avis Google à une étoile. Sur une cible d'artisans locaux à Bordeaux, où la
réputation circule par le bouche-à-oreille, c'est un risque commercial
supérieur au gain de conversion.

**Règle de conception** : un visiteur qui n'aurait lu que le hero et la grille
tarifaire doit déjà savoir qu'il s'engage un an et pour combien au total.

---

## 2. Le changement de modèle à raconter

### Ce qui change vraiment pour le client

L'ancien modèle vendait un **livrable**. Le nouveau vend un **service continu
sur une durée déterminée**. C'est l'argument central de toute la page :

> Vous ne payez pas un site. Vous payez le fait d'avoir un site qui marche,
> tous les mois, sans vous en occuper. On s'engage un an, vous aussi.

La seconde phrase n'est pas une concession, c'est un argument : l'engagement
est **réciproque**. Le prestataire ne peut pas lâcher le client en cours de
route non plus. À formuler ainsi plutôt que de subir le sujet.

Ce que couvre le mensuel, et qui n'existait pas avant :
- hébergement et nom de domaine
- certificat HTTPS et renouvellements
- mises à jour mineures (horaires, tarifs, photos, textes)
- sauvegardes
- correction des pannes
- suivi d'audience

> **À cadrer avant rédaction** : « mises à jour mineures » doit être quantifié.
> Sans limite écrite (nombre de demandes par mois, ou volume horaire), c'est la
> ligne qui rend le contrat non rentable sur 12 mois. Proposition :
> *2 demandes de modification par mois, traitées sous 72 h ouvrées.*

### Pourquoi c'est un meilleur deal pour un artisan

**⚠️ L'argumentaire de la v1 était faux.** Il opposait « 180 € pour démarrer » à
« 2 000 à 4 000 € d'un coup ». Avec un engagement de 12 mois, le client ne
s'engage pas à 180 € : **il s'engage à 528 €**. Comparer 180 € à 2 500 € est une
comparaison trompeuse, et c'est précisément le type de formulation qui se
retourne contre soi en cas de litige.

La comparaison honnête se fait **à durée égale, coûts récurrents inclus des deux
côtés** :

| Durée | Pack Vitrine Or-Web | Site classique (2 500 € + héberg./maintenance ~20 €/mois) |
|---|---:|---:|
| 1 an | **528 €** | 2 740 € |
| 3 ans | **1 224 €** | 3 220 € |
| 5 ans | **1 920 €** | 3 700 € |

L'argument tient largement — mais il tient parce qu'on compare ce qui est
comparable, pas parce qu'on cache la moitié du prix. Et il faut assumer la
contrepartie à l'écrit : **avec le modèle classique, le client possède son
site ; ici, il paie un service tant qu'il le paie.** C'est ce que la section
suivante doit traiter.

Formulation recommandée pour le site :

> Un site classique, c'est 2 500 € à sortir d'un coup — puis un site qui vieillit
> parce que personne n'y touche. Ici, c'est 180 € pour démarrer et 29 €/mois
> pendant 12 mois, soit **528 € la première année**, et un site qui reste à jour
> tant que vous êtes chez nous.

### L'objection à traiter frontalement

> « Et si j'arrête, je perds tout ? »

Avec un engagement d'un an, cette objection n'est plus un point de FAQ : c'est
**le principal frein à la signature**. Elle doit avoir sa propre section sur la
page, avec des réponses écrites noir sur blanc — pas seulement au téléphone.

**Points bloquants — le site ne peut pas être rédigé tant qu'ils ne sont pas
tranchés.** Ce ne sont pas des détails de rédaction : ce sont des clauses
contractuelles dont dépend le texte de la page.

| Question | Proposition par défaut | Statut |
|---|---|---|
| Que se passe-t-il à la fin des 12 mois ? | **Reconduction au mois, sans engagement, résiliable avec 30 jours de préavis.** L'engagement ne porte que sur la 1ʳᵉ année. C'est l'option la plus vendable et celle qui évite les contentieux de tacite reconduction. | À valider |
| Résiliation anticipée ? | **Le solde des mensualités restantes est dû.** C'est la contrepartie normale d'un engagement ferme, mais ça doit être écrit avant signature, pas découvert après. | À valider |
| Le client peut-il racheter son site ? | **Oui, à partir du 12ᵉ mois, contre un forfait de rachat** (montant à fixer — ordre de grandeur cohérent : 3 à 6 mois d'abonnement). Livraison des fichiers, sans le service. | À chiffrer |
| Qui détient le nom de domaine ? | **Le domaine est déposé au nom du client** (ou transféré gratuitement à sa demande en fin de contrat). Point de différenciation fort face aux offres qui retiennent le domaine en otage. | À valider |
| Que devient le site en cas de non-paiement ? | Mise en demeure, puis suspension après X jours. Distinct de la résiliation. | À définir |

Une fois tranchés, ces points alimentent **la section « Engagement et sortie »
du site et les CGV** — les deux doivent dire exactement la même chose.

---

## 3. Les tarifs à afficher

Tous les packs incluent : **design pro, responsive mobile, formulaire de
contact, SEO de base, HTTPS, hébergement, mises à jour mineures, statistiques**.

**Engagement : 12 mois fermes. Prix HT.** Cette mention accompagne chaque
grille, pas seulement la première.

### Grille principale

La colonne de droite n'est pas une estimation : c'est **le montant total dû au
titre de l'engagement**.

| Pack | Pour qui | Démarrage | Par mois | **Total engagé (12 mois)** |
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

*(Totaux vérifiés : démarrage + mensuel × 12. Ils doivent être **calculés**, pas
saisis à la main — voir §5.)*

> **La colonne « Total engagé » est obligatoire et non négociable.** Afficher
> « 29 €/mois » seul, alors que le client signe pour 528 €, ne relève plus de
> l'imprécision commerciale : c'est une omission d'information substantielle sur
> le prix total. La montrer coûte quelques conversions et évite les litiges, les
> avis négatifs, les impayés au 4ᵉ mois et les demandes de résiliation qu'on ne
> peut pas accorder.

### Règle d'affichage du prix — s'applique partout sur le site

Un prix mensuel ne peut **jamais** apparaître seul. Partout où « 29 €/mois »
s'affiche — hero, cartes, comparateur, FAQ, meta description, balise title,
Open Graph, futures publicités — le bloc complet doit être visible **sans
interaction et sans défilement supplémentaire** :

```
180 € à la mise en service, puis 29 €/mois
Engagement 12 mois · 528 € la première année · Prix HT
```

Ceci est une contrainte d'implémentation, pas une recommandation de rédaction :
le composant de prix doit rendre techniquement impossible l'affichage du mensuel
sans son contexte.

### Ce qui se passe après 12 mois

À afficher explicitement dans la grille ou juste en dessous, selon l'arbitrage
du §2 :

> Au-delà de 12 mois, l'abonnement continue au même tarif, sans engagement,
> résiliable à tout moment avec 30 jours de préavis.

Si un autre arbitrage est retenu (reconduction ferme de 12 mois, tarif
différent), il doit apparaître au même endroit, avec la même visibilité.

### Options courantes

Les options à mensuel récurrent s'ajoutent au total engagé — la ligne
« Total engagé » du pack doit se recalculer quand une option est sélectionnée.

| Option | Démarrage | Par mois | Impact sur 12 mois |
|---|---:|---:|---:|
| Rédaction jusqu'à 5 pages | 79 € | — | +79 € |
| Rédaction jusqu'à 10 pages | 129 € | — | +129 € |
| Logo simple | 49 € | — | +49 € |
| Banque d'images pro | 19 € | — | +19 € |
| Design premium / direction artistique | 90 € | 5 € | +150 € |
| Pages supplémentaires (jusqu'à 10) | 40 € | 5 € | +100 € |

### Automatisations n8n

À présenter comme un **étage au-dessus**, pas comme une option de départ. La
cible n'est pas la même : entreprise qui reçoit déjà du volume et perd des
demandes.

| Pack | Démarrage | Par mois | Impact sur 12 mois |
|---|---:|---:|---:|
| n8n Starter — capture de leads, notifications | 99 € | 15 € | +279 € |
| n8n Pro — scénarios avancés | 199 € | 29 € | +547 € |
| Parcours RDV + devis automatique | 120 € | 19 € | +348 € |

> **À trancher** : les automatisations suivent-elles l'engagement 12 mois du
> site, ou sont-elles résiliables séparément ? Un client qui veut couper n8n
> sans couper son site doit savoir s'il le peut. Recommandation : résiliables
> indépendamment au mois, ce qui les rend beaucoup plus faciles à vendre en
> upsell en cours de contrat.

---

## 4. Ce que devient le site

### Structure de page proposée

1. **Accroche** — la promesse en une phrase et le prix complet visible sans
   défilement. *« Un site professionnel, en ligne en 7 jours. 180 € à la mise en
   service puis 29 €/mois, engagement 12 mois — soit 528 € la première année. »*
   Plus long que la version v1, volontairement. C'est le prix de l'honnêteté, au
   sens propre.
2. **Le problème** — trois situations que le visiteur reconnaît : pas de site,
   site à l'abandon depuis 2019, site qui ne marche pas sur mobile.
3. **Ce qui est inclus tous les mois** — la liste du §2, c'est le cœur de l'offre.
4. **Les tarifs** — grille complète, colonne « Total engagé » incluse, sans
   formulaire à remplir pour y accéder.
5. **Engagement et sortie** — *nouvelle section, sortie de la FAQ.* Durée,
   ce qui se passe au bout d'un an, résiliation anticipée, propriété du domaine,
   rachat du site. Placée **immédiatement après les tarifs**, pas en fin de page :
   c'est la question que le visiteur se pose à la seconde où il voit le prix.
   Lien vers les CGV complètes.
6. **Choisir son pack** — aide au choix par métier plutôt que par fonctionnalité.
7. **Réalisations** — conservées du site actuel.
8. **Questions fréquentes** — délais, contenu fourni par le client, modifications
   incluses, référencement. La FAQ ne porte plus l'engagement (section 5), elle
   peut y renvoyer.
9. **Prise de contact** — un seul appel à l'action, répété.

### Ce qu'il faut retirer

- **« Agence Web Premium »** et **« sur mesure »** — en contradiction directe
  avec un abonnement à 29 €/mois.
- **« Applications Web »** — hors modèle WaaS. Soit on le sort, soit on le
  bascule en ligne « sur devis » clairement séparée de la grille.
- **Le tunnel « Découverte → Design → Développement → Lancement »** — c'est un
  discours de projet long. Le remplacer par un délai concret : *« Vous
  remplissez un formulaire, votre site est en ligne en 7 jours. »*
  *(À confirmer : quel délai réel tiens-tu ? Un délai annoncé sur le site devient
  contractuel — 7 jours non tenus sur un contrat d'un an, c'est le premier motif
  de contestation.)*

### Ce qu'il ne faut pas faire

- Pas de compte à rebours, de « offre limitée », ni de « plus que 3 places » sur
  une page qui vend un engagement d'un an. La pression à l'achat sur un contrat
  de durée est ce qui transforme un client en plaignant.
- Pas de mensuel affiché sans son total (§3).
- Pas de « sans engagement » ni de « résiliable à tout moment » dans le corps de
  page tant que l'engagement est de 12 mois — y compris dans les formulations
  approximatives type « vous restez libre ».

### Ton

Direct, concret, sans jargon. Le lecteur est un plombier ou une esthéticienne,
pas un directeur marketing. Bannir « solutions digitales », « écosystème »,
« expérience utilisateur ». Préférer « votre site », « vos clients vous
trouvent », « on s'occupe de tout ».

Sur l'engagement en particulier : ton factuel, phrases courtes, pas de
circonvolutions. *« Vous vous engagez 12 mois. Au bout d'un an, vous êtes
libre. »* Toute tentative d'adoucir la formulation la rend suspecte.

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

**Contraintes ajoutées par l'engagement**

- Le fichier de données porte, pour chaque pack : `demarrage`, `mensuel`,
  `duree_engagement_mois`, et **le total est calculé au build** — jamais saisi.
  Un total désynchronisé du mensuel affiché est une erreur de prix opposable, pas
  un bug d'affichage.
- Un **composant de prix unique**, utilisé partout, qui rend impossible
  l'affichage du mensuel sans le bloc complet du §3. Pas de prix écrit en dur
  dans le HTML, y compris dans le hero.
- Les mentions d'engagement (durée, conditions de sortie) vivent dans le **même
  fichier de données** que les prix. Elles changeront en même temps.
- **Versionner la grille avec une date d'effet.** En cas de contestation, il faut
  pouvoir établir ce qui était affiché le jour de la signature. L'historique git
  du fichier de données suffit, à condition que le fichier soit unique et que les
  commits de changement de prix soient identifiables.
- Les CGV doivent être **accessibles depuis la page de tarifs et depuis le
  formulaire de contact**, en une page dédiée indexable, pas dans une modale.

---

## 6. Cohérence avec le configurateur de devis

Les tarifs de ce brief viennent de `crm-web/public/tools/devis_orweb.html`. Ce
fichier est **la source de vérité** et il vit dans le dépôt du CRM.

Deux grilles vont donc coexister : celle du site public et celle du
configurateur utilisé par les prospecteurs. **Elles vont diverger.**

Avec un engagement contractuel, la divergence change de gravité. Un écart de
prix entre le site et le devis se rattrape par un geste commercial. **Un écart
sur la durée d'engagement ou les conditions de sortie est un vice du
consentement** : le client a signé sur la foi de ce qu'affichait le site.

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

**Quelle que soit l'option retenue** : le configurateur de devis doit afficher
lui aussi le total engagé sur 12 mois, dans les mêmes termes que le site. Un
prospect qui reçoit un devis mentionnant seulement le mensuel, après avoir vu un
site qui affiche le total, aura raison de trouver ça incohérent.

---

## 7. Hors périmètre

- Toute modification du CRM, de son API, de sa base ou de son déploiement.
- Le branchement du formulaire de contact sur le CRM. C'est tentant — un
  visiteur qui remplit le formulaire deviendrait un lead automatiquement — mais
  ça crée une dépendance entre les deux projets. **À traiter comme un chantier
  distinct**, une fois la refonte livrée et stabilisée.
- Le moteur d'emailing du CRM.
- **La rédaction des CGV et du contrat type.** Ce n'est pas un chantier de
  développement, mais c'est un **prérequis bloquant** : le contenu de la section
  « Engagement et sortie » en découle mot pour mot. À traiter en parallèle, pas
  après.

---

## 8. À valider avant de commencer

**Bloquants — la rédaction ne peut pas démarrer sans**

- [ ] Conditions de fin de contrat : reconduction (au mois ? ferme ?), rachat du
      site et son prix, propriété du nom de domaine
- [ ] Conditions et coût de résiliation anticipée
- [ ] Périmètre chiffré des « mises à jour mineures » incluses
- [ ] Délai de mise en ligne réellement tenable (il devient contractuel)
- [ ] CGV rédigées, ou au minimum leurs clauses de durée et de sortie

**Importants**

- [ ] Les prix sont-ils HT ou TTC sur le site ? *(cible pro → HT, mais à afficher explicitement, et à trancher pour les clients non assujettis)*
- [ ] Les automatisations n8n suivent-elles l'engagement du site ou sont-elles résiliables à part ?
- [ ] « Applications Web » : retiré ou conservé en ligne sur devis ?
- [ ] Option retenue pour la synchronisation des tarifs (§6)
- [ ] Existe-t-il des contrats déjà signés sous l'ancien modèle projet ? Si oui, la nouvelle page ne doit pas les contredire

---

## 9. Obligations liées à l'engagement

*Cette section signale des points à faire vérifier. Je ne suis pas juriste et
ces éléments ne constituent pas un avis juridique — ils méritent une
confirmation avant la mise en ligne, d'autant que le coût d'une vérification est
sans commune mesure avec celui d'un litige sur une trentaine de contrats.*

### Information précontractuelle

Sur un contrat à durée déterminée, le prix total de l'engagement, la durée, les
modalités de reconduction et les conditions de résiliation font partie des
informations que le client doit avoir **avant de signer**. Les afficher sur le
site n'est donc pas seulement une bonne pratique commerciale : c'est la façon la
plus simple de prouver qu'elles ont été communiquées.

### Droit de rétractation — point à vérifier en priorité

Le code de la consommation étend certaines protections, dont un délai de
rétractation de 14 jours, à des **professionnels employant 5 salariés ou moins**
lorsque le contrat est conclu hors établissement et que son objet n'entre pas
dans le champ de leur activité principale.

C'est très exactement la situation de la cible : un plombier ou un coiffeur de
moins de 5 salariés, démarché par téléphone, qui signe un contrat de création de
site. **Si ce régime s'applique, un contrat signé sans mention du droit de
rétractation est fragile** — et le délai peut être prolongé à défaut
d'information.

À faire confirmer, et le cas échéant : mention sur le site, dans le contrat, et
formulaire de rétractation joint.

### Reconduction tacite

C'est un argument de plus en faveur de la reconduction **au mois sans
engagement** recommandée au §2 : elle supprime le sujet. Une reconduction ferme
de 12 mois supplémentaires impose un mécanisme d'information préalable du client
et ouvre un terrain de contestation dont l'offre n'a pas besoin.

### Ce que ça implique pour le site

- Page CGV dédiée, indexable, accessible depuis les tarifs et le formulaire
- Case à cocher explicite d'acceptation des CGV au moment de la prise de contact
  si celle-ci vaut engagement (sinon, au moment de la signature)
- Mentions légales à jour : identité, SIREN, TVA, médiateur de la consommation
  le cas échéant
- Conservation de la preuve de ce qui était affiché à la date de signature (§5)
