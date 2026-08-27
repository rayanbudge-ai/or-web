/* Informations légales affichées sur or-web.fr.
   Source de vérité unique : mentions légales et politique de confidentialité sont
   régénérées depuis ce fichier par build-pages.js à chaque `npm run build`.

   Entreprise individuelle immatriculée le 01/05/2023 (SIREN 923 407 324) :
   - pas de capital social — une EI n'en a pas ;
   - pas de RCS — activité libérale (APE 7022Z), immatriculation au RNE seul ;
   - franchise en base de TVA — d'où `tva` vide et la mention 293 B à la place.

   Passage à l'assujettissement à la TVA : renseigner `tva` avec 'FR51923407324'.
   La ligne TVA bascule alors toute seule du régime 293 B vers le n° intracommunautaire
   (voir legalIdentityBlock() dans build-pages.js) — aucune autre modification requise. */
module.exports = {
  siteName: 'OR-Web',
  tagline: 'Agence web premium',

  /* Éditeur personne physique : la LCEN (art. 6 III-1 a) impose nom, prénom et domicile.
     La mention « EI » accolée au nom est obligatoire depuis le 15/05/2022. */
  legalName: 'Rayan Ouali',
  legalForm: 'Entrepreneur individuel (EI)',
  address: '3 avenue Louis Barthou, 33000 Bordeaux, France',

  email: 'contact@or-web.fr',
  phone: '+33 6 49 95 12 25',

  siren: '923 407 324',
  siret: '923 407 324 00014',
  rcs: '',
  tva: '',
  tvaMention: 'TVA non applicable, article 293 B du CGI',
  capital: '',

  publisher: 'Rayan Ouali',
  host: {
    name: 'Render Services, Inc.',
    address: '525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis',
    website: 'https://render.com',
  },
};
