/**
 * Local Development Server for YouTube Playables Test Suite
 * 
 * Enforces YouTube's exact Content Security Policy (CSP) headers as documented in:
 * https://developers.google.com/youtube/gaming/playables/reference/test_suite_guide
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PLAYABLE_DIR = path.join(__dirname, 'sledge_rider_playable');

const CSP_HEADER = "default-src 'none'; script-src 'report-sample' 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.youtube.com/game_api/v0 https://www.youtube.com/game_api/v0/ https://www.youtube.com/game_api/v1 https://www.youtube.com/game_api/v1/; object-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data:; media-src 'self' blob:; font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' blob: data:; sandbox allow-pointer-lock allow-same-origin allow-scripts; base-uri 'self'; manifest-src 'self'; worker-src 'self' blob:";

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  
  const filePath = path.join(PLAYABLE_DIR, reqPath);
  
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_MAP[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Security-Policy': CSP_HEADER,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n======================================================`);
  console.log(`🎮 YouTube Playables Test Suite Server Running!`);
  console.log(`📍 URL: http://localhost:${PORT}/`);
  console.log(`🔒 Content Security Policy (CSP) Active`);
  console.log(`======================================================\n`);
  console.log(`To test in YouTube Playables Test Suite:`);
  console.log(`1. Open https://developers.google.com/youtube/gaming/playables/reference/test_suite_guide`);
  console.log(`2. Enter your Game URL: http://localhost:${PORT}/`);
  console.log(`3. Press Ctrl+C in terminal to stop server.\n`);
});
