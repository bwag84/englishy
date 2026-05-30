// api/config.js — returns pack metadata to the frontend.
const pack = require('../packs/' + (process.env.PACK || 'english-child'));

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ name: pack.name, uiCopy: pack.uiCopy, theme: pack.theme, cards: pack.cards }));
};
