// Frenchy — optional self-hosting server for a VPS (no dependencies).
// Vercel users can ignore this file. To run on your own box:
//   export OPENAI_API_KEY=sk-...   &&   node server.js
// Then put it behind Nginx with HTTPS (the microphone requires a secure origin).

const http = require('http');
const fs = require('fs');
const path = require('path');
const chatHandler = require('./api/chat.js');
const configHandler = require('./api/config.js');
const drillHandler = require('./api/drill.js');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/chat') {
    return chatHandler(req, res);
  }

  if (url.pathname === '/api/config') {
    return configHandler(req, res);
  }

  if (url.pathname === '/api/drill') {
    return drillHandler(req, res);
  }

  let pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const safe = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(ROOT, safe);

  if (!filePath.startsWith(ROOT)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fall back to the app shell for unknown GET routes.
      if (req.method === 'GET') {
        return fs.readFile(path.join(ROOT, 'index.html'), (e2, d2) => {
          if (e2) { res.statusCode = 404; return res.end('Not found'); }
          res.setHeader('Content-Type', MIME['.html']);
          res.end(d2);
        });
      }
      res.statusCode = 404;
      return res.end('Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Frenchy running on http://localhost:${PORT}`);
});
