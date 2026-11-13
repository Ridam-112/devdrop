const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT_DIR = 'C:\\Users\\thrid\\Downloads';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // Default routes
  if (reqPath === '/' || reqPath === '/warehouse' || reqPath === '/tdm') {
    reqPath = '/Warehouse TDM.html';
  }

  let filePath = path.join(ROOT_DIR, reqPath);

  // Security check
  if (!filePath.startsWith(ROOT_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Check in game subfolder
      const altPath = path.join(ROOT_DIR, 'game', reqPath);
      fs.stat(altPath, (err2, stats2) => {
        if (err2 || !stats2.isFile()) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(`<h1>404 Not Found</h1><p><a href="/Warehouse%20TDM.html">Go to Warehouse TDM</a></p>`);
          return;
        }
        serveFile(altPath, res);
      });
      return;
    }
    serveFile(filePath, res);
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(`🎮 Warehouse TDM Localhost Server Running!`);
  console.log(`👉 Access URL: http://localhost:${PORT}/`);
  console.log(`👉 Direct URL: http://localhost:${PORT}/Warehouse%20TDM.html`);
  console.log(`=================================================`);
});
