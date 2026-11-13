const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIRS = [
  path.resolve(__dirname),
  path.resolve('C:\\Users\\thrid\\Downloads')
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '/hub') {
    reqPath = '/hub.html';
  } else if (reqPath === '/tejas') {
    reqPath = '/tejas_3d.html';
  } else if (reqPath === '/riverbend' || reqPath === '/airstrip') {
    reqPath = '/riverbend_airstrip_3d.html';
  } else if (reqPath === '/runway_upgrade') {
    reqPath = '/riverbend_airstrip_3d_runway_upgrade.html';
  } else if (reqPath === '/carrier') {
    reqPath = '/carrier_3d_model.html';
  } else if (reqPath === '/carrier_realistic') {
    reqPath = '/carrier_3d_model_realistic.html';
  } else if (reqPath === '/dogfight' || reqPath === '/game' || reqPath === '/dogfight_game') {
    reqPath = '/dogfight_game.html';
  } else if (reqPath === '/standalone') {
    reqPath = '/tejas_3d_standalone.html';
  }

  let foundFile = null;
  for (const dir of DIRS) {
    const candidate = path.join(dir, reqPath);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      foundFile = candidate;
      break;
    }
  }

  if (!foundFile) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + reqPath);
    return;
  }

  const ext = path.extname(foundFile).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(foundFile, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`3D SHOWCASE SERVER RUNNING AT http://localhost:${PORT}/`);
  console.log(`- Master Hub Portal:        http://localhost:${PORT}/`);
  console.log(`- 3D Dogfight Arena Game:   http://localhost:${PORT}/dogfight_game.html`);
  console.log(`- Riverbend Airstrip 3D:    http://localhost:${PORT}/riverbend_airstrip_3d.html`);
  console.log(`- Aircraft Carrier 3D Deck: http://localhost:${PORT}/carrier_3d_model_realistic.html`);
  console.log(`- HAL Tejas Fighter Jet:    http://localhost:${PORT}/tejas_3d.html`);
  console.log(`====================================================`);
});
