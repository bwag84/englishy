# Drill Modes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add four-mode navigation (Conversation / Vocab / Grammar / Silent) with spaced-repetition drilling, a curated 80/20 card list, and export/import for progress portability.

**Architecture:** Cards ship as static data in `packs/french/cards.js`, served via `/api/config`. SM-2 state lives in localStorage. A new `/api/drill.js` endpoint evaluates spoken answers and returns audio feedback. `index.html` gains a 4-tab bar and mode-specific UIs. Silent mode is fully client-side (no API calls). Conversation mode marks cards "seen" by scanning assistant replies against the card list.

**Tech Stack:** Vanilla JS, localStorage, Node.js serverless functions, existing OpenAI STT/TTS/chat pipeline.

---

### Task 1: Create `packs/french/cards.js`

**Files:**
- Create: `packs/french/cards.js`

**Step 1: Create the file**

The card schema:
```js
// vocab card
{ id: 'vocab:boulangerie', type: 'vocab', category: 'bakery', fr: 'la boulangerie', en: 'bakery', example: "Une boulangerie vend du pain." }
// conj card
{ id: 'conj:aller:je:present', type: 'conj', category: 'conjugation', verb: 'aller', pronoun: 'je', tense: 'present', fr: 'aller → je … (présent)', en: 'vais' }
```

Write `packs/french/cards.js` with `module.exports = [ ...all cards... ]` containing:

**Vocab cards (~180) — use the exact fr/en pairs below per category:**

BAKERY (~15):
```
{ id:'vocab:boulangerie', type:'vocab', category:'bakery', fr:'la boulangerie', en:'bakery', example:'Il y a une boulangerie au coin.' }
{ id:'vocab:baguette', type:'vocab', category:'bakery', fr:'la baguette', en:'baguette', example:'Une baguette, s\'il vous plaît.' }
{ id:'vocab:pain', type:'vocab', category:'bakery', fr:'le pain', en:'bread', example:'Je voudrais du pain.' }
{ id:'vocab:croissant', type:'vocab', category:'bakery', fr:'le croissant', en:'croissant', example:'Deux croissants, s\'il vous plaît.' }
{ id:'vocab:gateau', type:'vocab', category:'bakery', fr:'le gâteau', en:'cake', example:'Ce gâteau est délicieux.' }
{ id:'vocab:tarte', type:'vocab', category:'bakery', fr:'la tarte', en:'tart/pie', example:'Une tarte aux pommes.' }
{ id:'vocab:patisserie', type:'vocab', category:'bakery', fr:'la pâtisserie', en:'pastry shop', example:'La pâtisserie est fermée.' }
{ id:'vocab:brioche', type:'vocab', category:'bakery', fr:'la brioche', en:'brioche', example:'Une brioche, s\'il vous plaît.' }
{ id:'vocab:farine', type:'vocab', category:'bakery', fr:'la farine', en:'flour', example:'Du pain à la farine complète.' }
{ id:'vocab:tranche', type:'vocab', category:'bakery', fr:'la tranche', en:'slice', example:'Une tranche de cake.' }
{ id:'vocab:frais', type:'vocab', category:'bakery', fr:'frais / fraîche', en:'fresh', example:'Le pain est frais.' }
{ id:'vocab:chaud', type:'vocab', category:'bakery', fr:'chaud', en:'warm/hot', example:'Le croissant est encore chaud.' }
{ id:'vocab:sachet', type:'vocab', category:'bakery', fr:'un sachet', en:'bag (small)', example:'Dans un sachet, s\'il vous plaît.' }
```

CAFÉ & DRINKS (~15):
```
{ id:'vocab:cafe', type:'vocab', category:'cafe', fr:'le café', en:'coffee / café', example:'Un café, s\'il vous plaît.' }
{ id:'vocab:the', type:'vocab', category:'cafe', fr:'le thé', en:'tea', example:'Un thé au lait.' }
{ id:'vocab:eau', type:'vocab', category:'cafe', fr:'l\'eau', en:'water', example:'De l\'eau, s\'il vous plaît.' }
{ id:'vocab:jus', type:'vocab', category:'cafe', fr:'le jus d\'orange', en:'orange juice', example:'Un jus d\'orange pressé.' }
{ id:'vocab:biere', type:'vocab', category:'cafe', fr:'la bière', en:'beer', example:'Une bière pression.' }
{ id:'vocab:vin', type:'vocab', category:'cafe', fr:'le vin', en:'wine', example:'Un verre de vin rouge.' }
{ id:'vocab:limonade', type:'vocab', category:'cafe', fr:'la limonade', en:'lemonade/lemon soda', example:'Une limonade bien fraîche.' }
{ id:'vocab:terrasse', type:'vocab', category:'cafe', fr:'la terrasse', en:'terrace/outdoor seating', example:'On s\'assied en terrasse?' }
{ id:'vocab:addition', type:'vocab', category:'cafe', fr:'l\'addition', en:'the bill', example:'L\'addition, s\'il vous plaît.' }
{ id:'vocab:pourboire', type:'vocab', category:'cafe', fr:'le pourboire', en:'tip (gratuity)', example:'Le pourboire est inclus.' }
{ id:'vocab:sucre', type:'vocab', category:'cafe', fr:'le sucre', en:'sugar', example:'Sans sucre, merci.' }
{ id:'vocab:lait', type:'vocab', category:'cafe', fr:'le lait', en:'milk', example:'Avec du lait, s\'il vous plaît.' }
{ id:'vocab:glace', type:'vocab', category:'cafe', fr:'la glace', en:'ice cream / ice', example:'Un café glacé.' }
```

RESTAURANT & ORDERING (~20):
```
{ id:'vocab:restaurant', type:'vocab', category:'restaurant', fr:'le restaurant', en:'restaurant', example:'Ce restaurant est excellent.' }
{ id:'vocab:table', type:'vocab', category:'restaurant', fr:'la table', en:'table', example:'Une table pour deux.' }
{ id:'vocab:menu', type:'vocab', category:'restaurant', fr:'le menu', en:'set menu / menu', example:'Le menu du jour, s\'il vous plaît.' }
{ id:'vocab:carte', type:'vocab', category:'restaurant', fr:'la carte', en:'menu (à la carte)', example:'Je voudrais voir la carte.' }
{ id:'vocab:plat', type:'vocab', category:'restaurant', fr:'le plat', en:'dish/main course', example:'Le plat du jour.' }
{ id:'vocab:entree', type:'vocab', category:'restaurant', fr:'l\'entrée', en:'starter', example:'Comme entrée, une salade.' }
{ id:'vocab:dessert', type:'vocab', category:'restaurant', fr:'le dessert', en:'dessert', example:'Et comme dessert?' }
{ id:'vocab:serveur', type:'vocab', category:'restaurant', fr:'le serveur', en:'waiter', example:'Excusez-moi, monsieur!' }
{ id:'vocab:serveuse', type:'vocab', category:'restaurant', fr:'la serveuse', en:'waitress', example:'La serveuse arrive.' }
{ id:'vocab:reservation', type:'vocab', category:'restaurant', fr:'la réservation', en:'reservation', example:'J\'ai une réservation.' }
{ id:'vocab:vegetarien', type:'vocab', category:'restaurant', fr:'végétarien', en:'vegetarian', example:'Je suis végétarien.' }
{ id:'vocab:allergie', type:'vocab', category:'restaurant', fr:'une allergie', en:'allergy', example:'J\'ai une allergie aux noix.' }
{ id:'vocab:bien_cuit', type:'vocab', category:'restaurant', fr:'bien cuit', en:'well done', example:'Mon steak, bien cuit.' }
{ id:'vocab:saignant', type:'vocab', category:'restaurant', fr:'saignant', en:'rare (meat)', example:'Saignant, s\'il vous plaît.' }
{ id:'vocab:bouteille', type:'vocab', category:'restaurant', fr:'la bouteille', en:'bottle', example:'Une bouteille d\'eau.' }
{ id:'vocab:verre', type:'vocab', category:'restaurant', fr:'le verre', en:'glass', example:'Un verre de vin.' }
{ id:'vocab:poisson', type:'vocab', category:'restaurant', fr:'le poisson', en:'fish', example:'Je prends le poisson.' }
{ id:'vocab:viande', type:'vocab', category:'restaurant', fr:'la viande', en:'meat', example:'Sans viande, s\'il vous plaît.' }
{ id:'vocab:fromage', type:'vocab', category:'restaurant', fr:'le fromage', en:'cheese', example:'Un plateau de fromages.' }
```

NUMBERS & PRICES (~18):
```
{ id:'vocab:combien', type:'vocab', category:'numbers', fr:'combien', en:'how much/many', example:'C\'est combien?' }
{ id:'vocab:euro', type:'vocab', category:'numbers', fr:'l\'euro', en:'euro', example:'Ça coûte dix euros.' }
{ id:'vocab:centime', type:'vocab', category:'numbers', fr:'le centime', en:'cent', example:'Cinquante centimes.' }
{ id:'vocab:cher', type:'vocab', category:'numbers', fr:'cher / chère', en:'expensive', example:'C\'est trop cher.' }
{ id:'vocab:pas_cher', type:'vocab', category:'numbers', fr:'pas cher', en:'cheap/inexpensive', example:'C\'est pas cher du tout.' }
{ id:'vocab:gratuit', type:'vocab', category:'numbers', fr:'gratuit', en:'free (no cost)', example:'L\'entrée est gratuite.' }
{ id:'vocab:monnaie', type:'vocab', category:'numbers', fr:'la monnaie', en:'change (coins)', example:'Vous avez la monnaie?' }
{ id:'vocab:carte_bancaire', type:'vocab', category:'numbers', fr:'la carte bancaire', en:'bank card', example:'Je peux payer par carte?' }
{ id:'vocab:especes', type:'vocab', category:'numbers', fr:'les espèces', en:'cash', example:'Je paie en espèces.' }
{ id:'vocab:recu', type:'vocab', category:'numbers', fr:'le reçu', en:'receipt', example:'Je peux avoir un reçu?' }
{ id:'vocab:prix', type:'vocab', category:'numbers', fr:'le prix', en:'price', example:'Quel est le prix?' }
{ id:'vocab:reduction', type:'vocab', category:'numbers', fr:'la réduction', en:'discount', example:'Il y a une réduction?' }
{ id:'vocab:total', type:'vocab', category:'numbers', fr:'le total', en:'total', example:'Le total, c\'est combien?' }
```

TRANSPORT & TICKETS (~20):
```
{ id:'vocab:train', type:'vocab', category:'transport', fr:'le train', en:'train', example:'Le train part à quelle heure?' }
{ id:'vocab:bus', type:'vocab', category:'transport', fr:'le bus', en:'bus', example:'Quel bus pour le centre?' }
{ id:'vocab:metro', type:'vocab', category:'transport', fr:'le métro', en:'metro/subway', example:'La station de métro.' }
{ id:'vocab:gare', type:'vocab', category:'transport', fr:'la gare', en:'train station', example:'La gare, c\'est loin?' }
{ id:'vocab:billet', type:'vocab', category:'transport', fr:'le billet', en:'ticket', example:'Un billet pour Paris.' }
{ id:'vocab:aller_retour', type:'vocab', category:'transport', fr:'l\'aller-retour', en:'return ticket', example:'Un aller-retour, s\'il vous plaît.' }
{ id:'vocab:aller_simple', type:'vocab', category:'transport', fr:'l\'aller simple', en:'one-way ticket', example:'Un aller simple pour Lyon.' }
{ id:'vocab:quai', type:'vocab', category:'transport', fr:'le quai', en:'platform', example:'Le train est quai numéro trois.' }
{ id:'vocab:depart', type:'vocab', category:'transport', fr:'le départ', en:'departure', example:'L\'heure de départ.' }
{ id:'vocab:arrivee', type:'vocab', category:'transport', fr:'l\'arrivée', en:'arrival', example:'L\'heure d\'arrivée.' }
{ id:'vocab:retard', type:'vocab', category:'transport', fr:'le retard', en:'delay', example:'Il y a du retard.' }
{ id:'vocab:correspondance', type:'vocab', category:'transport', fr:'la correspondance', en:'connection/transfer', example:'Il faut une correspondance.' }
{ id:'vocab:taxi', type:'vocab', category:'transport', fr:'le taxi', en:'taxi', example:'Appelez-moi un taxi.' }
{ id:'vocab:aeroport', type:'vocab', category:'transport', fr:'l\'aéroport', en:'airport', example:'Comment aller à l\'aéroport?' }
{ id:'vocab:vol', type:'vocab', category:'transport', fr:'le vol', en:'flight', example:'Mon vol est à midi.' }
{ id:'vocab:bagage', type:'vocab', category:'transport', fr:'le bagage', en:'luggage', example:'Je perds mon bagage.' }
```

HOTEL & CHECK-IN (~15):
```
{ id:'vocab:hotel', type:'vocab', category:'hotel', fr:'l\'hôtel', en:'hotel', example:'Je cherche un hôtel.' }
{ id:'vocab:chambre', type:'vocab', category:'hotel', fr:'la chambre', en:'room', example:'Une chambre pour deux.' }
{ id:'vocab:cle', type:'vocab', category:'hotel', fr:'la clé', en:'key', example:'La clé de ma chambre.' }
{ id:'vocab:nuit', type:'vocab', category:'hotel', fr:'la nuit', en:'night', example:'Pour deux nuits.' }
{ id:'vocab:ascenseur', type:'vocab', category:'hotel', fr:'l\'ascenseur', en:'elevator/lift', example:'L\'ascenseur est en panne.' }
{ id:'vocab:petit_dejeuner', type:'vocab', category:'hotel', fr:'le petit-déjeuner', en:'breakfast', example:'Le petit-déjeuner est inclus.' }
{ id:'vocab:reception', type:'vocab', category:'hotel', fr:'la réception', en:'reception/front desk', example:'La réception est au rez-de-chaussée.' }
{ id:'vocab:etage', type:'vocab', category:'hotel', fr:'l\'étage', en:'floor/storey', example:'Au deuxième étage.' }
{ id:'vocab:wifi', type:'vocab', category:'hotel', fr:'le WiFi', en:'WiFi', example:'Quel est le mot de passe WiFi?' }
{ id:'vocab:serviette', type:'vocab', category:'hotel', fr:'la serviette', en:'towel', example:'J\'ai besoin de serviettes.' }
{ id:'vocab:climatisation', type:'vocab', category:'hotel', fr:'la climatisation', en:'air conditioning', example:'La climatisation ne marche pas.' }
{ id:'vocab:piscine', type:'vocab', category:'hotel', fr:'la piscine', en:'swimming pool', example:'Il y a une piscine?' }
```

DIRECTIONS (~15):
```
{ id:'vocab:gauche', type:'vocab', category:'directions', fr:'à gauche', en:'to the left', example:'Tournez à gauche.' }
{ id:'vocab:droite', type:'vocab', category:'directions', fr:'à droite', en:'to the right', example:'C\'est à droite.' }
{ id:'vocab:tout_droit', type:'vocab', category:'directions', fr:'tout droit', en:'straight ahead', example:'Allez tout droit.' }
{ id:'vocab:tourner', type:'vocab', category:'directions', fr:'tourner', en:'to turn', example:'Tournez au carrefour.' }
{ id:'vocab:rue', type:'vocab', category:'directions', fr:'la rue', en:'street', example:'Dans quelle rue?' }
{ id:'vocab:place', type:'vocab', category:'directions', fr:'la place', en:'square/plaza', example:'La place du marché.' }
{ id:'vocab:proche', type:'vocab', category:'directions', fr:'proche / près', en:'near/close', example:'C\'est près d\'ici.' }
{ id:'vocab:loin', type:'vocab', category:'directions', fr:'loin', en:'far', example:'C\'est loin?' }
{ id:'vocab:carrefour', type:'vocab', category:'directions', fr:'le carrefour', en:'crossroads', example:'Au prochain carrefour.' }
{ id:'vocab:pont', type:'vocab', category:'directions', fr:'le pont', en:'bridge', example:'Traversez le pont.' }
{ id:'vocab:feux', type:'vocab', category:'directions', fr:'les feux', en:'traffic lights', example:'Aux feux, tournez.' }
{ id:'vocab:coin', type:'vocab', category:'directions', fr:'le coin', en:'corner', example:'Au coin de la rue.' }
{ id:'vocab:en_face', type:'vocab', category:'directions', fr:'en face de', en:'opposite/across from', example:'En face de la poste.' }
```

SHOPPING (~15):
```
{ id:'vocab:magasin', type:'vocab', category:'shopping', fr:'le magasin', en:'shop/store', example:'Le magasin est ouvert?' }
{ id:'vocab:taille', type:'vocab', category:'shopping', fr:'la taille', en:'size', example:'Quelle est votre taille?' }
{ id:'vocab:couleur', type:'vocab', category:'shopping', fr:'la couleur', en:'colour', example:'En quelle couleur?' }
{ id:'vocab:essayer', type:'vocab', category:'shopping', fr:'essayer', en:'to try on', example:'Je peux essayer?' }
{ id:'vocab:caisse', type:'vocab', category:'shopping', fr:'la caisse', en:'checkout/till', example:'La caisse, c\'est là-bas.' }
{ id:'vocab:soldes', type:'vocab', category:'shopping', fr:'les soldes', en:'sales', example:'Les soldes commencent demain.' }
{ id:'vocab:marche', type:'vocab', category:'shopping', fr:'le marché', en:'market', example:'Le marché du dimanche.' }
{ id:'vocab:ouvert', type:'vocab', category:'shopping', fr:'ouvert', en:'open', example:'Le magasin est ouvert.' }
{ id:'vocab:ferme', type:'vocab', category:'shopping', fr:'fermé', en:'closed', example:'Désolé, nous sommes fermés.' }
{ id:'vocab:sac', type:'vocab', category:'shopping', fr:'le sac', en:'bag', example:'Un sac en plastique?' }
{ id:'vocab:cadeau', type:'vocab', category:'shopping', fr:'le cadeau', en:'gift', example:'C\'est pour un cadeau.' }
{ id:'vocab:pointure', type:'vocab', category:'shopping', fr:'la pointure', en:'shoe size', example:'Quelle est votre pointure?' }
```

EMERGENCIES (~10):
```
{ id:'vocab:aide', type:'vocab', category:'emergency', fr:'l\'aide', en:'help', example:'Au secours! À l\'aide!' }
{ id:'vocab:police', type:'vocab', category:'emergency', fr:'la police', en:'police', example:'Appelez la police!' }
{ id:'vocab:medecin', type:'vocab', category:'emergency', fr:'le médecin', en:'doctor', example:'J\'ai besoin d\'un médecin.' }
{ id:'vocab:pharmacie', type:'vocab', category:'emergency', fr:'la pharmacie', en:'pharmacy', example:'Où est la pharmacie?' }
{ id:'vocab:hopital', type:'vocab', category:'emergency', fr:'l\'hôpital', en:'hospital', example:'Il faut aller à l\'hôpital.' }
{ id:'vocab:urgence', type:'vocab', category:'emergency', fr:'l\'urgence', en:'emergency', example:'C\'est une urgence!' }
{ id:'vocab:voler', type:'vocab', category:'emergency', fr:'voler', en:'to steal', example:'On m\'a volé mon sac.' }
{ id:'vocab:perdu', type:'vocab', category:'emergency', fr:'perdu', en:'lost', example:'Je suis perdu.' }
{ id:'vocab:ambassade', type:'vocab', category:'emergency', fr:'l\'ambassade', en:'embassy', example:'L\'ambassade néerlandaise.' }
```

POLITE PHRASES (~15):
```
{ id:'vocab:bonjour', type:'vocab', category:'polite', fr:'bonjour', en:'good morning/hello', example:'Bonjour, madame!' }
{ id:'vocab:bonsoir', type:'vocab', category:'polite', fr:'bonsoir', en:'good evening', example:'Bonsoir, monsieur.' }
{ id:'vocab:merci', type:'vocab', category:'polite', fr:'merci', en:'thank you', example:'Merci beaucoup.' }
{ id:'vocab:svp', type:'vocab', category:'polite', fr:'s\'il vous plaît', en:'please (formal)', example:'Un café, s\'il vous plaît.' }
{ id:'vocab:excusez', type:'vocab', category:'polite', fr:'excusez-moi', en:'excuse me', example:'Excusez-moi, où est...?' }
{ id:'vocab:pardon', type:'vocab', category:'polite', fr:'pardon', en:'sorry/pardon', example:'Pardon, je n\'ai pas compris.' }
{ id:'vocab:de_rien', type:'vocab', category:'polite', fr:'de rien', en:'you\'re welcome', example:'— Merci! — De rien.' }
{ id:'vocab:au_revoir', type:'vocab', category:'polite', fr:'au revoir', en:'goodbye', example:'Au revoir, bonne journée!' }
{ id:'vocab:je_voudrais', type:'vocab', category:'polite', fr:'je voudrais', en:'I would like', example:'Je voudrais un café.' }
{ id:'vocab:comprenez', type:'vocab', category:'polite', fr:'vous comprenez', en:'do you understand', example:'Vous comprenez l\'anglais?' }
{ id:'vocab:parlez', type:'vocab', category:'polite', fr:'vous parlez', en:'do you speak', example:'Vous parlez anglais?' }
{ id:'vocab:comprends_pas', type:'vocab', category:'polite', fr:'je ne comprends pas', en:'I don\'t understand', example:'Désolé, je ne comprends pas.' }
{ id:'vocab:repeter', type:'vocab', category:'polite', fr:'répéter', en:'to repeat', example:'Pouvez-vous répéter?' }
{ id:'vocab:lentement', type:'vocab', category:'polite', fr:'lentement', en:'slowly', example:'Parlez plus lentement.' }
```

**Conjugation cards (~70) — exact answers required:**

ÊTRE (présent): je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont
AVOIR (présent): j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont
ALLER (présent): je vais, tu vas, il/elle va, nous allons, vous allez, ils/elles vont
FAIRE (présent): je fais, tu fais, il/elle fait, nous faisons, vous faites, ils/elles font
VOULOIR (présent): je veux, tu veux, il/elle veut, nous voulons, vous voulez, ils/elles veulent
POUVOIR (présent): je peux, tu peux, il/elle peut, nous pouvons, vous pouvez, ils/elles peuvent
PRENDRE (présent): je prends, tu prends, il/elle prend, nous prenons, vous prenez, ils/elles prennent
VENIR (présent): je viens, tu viens, il/elle vient, nous venons, vous venez, ils/elles viennent
PARTIR (présent): je pars, tu pars, il/elle part, nous partons, vous partez, ils/elles partent
PAYER (présent): je paie, tu paies, il/elle paie, nous payons, vous payez, ils/elles paient
COMPRENDRE (présent): same pattern as prendre
PARLER (présent — regular -er model): je parle, tu parles, il/elle parle, nous parlons, vous parlez, ils/elles parlent

PASSÉ COMPOSÉ (je + nous only for top 8):
ÊTRE: j'ai été / nous avons été
AVOIR: j'ai eu / nous avons eu
ALLER: je suis allé(e) / nous sommes allé(e)s
FAIRE: j'ai fait / nous avons fait
VOULOIR: j'ai voulu / nous avons voulu
POUVOIR: j'ai pu / nous avons pu
PRENDRE: j'ai pris / nous avons pris
PARTIR: je suis parti(e) / nous sommes parti(e)s

FUTUR PROCHE (aller + infinitif, je + nous):
je vais + [verb infinitive] — teach the pattern, not per-verb
Cards: "aller + manger → je …?" → "vais manger"
Include: manger, partir, prendre, faire, aller, payer (6 cards × je only)

Generate the conjugation cards following this pattern:
```js
{ id:'conj:etre:je:present', type:'conj', category:'conjugation', verb:'être', pronoun:'je', tense:'present', fr:'être → je … (présent)', en:'suis' }
{ id:'conj:etre:tu:present', type:'conj', category:'conjugation', verb:'être', pronoun:'tu', tense:'present', fr:'être → tu … (présent)', en:'es' }
// etc for all persons and verbs listed above
// For passé composé:
{ id:'conj:aller:je:passe', type:'conj', category:'conjugation', verb:'aller', pronoun:'je', tense:'passé composé', fr:'aller → je … (passé composé)', en:'suis allé(e)' }
// For futur proche:
{ id:'conj:fp:je:manger', type:'conj', category:'conjugation', verb:'manger', pronoun:'je', tense:'futur proche', fr:'manger → je … (futur proche)', en:'vais manger' }
```

**Step 2: Verify**

Run: `node -e "const c = require('./packs/french/cards'); console.log('vocab:', c.filter(x=>x.type==='vocab').length, 'conj:', c.filter(x=>x.type==='conj').length)"`
Expected: vocab count between 150–200, conj count between 60–90.

**Step 3: Commit**

```bash
git add packs/french/cards.js
git commit -m "feat: add packs/french/cards.js with 80/20 survival vocab and conjugation cards"
```

---

### Task 2: Wire cards into pack config

**Files:**
- Modify: `packs/french.js`
- Modify: `api/config.js`

**Step 1: Update `packs/french.js`**

Add at the top:
```js
const cards = require('./french/cards');
```
Add to the exported object:
```js
  cards,
```

**Step 2: Update `api/config.js`**

Change the `res.end(...)` line to include cards:
```js
res.end(JSON.stringify({ name: pack.name, uiCopy: pack.uiCopy, theme: pack.theme, cards: pack.cards }));
```

**Step 3: Verify**

Run: `node -e "const h = require('./api/config'); const res = { setHeader(){}, end(b){ const j=JSON.parse(b); console.log('cards:', j.cards.length); } }; h({method:'GET'}, res)"`
Expected output: `cards: 220` (or similar, 200–270 range)

**Step 4: Commit**

```bash
git add packs/french.js api/config.js
git commit -m "feat: expose pack cards via /api/config"
```

---

### Task 3: Create `api/drill.js`

**Files:**
- Create: `api/drill.js`

**Step 1: Create the file**

```js
// api/drill.js — evaluates a spoken drill answer and returns audio feedback.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TTS_MODEL = process.env.TTS_MODEL || 'gpt-4o-mini-tts';
const pack = require('../packs/' + (process.env.PACK || 'french'));

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function tts(text) {
  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: pack.ttsVoice,
      input: text,
      instructions: pack.ttsInstructions,
      response_format: 'mp3',
    }),
  });
  if (!r.ok) return '';
  return Buffer.from(await r.arrayBuffer()).toString('base64');
}

function normalise(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

function checkAnswer(userAnswer, card) {
  const got = normalise(userAnswer);
  const expected = normalise(card.en);
  if (got === expected) return true;
  // Also accept without pronouns for conj cards (e.g. "vais" matches "je vais")
  if (card.type === 'conj') {
    const parts = expected.split(' ');
    return parts.some(p => p.length > 2 && got.includes(p));
  }
  return false;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }

  const send = (code, obj) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  };

  if (!OPENAI_API_KEY) return send(500, { error: 'No OPENAI_API_KEY' });

  try {
    let body = req.body;
    if (!body || typeof body !== 'object') {
      const raw = await readRawBody(req);
      body = raw ? JSON.parse(raw) : {};
    }

    const { card, userAnswer, ttsOnly, text } = body;

    // ttsOnly mode: just speak a prompt (used to read card prompt aloud)
    if (ttsOnly && text) {
      const audio = await tts(text);
      return send(200, { audio });
    }

    if (!card || !userAnswer) return send(400, { error: 'Missing card or userAnswer' });

    const correct = checkAnswer(userAnswer, card);

    let feedback;
    if (correct) {
      feedback = card.type === 'conj'
        ? `Oui! "${card.en}". Excellent!`
        : `Oui, c'est ça! "${card.fr}" — ${card.en}.`;
    } else {
      feedback = card.type === 'conj'
        ? `Pas tout à fait. La bonne réponse est: ${card.en}.`
        : `Pas tout à fait. C'est "${card.fr}" — ${card.en}.`;
    }

    const audio = await tts(feedback).catch(() => '');
    return send(200, { correct, feedback, audio });
  } catch (err) {
    return send(500, { error: String(err.message || err) });
  }
};
```

**Step 2: Verify**

Run: `node --check api/drill.js && echo ok`
Expected: `ok`

**Step 3: Add route to `server.js`**

After the `/api/config` route, add:
```js
const drillHandler = require('./api/drill.js');
// in the request handler:
if (url.pathname === '/api/drill') return drillHandler(req, res);
```

**Step 4: Commit**

```bash
git add api/drill.js server.js
git commit -m "feat: add api/drill.js for spoken drill evaluation"
```

---

### Task 4: Add SM-2 engine + localStorage to `index.html`

**Files:**
- Modify: `index.html`

**Step 1: Add SM-2 + progress store after the `var LABELS = {...}` block**

Find the line `var LABELS = {` and insert the following block BEFORE it:

```js
  // ── Progress store (localStorage) ───────────────────────────────
  var PROGRESS_KEY = 'frenchy_progress';

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch(e) { return {}; }
  }

  function saveProgress(p) {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch(e) {}
  }

  function getCardState(progress, id) {
    return progress[id] || { ef: 2.5, interval: 0, reps: 0, due: 0, seen: false };
  }

  function sm2Update(state, quality) {
    // quality: 0-2 = wrong, 3-5 = correct
    var s = Object.assign({}, state);
    if (quality < 3) {
      s.reps = 0; s.interval = 1;
    } else {
      if (s.reps === 0) s.interval = 1;
      else if (s.reps === 1) s.interval = 6;
      else s.interval = Math.round(s.interval * s.ef);
      s.reps++;
    }
    s.ef = Math.max(1.3, s.ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    s.due = Date.now() + s.interval * 24 * 60 * 60 * 1000;
    return s;
  }

  function pickNextCard(cards, progress, filterType) {
    var now = Date.now();
    var pool = filterType ? cards.filter(function(c){ return c.type === filterType; }) : cards;
    // Due cards first (review), then unseen (new), skip not-yet-due
    var due = pool.filter(function(c){ var s = getCardState(progress, c.id); return s.reps > 0 && s.due <= now; });
    if (due.length) return due[0];
    var unseen = pool.filter(function(c){ return !getCardState(progress, c.id).seen; });
    if (unseen.length) return unseen[0];
    // All seen but none due — pick soonest due
    var sorted = pool.slice().sort(function(a,b){ return getCardState(progress,a.id).due - getCardState(progress,b.id).due; });
    return sorted[0] || null;
  }

  function markSeen(cardId) {
    var p = loadProgress();
    if (!p[cardId]) p[cardId] = { ef: 2.5, interval: 0, reps: 0, due: 0, seen: false };
    p[cardId].seen = true;
    saveProgress(p);
  }

  function exportProgress() {
    var data = JSON.stringify({ version: 1, progress: loadProgress() }, null, 2);
    var blob = new Blob([data], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'frenchy-progress.json';
    a.click();
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var obj = JSON.parse(e.target.result);
        if (obj && obj.progress) {
          saveProgress(obj.progress);
          toast('Voilà! Progress imported.');
          if (typeof renderDrillUI === 'function') renderDrillUI();
        }
      } catch(err) { toast('Could not read file.'); }
    };
    reader.readAsText(file);
  }
```

**Step 2: Scan assistant replies to mark cards seen**

Find the section in `index.html` where `assistantText` is received from `/api/chat` (look for `data.assistantText`). Add this call right after receiving the response:

```js
scanForCards(data.assistantText || '');
```

Then add the `scanForCards` function near the progress store code:

```js
  function scanForCards(text) {
    if (!_pack || !_pack.cards) return;
    var lower = text.toLowerCase();
    _pack.cards.forEach(function(card) {
      if (card.type === 'vocab') {
        var frLower = card.fr.toLowerCase().replace(/^(le|la|les|l\'|un|une|des)\s+/,'');
        if (lower.includes(frLower)) markSeen(card.id);
      }
    });
  }
```

**Step 3: Verify syntax**

Run: `grep -c "sm2Update\|loadProgress\|pickNextCard" index.html`
Expected: 3

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add SM-2 engine and localStorage progress store to index.html"
```

---

### Task 5: Add 4-tab bar and mode-switching skeleton to `index.html`

**Files:**
- Modify: `index.html`

**Step 1: Add CSS for tab bar and drill areas**

Find the closing `</style>` tag and insert before it:

```css
  /* ---------- Tab bar ---------- */
  .tabs {
    position: relative; z-index: 2;
    display: flex;
    border-top: 1px solid var(--line);
    background: var(--paper-2);
  }
  .tab {
    flex: 1; padding: 10px 4px 12px;
    font-size: 11px; font-weight: 600; text-align: center;
    color: var(--ink-soft); cursor: pointer; user-select: none;
    border: none; background: none; letter-spacing: 0.04em;
    text-transform: uppercase;
    transition: color 0.15s;
  }
  .tab.active { color: var(--terracotta-deep); border-top: 2px solid var(--terracotta); margin-top: -1px; }
  .tab-icon { display: block; font-size: 18px; margin-bottom: 2px; }

  /* ---------- Drill UI ---------- */
  .drill-wrap {
    display: none; flex-direction: column; align-items: center;
    justify-content: center; flex: 1; padding: 24px 20px; gap: 20px;
    text-align: center; overflow-y: auto;
  }
  .drill-wrap.active { display: flex; }
  .drill-prompt {
    font-family: 'Fraunces', serif; font-size: 26px; font-weight: 500;
    color: var(--ink); line-height: 1.3;
  }
  .drill-example { font-size: 14px; color: var(--ink-soft); font-style: italic; }
  .drill-feedback {
    font-size: 15px; font-weight: 600; padding: 10px 18px; border-radius: 8px;
    display: none;
  }
  .drill-feedback.correct { background: #e6f4ea; color: #1a6630; display: block; }
  .drill-feedback.wrong { background: #fdecea; color: #8b1a1a; display: block; }
  .drill-options { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 360px; }
  .drill-option {
    padding: 14px 18px; border-radius: 10px; border: 1.5px solid var(--line);
    background: var(--paper-2); font-size: 15px; cursor: pointer; text-align: left;
    transition: background 0.1s, border-color 0.1s;
  }
  .drill-option:active { background: var(--terra-tint); }
  .drill-option.correct-ans { background: #e6f4ea; border-color: #1a6630; }
  .drill-option.wrong-ans { background: #fdecea; border-color: #8b1a1a; }
  .drill-next {
    margin-top: 8px; padding: 12px 28px; border-radius: 24px;
    background: var(--terracotta); color: white; border: none;
    font-size: 15px; font-weight: 600; cursor: pointer; display: none;
  }
  .drill-next.show { display: block; }
  .drill-stats { font-size: 12px; color: var(--ink-soft); }
  .export-row { display: flex; gap: 10px; margin-top: 8px; }
  .export-btn {
    flex: 1; padding: 10px; border-radius: 8px; border: 1.5px solid var(--line);
    background: var(--paper-2); font-size: 13px; cursor: pointer; color: var(--ink);
    font-weight: 500;
  }
```

**Step 2: Replace the existing dock HTML with tab bar + mode panels**

Find in the HTML body:
```html
  <div class="dock">
```
and its closing `</div>`.

Replace the entire `<div class="dock">...</div>` block with:

```html
  <div id="drill-vocab" class="drill-wrap"></div>
  <div id="drill-grammar" class="drill-wrap"></div>
  <div id="drill-silent" class="drill-wrap"></div>

  <div class="dock" id="dock">
    <button class="mic" id="mic" aria-label="Tap to speak">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3"></rect>
        <path d="M5 10a7 7 0 0 0 14 0"></path>
        <line x1="12" y1="19" x2="12" y2="22"></line>
      </svg>
    </button>
    <div class="miclabel" id="miclabel">Appuyez pour parler · Tap to speak</div>
  </div>

  <nav class="tabs" id="tabs">
    <button class="tab active" data-mode="convo"><span class="tab-icon">💬</span>Convo</button>
    <button class="tab" data-mode="vocab"><span class="tab-icon">🗣️</span>Vocab</button>
    <button class="tab" data-mode="grammar"><span class="tab-icon">✏️</span>Grammar</button>
    <button class="tab" data-mode="silent"><span class="tab-icon">🔇</span>Silent</button>
  </nav>
```

**Step 3: Add mode-switching JS**

Add this after the progress store code:

```js
  // ── Mode switching ───────────────────────────────────────────────
  var currentMode = 'convo';

  function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.tab').forEach(function(t) {
      t.classList.toggle('active', t.dataset.mode === mode);
    });
    // show/hide convo UI
    convo.style.display = (mode === 'convo') ? '' : 'none';
    document.getElementById('dock').style.display = (mode === 'convo' || mode === 'vocab' || mode === 'grammar') ? '' : 'none';
    // show/hide drill panels
    ['vocab','grammar','silent'].forEach(function(m) {
      var el = document.getElementById('drill-' + m);
      if (el) el.classList.toggle('active', mode === m);
    });
    if (mode === 'vocab') renderDrillUI('vocab');
    if (mode === 'grammar') renderDrillUI('grammar');
    if (mode === 'silent') renderSilentUI();
  }

  document.getElementById('tabs').addEventListener('click', function(e) {
    var tab = e.target.closest('.tab');
    if (tab) setMode(tab.dataset.mode);
  });
```

**Step 4: Verify**

Run: `grep -c "setMode\|currentMode\|drill-wrap" index.html`
Expected: at least 6

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add 4-tab bar and mode-switching skeleton"
```

---

### Task 6: Implement Vocab + Grammar spoken drill modes

**Files:**
- Modify: `index.html`

**Step 1: Add `renderDrillUI` and spoken drill logic**

Add this function after `setMode`:

```js
  // ── Spoken drill (Vocab + Grammar) ──────────────────────────────
  var drillCard = null;

  function renderDrillUI(filterType) {
    var panel = document.getElementById('drill-' + filterType);
    if (!panel) return;
    var progress = loadProgress();
    var card = pickNextCard(_pack.cards, progress, filterType === 'grammar' ? 'conj' : 'vocab');
    drillCard = card;

    if (!card) {
      panel.innerHTML = '<div class="drill-prompt">All done! Come back later.</div>';
      return;
    }

    markSeen(card.id);

    // Count due cards
    var now = Date.now();
    var allCards = filterType === 'grammar'
      ? _pack.cards.filter(function(c){ return c.type === 'conj'; })
      : _pack.cards.filter(function(c){ return c.type === 'vocab'; });
    var dueCount = allCards.filter(function(c){ var s = getCardState(progress, c.id); return s.due <= now && s.reps > 0; }).length;

    panel.innerHTML =
      '<div class="drill-stats">' + dueCount + ' due for review</div>' +
      '<div class="drill-prompt">' + card.fr + '</div>' +
      (card.example ? '<div class="drill-example">' + card.example + '</div>' : '') +
      '<div class="drill-feedback" id="drill-fb-' + filterType + '"></div>' +
      '<button class="drill-next" id="drill-next-' + filterType + '" onclick="advanceDrill(\'' + filterType + '\')">Suivant →</button>' +
      '<div class="export-row">' +
        '<button class="export-btn" onclick="exportProgress()">⬇ Export</button>' +
        '<label class="export-btn" style="cursor:pointer">⬆ Import<input type="file" accept=".json" style="display:none" onchange="importProgress(this.files[0])"></label>' +
      '</div>';

    // Auto-read the prompt aloud
    readCardPrompt(card);
  }

  function readCardPrompt(card) {
    fetch('/api/drill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ttsOnly: true, text: card.fr }),
    })
    .then(function(r){ return r.json(); })
    .then(function(d){ if (d.audio) playAudio(d.audio); })
    .catch(function(){});
  }

  function advanceDrill(filterType) {
    renderDrillUI(filterType);
  }

  // Hook the mic button for drill modes
  var _origStartRecording = null; // set after startRecording is defined

  function drillHandleMic() {
    if (currentMode !== 'vocab' && currentMode !== 'grammar') return false;
    if (!drillCard || busy) return true;
    if (!recording) {
      startRecording();
    } else {
      stopRecording(function(audioBase64, mimeType) {
        setMic('processing');
        busy = true;
        // Transcribe then evaluate
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: audioBase64, mimeType: mimeType, history: [], text: '' }),
        })
        .then(function(r){ return r.json(); })
        .then(function(d) {
          return fetch('/api/drill', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ card: drillCard, userAnswer: d.userText }),
          });
        })
        .then(function(r){ return r.json(); })
        .then(function(d) {
          busy = false;
          setMic('idle');
          var filterType = currentMode;
          var fb = document.getElementById('drill-fb-' + filterType);
          var nextBtn = document.getElementById('drill-next-' + filterType);
          if (fb) {
            fb.textContent = d.feedback;
            fb.className = 'drill-feedback ' + (d.correct ? 'correct' : 'wrong');
          }
          if (nextBtn) nextBtn.classList.add('show');
          // SM-2 update
          var progress = loadProgress();
          var quality = d.correct ? 4 : 1;
          progress[drillCard.id] = sm2Update(getCardState(progress, drillCard.id), quality);
          saveProgress(progress);
          if (d.audio) playAudio(d.audio);
        })
        .catch(function(err) { busy = false; setMic('idle'); toast('Error: ' + err.message); });
      });
    }
    return true;
  }
```

Note: The `stopRecording` call above needs to match the existing recording API in `index.html`. Read the existing code to see how `stopRecording` is called — it may use a different pattern (event-based vs callback). Adapt accordingly to match the existing pattern.

**Step 2: Hook drill mic into existing mic click handler**

Find the existing mic click handler (look for `mic.addEventListener('click'` or similar). At the TOP of that handler, add:

```js
    if (drillHandleMic()) return;
```

**Step 3: Verify**

Run: `grep -c "renderDrillUI\|drillHandleMic\|advanceDrill" index.html`
Expected: at least 6

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: implement spoken vocab and grammar drill modes"
```

---

### Task 7: Implement Silent mode (tap UI)

**Files:**
- Modify: `index.html`

**Step 1: Add `renderSilentUI` function**

Add after `advanceDrill`:

```js
  // ── Silent mode ──────────────────────────────────────────────────
  var silentCard = null;
  var silentAnswered = false;

  function getDistractors(card, count) {
    var pool = _pack.cards.filter(function(c) {
      return c.id !== card.id && c.type === card.type && c.category === card.category;
    });
    if (pool.length < count) {
      // fall back to same type, different category
      pool = _pack.cards.filter(function(c){ return c.id !== card.id && c.type === card.type; });
    }
    // shuffle and take count
    pool = pool.slice().sort(function(){ return Math.random() - 0.5; });
    return pool.slice(0, count).map(function(c){ return c.en; });
  }

  function renderSilentUI() {
    var panel = document.getElementById('drill-silent');
    if (!panel) return;
    var progress = loadProgress();
    // Silent drills both vocab and conj
    var card = pickNextCard(_pack.cards, progress, null);
    silentCard = card;
    silentAnswered = false;

    if (!card) {
      panel.innerHTML = '<div class="drill-prompt">All done! Come back later.</div>';
      return;
    }

    markSeen(card.id);

    var correctAnswer = card.en;
    var distractors = getDistractors(card, 3);
    var options = [correctAnswer].concat(distractors).sort(function(){ return Math.random() - 0.5; });

    var optionsHTML = options.map(function(opt) {
      return '<button class="drill-option" onclick="silentAnswer(this, \'' + opt.replace(/'/g, "\\'") + '\')">' + opt + '</button>';
    }).join('');

    var now = Date.now();
    var dueCount = _pack.cards.filter(function(c){ var s = getCardState(progress, c.id); return s.due <= now && s.reps > 0; }).length;

    panel.innerHTML =
      '<div class="drill-stats">' + dueCount + ' due for review</div>' +
      '<div class="drill-prompt">' + card.fr + '</div>' +
      (card.example ? '<div class="drill-example">' + card.example + '</div>' : '') +
      '<div class="drill-options" id="silent-options">' + optionsHTML + '</div>' +
      '<div class="drill-feedback" id="silent-fb"></div>' +
      '<button class="drill-next show" id="silent-next" onclick="renderSilentUI()" style="display:none">Suivant →</button>' +
      '<div class="export-row">' +
        '<button class="export-btn" onclick="exportProgress()">⬇ Export</button>' +
        '<label class="export-btn" style="cursor:pointer">⬆ Import<input type="file" accept=".json" style="display:none" onchange="importProgress(this.files[0])"></label>' +
      '</div>';
  }

  function silentAnswer(btn, chosen) {
    if (silentAnswered || !silentCard) return;
    silentAnswered = true;
    var correct = normalise(chosen) === normalise(silentCard.en);

    // Highlight options
    document.querySelectorAll('.drill-option').forEach(function(b) {
      if (normalise(b.textContent) === normalise(silentCard.en)) b.classList.add('correct-ans');
      else if (b === btn && !correct) b.classList.add('wrong-ans');
    });

    // Feedback
    var fb = document.getElementById('silent-fb');
    if (fb) {
      fb.textContent = correct ? '✓ Correct!' : '✗ ' + silentCard.fr + ' = ' + silentCard.en;
      fb.className = 'drill-feedback ' + (correct ? 'correct' : 'wrong');
    }

    // Show next button
    var nextBtn = document.getElementById('silent-next');
    if (nextBtn) nextBtn.style.display = 'block';

    // SM-2 update
    var progress = loadProgress();
    var quality = correct ? 4 : 1;
    progress[silentCard.id] = sm2Update(getCardState(progress, silentCard.id), quality);
    saveProgress(progress);
  }

  function normalise(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9\s]/g,'').trim();
  }
```

Note: `normalise` may already exist from Task 3 in `api/drill.js` — but this is the client-side copy in `index.html`, which is a separate file and needs its own copy.

**Step 2: Verify**

Run: `grep -c "renderSilentUI\|silentAnswer\|getDistractors" index.html`
Expected: at least 6

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: implement silent tap-to-answer drill mode with SM-2"
```

---

### Task 8: Final integration check and deploy

**Step 1: Check git log — expect 7 new commits since Task 6 start**

Run: `git log --oneline -10`

**Step 2: Syntax check**

Run: `node --check api/drill.js && node -e "require('./api/config'); require('./api/chat'); console.log('ok')"`
Expected: `ok`

**Step 3: Local smoke test**

Start: `OPENAI_API_KEY=dummy node server.js`
Curl: `curl -s http://localhost:3000/api/config | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log('cards:', j.cards.length)"`
Expected: cards count > 200
Stop server.

**Step 4: Deploy**

Run: `vercel --prod`

**Step 5: Verify live**

Curl the live `/api/config` and confirm cards are present.

**Step 6: Commit anything remaining**

```bash
git status  # should be clean
```
