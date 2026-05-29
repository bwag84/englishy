'use strict';

// ── Vocab cards ────────────────────────────────────────────────────────────────

const vocabCards = [

  // BAKERY (~13)
  { id:'vocab:boulangerie', type:'vocab', category:'bakery', fr:'la boulangerie', en:'bakery', example:'Il y a une boulangerie au coin.' },
  { id:'vocab:baguette', type:'vocab', category:'bakery', fr:'la baguette', en:'baguette', example:"Une baguette, s'il vous plaît." },
  { id:'vocab:pain', type:'vocab', category:'bakery', fr:'le pain', en:'bread', example:'Je voudrais du pain.' },
  { id:'vocab:croissant', type:'vocab', category:'bakery', fr:'le croissant', en:'croissant', example:"Deux croissants, s'il vous plaît." },
  { id:'vocab:gateau', type:'vocab', category:'bakery', fr:'le gâteau', en:'cake', example:'Ce gâteau est délicieux.' },
  { id:'vocab:tarte', type:'vocab', category:'bakery', fr:'la tarte', en:'tart/pie', example:'Une tarte aux pommes.' },
  { id:'vocab:patisserie', type:'vocab', category:'bakery', fr:'la pâtisserie', en:'pastry shop', example:'La pâtisserie est fermée.' },
  { id:'vocab:brioche', type:'vocab', category:'bakery', fr:'la brioche', en:'brioche', example:"Une brioche, s'il vous plaît." },
  { id:'vocab:farine', type:'vocab', category:'bakery', fr:'la farine', en:'flour', example:'Du pain à la farine complète.' },
  { id:'vocab:tranche', type:'vocab', category:'bakery', fr:'la tranche', en:'slice', example:'Une tranche de cake.' },
  { id:'vocab:frais', type:'vocab', category:'bakery', fr:'frais / fraîche', en:'fresh', example:'Le pain est frais.' },
  { id:'vocab:chaud', type:'vocab', category:'bakery', fr:'chaud', en:'warm/hot', example:'Le croissant est encore chaud.' },
  { id:'vocab:sachet', type:'vocab', category:'bakery', fr:'un sachet', en:'bag (small)', example:"Dans un sachet, s'il vous plaît." },

  // CAFÉ & DRINKS (~13)
  { id:'vocab:cafe', type:'vocab', category:'cafe', fr:'le café', en:'coffee / café', example:"Un café, s'il vous plaît." },
  { id:'vocab:the', type:'vocab', category:'cafe', fr:'le thé', en:'tea', example:'Un thé au lait.' },
  { id:'vocab:eau', type:'vocab', category:'cafe', fr:"l'eau", en:'water', example:"De l'eau, s'il vous plaît." },
  { id:'vocab:jus', type:'vocab', category:'cafe', fr:"le jus d'orange", en:'orange juice', example:"Un jus d'orange pressé." },
  { id:'vocab:biere', type:'vocab', category:'cafe', fr:'la bière', en:'beer', example:'Une bière pression.' },
  { id:'vocab:vin', type:'vocab', category:'cafe', fr:'le vin', en:'wine', example:'Un verre de vin rouge.' },
  { id:'vocab:limonade', type:'vocab', category:'cafe', fr:'la limonade', en:'lemonade/lemon soda', example:'Une limonade bien fraîche.' },
  { id:'vocab:terrasse', type:'vocab', category:'cafe', fr:'la terrasse', en:'terrace/outdoor seating', example:"On s'assied en terrasse?" },
  { id:'vocab:addition', type:'vocab', category:'cafe', fr:"l'addition", en:'the bill', example:"L'addition, s'il vous plaît." },
  { id:'vocab:pourboire', type:'vocab', category:'cafe', fr:'le pourboire', en:'tip (gratuity)', example:'Le pourboire est inclus.' },
  { id:'vocab:sucre', type:'vocab', category:'cafe', fr:'le sucre', en:'sugar', example:'Sans sucre, merci.' },
  { id:'vocab:lait', type:'vocab', category:'cafe', fr:'le lait', en:'milk', example:"Avec du lait, s'il vous plaît." },
  { id:'vocab:glace', type:'vocab', category:'cafe', fr:'la glace', en:'ice cream / ice', example:'Un café glacé.' },

  // RESTAURANT & ORDERING (~19)
  { id:'vocab:restaurant', type:'vocab', category:'restaurant', fr:'le restaurant', en:'restaurant', example:'Ce restaurant est excellent.' },
  { id:'vocab:table', type:'vocab', category:'restaurant', fr:'la table', en:'table', example:'Une table pour deux.' },
  { id:'vocab:menu', type:'vocab', category:'restaurant', fr:'le menu', en:'set menu / menu', example:"Le menu du jour, s'il vous plaît." },
  { id:'vocab:carte', type:'vocab', category:'restaurant', fr:'la carte', en:'menu (à la carte)', example:'Je voudrais voir la carte.' },
  { id:'vocab:plat', type:'vocab', category:'restaurant', fr:'le plat', en:'dish/main course', example:'Le plat du jour.' },
  { id:'vocab:entree', type:'vocab', category:'restaurant', fr:"l'entrée", en:'starter', example:'Comme entrée, une salade.' },
  { id:'vocab:dessert', type:'vocab', category:'restaurant', fr:'le dessert', en:'dessert', example:'Et comme dessert?' },
  { id:'vocab:serveur', type:'vocab', category:'restaurant', fr:'le serveur', en:'waiter', example:'Excusez-moi, monsieur!' },
  { id:'vocab:serveuse', type:'vocab', category:'restaurant', fr:'la serveuse', en:'waitress', example:'La serveuse arrive.' },
  { id:'vocab:reservation', type:'vocab', category:'restaurant', fr:'la réservation', en:'reservation', example:"J'ai une réservation." },
  { id:'vocab:vegetarien', type:'vocab', category:'restaurant', fr:'végétarien', en:'vegetarian', example:'Je suis végétarien.' },
  { id:'vocab:allergie', type:'vocab', category:'restaurant', fr:'une allergie', en:'allergy', example:"J'ai une allergie aux noix." },
  { id:'vocab:bien_cuit', type:'vocab', category:'restaurant', fr:'bien cuit', en:'well done', example:'Mon steak, bien cuit.' },
  { id:'vocab:saignant', type:'vocab', category:'restaurant', fr:'saignant', en:'rare (meat)', example:"Saignant, s'il vous plaît." },
  { id:'vocab:bouteille', type:'vocab', category:'restaurant', fr:'la bouteille', en:'bottle', example:"Une bouteille d'eau." },
  { id:'vocab:verre', type:'vocab', category:'restaurant', fr:'le verre', en:'glass', example:'Un verre de vin.' },
  { id:'vocab:poisson', type:'vocab', category:'restaurant', fr:'le poisson', en:'fish', example:'Je prends le poisson.' },
  { id:'vocab:viande', type:'vocab', category:'restaurant', fr:'la viande', en:'meat', example:"Sans viande, s'il vous plaît." },
  { id:'vocab:fromage', type:'vocab', category:'restaurant', fr:'le fromage', en:'cheese', example:'Un plateau de fromages.' },

  // NUMBERS & PRICES (~13)
  { id:'vocab:combien', type:'vocab', category:'numbers', fr:'combien', en:'how much/many', example:"C'est combien?" },
  { id:'vocab:euro', type:'vocab', category:'numbers', fr:"l'euro", en:'euro', example:'Ça coûte dix euros.' },
  { id:'vocab:centime', type:'vocab', category:'numbers', fr:'le centime', en:'cent', example:'Cinquante centimes.' },
  { id:'vocab:cher', type:'vocab', category:'numbers', fr:'cher / chère', en:'expensive', example:"C'est trop cher." },
  { id:'vocab:pas_cher', type:'vocab', category:'numbers', fr:'pas cher', en:'cheap/inexpensive', example:"C'est pas cher du tout." },
  { id:'vocab:gratuit', type:'vocab', category:'numbers', fr:'gratuit', en:'free (no cost)', example:"L'entrée est gratuite." },
  { id:'vocab:monnaie', type:'vocab', category:'numbers', fr:'la monnaie', en:'change (coins)', example:'Vous avez la monnaie?' },
  { id:'vocab:carte_bancaire', type:'vocab', category:'numbers', fr:'la carte bancaire', en:'bank card', example:'Je peux payer par carte?' },
  { id:'vocab:especes', type:'vocab', category:'numbers', fr:'les espèces', en:'cash', example:'Je paie en espèces.' },
  { id:'vocab:recu', type:'vocab', category:'numbers', fr:'le reçu', en:'receipt', example:'Je peux avoir un reçu?' },
  { id:'vocab:prix', type:'vocab', category:'numbers', fr:'le prix', en:'price', example:'Quel est le prix?' },
  { id:'vocab:reduction', type:'vocab', category:'numbers', fr:'la réduction', en:'discount', example:"Il y a une réduction?" },
  { id:'vocab:total', type:'vocab', category:'numbers', fr:'le total', en:'total', example:"Le total, c'est combien?" },

  // TRANSPORT & TICKETS (~16)
  { id:'vocab:train', type:'vocab', category:'transport', fr:'le train', en:'train', example:'Le train part à quelle heure?' },
  { id:'vocab:bus', type:'vocab', category:'transport', fr:'le bus', en:'bus', example:'Quel bus pour le centre?' },
  { id:'vocab:metro', type:'vocab', category:'transport', fr:'le métro', en:'metro/subway', example:'La station de métro.' },
  { id:'vocab:gare', type:'vocab', category:'transport', fr:'la gare', en:'train station', example:"La gare, c'est loin?" },
  { id:'vocab:billet', type:'vocab', category:'transport', fr:'le billet', en:'ticket', example:'Un billet pour Paris.' },
  { id:'vocab:aller_retour', type:'vocab', category:'transport', fr:"l'aller-retour", en:'return ticket', example:"Un aller-retour, s'il vous plaît." },
  { id:'vocab:aller_simple', type:'vocab', category:'transport', fr:"l'aller simple", en:'one-way ticket', example:'Un aller simple pour Lyon.' },
  { id:'vocab:quai', type:'vocab', category:'transport', fr:'le quai', en:'platform', example:'Le train est quai numéro trois.' },
  { id:'vocab:depart', type:'vocab', category:'transport', fr:'le départ', en:'departure', example:"L'heure de départ." },
  { id:'vocab:arrivee', type:'vocab', category:'transport', fr:"l'arrivée", en:'arrival', example:"L'heure d'arrivée." },
  { id:'vocab:retard', type:'vocab', category:'transport', fr:'le retard', en:'delay', example:'Il y a du retard.' },
  { id:'vocab:correspondance', type:'vocab', category:'transport', fr:'la correspondance', en:'connection/transfer', example:'Il faut une correspondance.' },
  { id:'vocab:taxi', type:'vocab', category:'transport', fr:'le taxi', en:'taxi', example:'Appelez-moi un taxi.' },
  { id:'vocab:aeroport', type:'vocab', category:'transport', fr:"l'aéroport", en:'airport', example:"Comment aller à l'aéroport?" },
  { id:'vocab:vol', type:'vocab', category:'transport', fr:'le vol', en:'flight', example:'Mon vol est à midi.' },
  { id:'vocab:bagage', type:'vocab', category:'transport', fr:'le bagage', en:'luggage', example:'Je perds mon bagage.' },

  // HOTEL & CHECK-IN (~12)
  { id:'vocab:hotel', type:'vocab', category:'hotel', fr:"l'hôtel", en:'hotel', example:"Je cherche un hôtel." },
  { id:'vocab:chambre', type:'vocab', category:'hotel', fr:'la chambre', en:'room', example:'Une chambre pour deux.' },
  { id:'vocab:cle', type:'vocab', category:'hotel', fr:'la clé', en:'key', example:'La clé de ma chambre.' },
  { id:'vocab:nuit', type:'vocab', category:'hotel', fr:'la nuit', en:'night', example:'Pour deux nuits.' },
  { id:'vocab:ascenseur', type:'vocab', category:'hotel', fr:"l'ascenseur", en:'elevator/lift', example:"L'ascenseur est en panne." },
  { id:'vocab:petit_dejeuner', type:'vocab', category:'hotel', fr:'le petit-déjeuner', en:'breakfast', example:'Le petit-déjeuner est inclus.' },
  { id:'vocab:reception', type:'vocab', category:'hotel', fr:'la réception', en:'reception/front desk', example:'La réception est au rez-de-chaussée.' },
  { id:'vocab:etage', type:'vocab', category:'hotel', fr:"l'étage", en:'floor/storey', example:'Au deuxième étage.' },
  { id:'vocab:wifi', type:'vocab', category:'hotel', fr:'le WiFi', en:'WiFi', example:'Quel est le mot de passe WiFi?' },
  { id:'vocab:serviette', type:'vocab', category:'hotel', fr:'la serviette', en:'towel', example:"J'ai besoin de serviettes." },
  { id:'vocab:climatisation', type:'vocab', category:'hotel', fr:'la climatisation', en:'air conditioning', example:'La climatisation ne marche pas.' },
  { id:'vocab:piscine', type:'vocab', category:'hotel', fr:'la piscine', en:'swimming pool', example:"Il y a une piscine?" },

  // DIRECTIONS (~13)
  { id:'vocab:gauche', type:'vocab', category:'directions', fr:'à gauche', en:'to the left', example:'Tournez à gauche.' },
  { id:'vocab:droite', type:'vocab', category:'directions', fr:'à droite', en:'to the right', example:"C'est à droite." },
  { id:'vocab:tout_droit', type:'vocab', category:'directions', fr:'tout droit', en:'straight ahead', example:'Allez tout droit.' },
  { id:'vocab:tourner', type:'vocab', category:'directions', fr:'tourner', en:'to turn', example:'Tournez au carrefour.' },
  { id:'vocab:rue', type:'vocab', category:'directions', fr:'la rue', en:'street', example:'Dans quelle rue?' },
  { id:'vocab:place', type:'vocab', category:'directions', fr:'la place', en:'square/plaza', example:'La place du marché.' },
  { id:'vocab:proche', type:'vocab', category:'directions', fr:'proche / près', en:'near/close', example:"C'est près d'ici." },
  { id:'vocab:loin', type:'vocab', category:'directions', fr:'loin', en:'far', example:"C'est loin?" },
  { id:'vocab:carrefour', type:'vocab', category:'directions', fr:'le carrefour', en:'crossroads', example:'Au prochain carrefour.' },
  { id:'vocab:pont', type:'vocab', category:'directions', fr:'le pont', en:'bridge', example:'Traversez le pont.' },
  { id:'vocab:feux', type:'vocab', category:'directions', fr:'les feux', en:'traffic lights', example:'Aux feux, tournez.' },
  { id:'vocab:coin', type:'vocab', category:'directions', fr:'le coin', en:'corner', example:'Au coin de la rue.' },
  { id:'vocab:en_face', type:'vocab', category:'directions', fr:'en face de', en:'opposite/across from', example:'En face de la poste.' },

  // SHOPPING (~12)
  { id:'vocab:magasin', type:'vocab', category:'shopping', fr:'le magasin', en:'shop/store', example:'Le magasin est ouvert?' },
  { id:'vocab:taille', type:'vocab', category:'shopping', fr:'la taille', en:'size', example:'Quelle est votre taille?' },
  { id:'vocab:couleur', type:'vocab', category:'shopping', fr:'la couleur', en:'colour', example:'En quelle couleur?' },
  { id:'vocab:essayer', type:'vocab', category:'shopping', fr:'essayer', en:'to try on', example:'Je peux essayer?' },
  { id:'vocab:caisse', type:'vocab', category:'shopping', fr:'la caisse', en:'checkout/till', example:'La caisse, c\'est là-bas.' },
  { id:'vocab:soldes', type:'vocab', category:'shopping', fr:'les soldes', en:'sales', example:'Les soldes commencent demain.' },
  { id:'vocab:marche', type:'vocab', category:'shopping', fr:'le marché', en:'market', example:'Le marché du dimanche.' },
  { id:'vocab:ouvert', type:'vocab', category:'shopping', fr:'ouvert', en:'open', example:'Le magasin est ouvert.' },
  { id:'vocab:ferme', type:'vocab', category:'shopping', fr:'fermé', en:'closed', example:'Désolé, nous sommes fermés.' },
  { id:'vocab:sac', type:'vocab', category:'shopping', fr:'le sac', en:'bag', example:'Un sac en plastique?' },
  { id:'vocab:cadeau', type:'vocab', category:'shopping', fr:'le cadeau', en:'gift', example:"C'est pour un cadeau." },
  { id:'vocab:pointure', type:'vocab', category:'shopping', fr:'la pointure', en:'shoe size', example:'Quelle est votre pointure?' },

  // GENERAL SURVIVAL (~16)
  { id:'vocab:oui', type:'vocab', category:'general', fr:'oui', en:'yes', example:'Oui, merci.' },
  { id:'vocab:non', type:'vocab', category:'general', fr:'non', en:'no', example:'Non, merci.' },
  { id:'vocab:stp', type:'vocab', category:'general', fr:"s'il te plaît", en:'please (informal)', example:"Attends, s'il te plaît." },
  { id:'vocab:desole', type:'vocab', category:'general', fr:'désolé', en:'sorry', example:'Désolé, je suis en retard.' },
  { id:'vocab:bien', type:'vocab', category:'general', fr:'bien', en:'well/good', example:'Très bien, merci.' },
  { id:'vocab:mal', type:'vocab', category:'general', fr:'mal', en:'bad/badly', example:'Ça ne va pas bien.' },
  { id:'vocab:beaucoup', type:'vocab', category:'general', fr:'beaucoup', en:'a lot/very much', example:'Merci beaucoup.' },
  { id:'vocab:un_peu', type:'vocab', category:'general', fr:'un peu', en:'a little', example:'Je parle un peu français.' },
  { id:'vocab:maintenant', type:'vocab', category:'general', fr:'maintenant', en:'now', example:'Je veux partir maintenant.' },
  { id:'vocab:aujourd_hui', type:'vocab', category:'general', fr:"aujourd'hui", en:'today', example:"Le musée est fermé aujourd'hui." },
  { id:'vocab:demain', type:'vocab', category:'general', fr:'demain', en:'tomorrow', example:"À demain!" },
  { id:'vocab:hier', type:'vocab', category:'general', fr:'hier', en:'yesterday', example:"Hier, j'ai visité le Louvre." },
  { id:'vocab:ici', type:'vocab', category:'general', fr:'ici', en:'here', example:"Je suis ici." },
  { id:'vocab:la', type:'vocab', category:'general', fr:'là', en:'there', example:"C'est là-bas." },
  { id:'vocab:quand', type:'vocab', category:'general', fr:'quand', en:'when', example:"Quand est-ce que ça ouvre?" },
  { id:'vocab:pourquoi', type:'vocab', category:'general', fr:'pourquoi', en:'why', example:"Pourquoi est-ce fermé?" },

  // EMERGENCIES (~9)
  { id:'vocab:aide', type:'vocab', category:'emergency', fr:"l'aide", en:'help', example:"Au secours! À l'aide!" },
  { id:'vocab:police', type:'vocab', category:'emergency', fr:'la police', en:'police', example:'Appelez la police!' },
  { id:'vocab:medecin', type:'vocab', category:'emergency', fr:'le médecin', en:'doctor', example:"J'ai besoin d'un médecin." },
  { id:'vocab:pharmacie', type:'vocab', category:'emergency', fr:'la pharmacie', en:'pharmacy', example:'Où est la pharmacie?' },
  { id:'vocab:hopital', type:'vocab', category:'emergency', fr:"l'hôpital", en:'hospital', example:"Il faut aller à l'hôpital." },
  { id:'vocab:urgence', type:'vocab', category:'emergency', fr:"l'urgence", en:'emergency', example:"C'est une urgence!" },
  { id:'vocab:voler', type:'vocab', category:'emergency', fr:'voler', en:'to steal', example:"On m'a volé mon sac." },
  { id:'vocab:perdu', type:'vocab', category:'emergency', fr:'perdu', en:'lost', example:'Je suis perdu.' },
  { id:'vocab:ambassade', type:'vocab', category:'emergency', fr:"l'ambassade", en:'embassy', example:'L\'ambassade néerlandaise.' },

  // POLITE PHRASES (~14)
  { id:'vocab:bonjour', type:'vocab', category:'polite', fr:'bonjour', en:'good morning/hello', example:'Bonjour, madame!' },
  { id:'vocab:bonsoir', type:'vocab', category:'polite', fr:'bonsoir', en:'good evening', example:'Bonsoir, monsieur.' },
  { id:'vocab:merci', type:'vocab', category:'polite', fr:'merci', en:'thank you', example:'Merci beaucoup.' },
  { id:'vocab:svp', type:'vocab', category:'polite', fr:"s'il vous plaît", en:'please (formal)', example:"Un café, s'il vous plaît." },
  { id:'vocab:excusez', type:'vocab', category:'polite', fr:'excusez-moi', en:'excuse me', example:'Excusez-moi, où est...?' },
  { id:'vocab:pardon', type:'vocab', category:'polite', fr:'pardon', en:'sorry/pardon', example:"Pardon, je n'ai pas compris." },
  { id:'vocab:de_rien', type:'vocab', category:'polite', fr:'de rien', en:"you're welcome", example:'— Merci! — De rien.' },
  { id:'vocab:au_revoir', type:'vocab', category:'polite', fr:'au revoir', en:'goodbye', example:'Au revoir, bonne journée!' },
  { id:'vocab:je_voudrais', type:'vocab', category:'polite', fr:'je voudrais', en:'I would like', example:'Je voudrais un café.' },
  { id:'vocab:comprenez', type:'vocab', category:'polite', fr:'vous comprenez', en:'do you understand', example:"Vous comprenez l'anglais?" },
  { id:'vocab:parlez', type:'vocab', category:'polite', fr:'vous parlez', en:'do you speak', example:'Vous parlez anglais?' },
  { id:'vocab:comprends_pas', type:'vocab', category:'polite', fr:'je ne comprends pas', en:"I don't understand", example:"Désolé, je ne comprends pas." },
  { id:'vocab:repeter', type:'vocab', category:'polite', fr:'répéter', en:'to repeat', example:'Pouvez-vous répéter?' },
  { id:'vocab:lentement', type:'vocab', category:'polite', fr:'lentement', en:'slowly', example:'Parlez plus lentement.' },

];

// ── Conjugation cards ─────────────────────────────────────────────────────────

// Helper to build présent cards for a verb
function presentCards(verb, forms) {
  // forms: [je, tu, il, nous, vous, ils]
  const pronouns = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
  const ids      = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
  return pronouns.map((pronoun, i) => ({
    id:       `conj:${verb}:${ids[i]}:present`,
    type:     'conj',
    category: 'conjugation',
    verb,
    pronoun,
    tense:    'present',
    fr:       `${verb} → ${pronoun} … (présent)`,
    en:       forms[i],
  }));
}

// Helper to build passé composé cards (je + nous only)
function passeCards(verb, jeForm, nousForm) {
  return [
    { id:`conj:${verb}:je:passe`,   type:'conj', category:'conjugation', verb, pronoun:'je',   tense:'passé composé', fr:`${verb} → je … (passé composé)`,   en:jeForm   },
    { id:`conj:${verb}:nous:passe`, type:'conj', category:'conjugation', verb, pronoun:'nous', tense:'passé composé', fr:`${verb} → nous … (passé composé)`, en:nousForm },
  ];
}

const conjCards = [

  // ── PRÉSENT ──────────────────────────────────────────────────────────────────

  // être: je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont
  ...presentCards('être',      ['suis', 'es', 'est', 'sommes', 'êtes', 'sont']),

  // avoir: j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont
  ...presentCards('avoir',     ["j'ai", 'as', 'a', 'avons', 'avez', 'ont']),

  // aller: je vais, tu vas, il/elle va, nous allons, vous allez, ils/elles vont
  ...presentCards('aller',     ['vais', 'vas', 'va', 'allons', 'allez', 'vont']),

  // faire: je fais, tu fais, il/elle fait, nous faisons, vous faites, ils/elles font
  ...presentCards('faire',     ['fais', 'fais', 'fait', 'faisons', 'faites', 'font']),

  // vouloir: je veux, tu veux, il/elle veut, nous voulons, vous voulez, ils/elles veulent
  ...presentCards('vouloir',   ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent']),

  // pouvoir: je peux, tu peux, il/elle peut, nous pouvons, vous pouvez, ils/elles peuvent
  ...presentCards('pouvoir',   ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent']),

  // prendre: je prends, tu prends, il/elle prend, nous prenons, vous prenez, ils/elles prennent
  ...presentCards('prendre',   ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent']),

  // venir: je viens, tu viens, il/elle vient, nous venons, vous venez, ils/elles viennent
  ...presentCards('venir',     ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent']),

  // partir: je pars, tu pars, il/elle part, nous partons, vous partez, ils/elles partent
  ...presentCards('partir',    ['pars', 'pars', 'part', 'partons', 'partez', 'partent']),

  // payer: je paie, tu paies, il/elle paie, nous payons, vous payez, ils/elles paient
  ...presentCards('payer',     ['paie', 'paies', 'paie', 'payons', 'payez', 'paient']),

  // comprendre: same pattern as prendre
  ...presentCards('comprendre', ['comprends', 'comprends', 'comprend', 'comprenons', 'comprenez', 'comprennent']),

  // parler (regular -er model): je parle, tu parles, il/elle parle, nous parlons, vous parlez, ils/elles parlent
  ...presentCards('parler',    ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent']),

  // ── PASSÉ COMPOSÉ (je + nous only) ───────────────────────────────────────────

  ...passeCards('être',    "j'ai été",      'nous avons été'),
  ...passeCards('avoir',   "j'ai eu",       'nous avons eu'),
  ...passeCards('aller',   'je suis allé(e)', 'nous sommes allé(e)s'),
  ...passeCards('faire',   "j'ai fait",     'nous avons fait'),
  ...passeCards('vouloir', "j'ai voulu",    'nous avons voulu'),
  ...passeCards('pouvoir', "j'ai pu",       'nous avons pu'),
  ...passeCards('prendre', "j'ai pris",     'nous avons pris'),
  ...passeCards('partir',  'je suis parti(e)', 'nous sommes parti(e)s'),

  // ── FUTUR PROCHE (je only — teach the aller + infinitif pattern) ─────────────

  { id:'conj:fp:je:manger',  type:'conj', category:'conjugation', verb:'manger',  pronoun:'je', tense:'futur proche', fr:'manger → je … (futur proche)',  en:'vais manger'  },
  { id:'conj:fp:je:partir',  type:'conj', category:'conjugation', verb:'partir',  pronoun:'je', tense:'futur proche', fr:'partir → je … (futur proche)',  en:'vais partir'  },
  { id:'conj:fp:je:prendre', type:'conj', category:'conjugation', verb:'prendre', pronoun:'je', tense:'futur proche', fr:'prendre → je … (futur proche)', en:'vais prendre' },
  { id:'conj:fp:je:faire',   type:'conj', category:'conjugation', verb:'faire',   pronoun:'je', tense:'futur proche', fr:'faire → je … (futur proche)',   en:'vais faire'   },
  { id:'conj:fp:je:aller',   type:'conj', category:'conjugation', verb:'aller',   pronoun:'je', tense:'futur proche', fr:'aller → je … (futur proche)',   en:'vais aller'   },
  { id:'conj:fp:je:payer',   type:'conj', category:'conjugation', verb:'payer',   pronoun:'je', tense:'futur proche', fr:'payer → je … (futur proche)',   en:'vais payer'   },

];

module.exports = [...vocabCards, ...conjCards];
