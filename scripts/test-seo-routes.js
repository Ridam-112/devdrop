const http = require('http');

function test(path, expectCode, validateFn) {
  return new Promise((resolve) => {
    const req = http.request({ host: 'localhost', port: 3000, path, method: 'GET' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const passedCode = res.statusCode === expectCode;
        let validExtra = true;
        if (validateFn) {
          try {
            validExtra = validateFn(data, res);
          } catch (e) {
            console.error('Validation error on ' + path, e);
            validExtra = false;
          }
        }
        const ok = passedCode && validExtra;
        console.log((ok ? '✅ PASS' : '❌ FAIL') + ' ' + path + ' -> HTTP ' + res.statusCode + (res.headers.location ? ' (Redirect: ' + res.headers.location + ')' : ''));
        resolve(ok);
      });
    });
    req.on('error', e => {
      console.error('❌ ERR', path, e.message);
      resolve(false);
    });
    req.end();
  });
}

async function run() {
  console.log('--- STARTING SEO & ROUTE ACCEPTANCE VERIFICATION ---');

  const r1 = await test('/tools/wifi-hacker-simulator', 200, (html) => {
    const hasCanonical = html.includes('https://devdrop.vercel.app/tools/wifi-hacker-simulator');
    const hasFaq = html.includes('FAQPage');
    const hasBreadcrumbs = html.includes('BreadcrumbList');
    const hasApp = html.includes('WebApplication');
    return hasCanonical && hasFaq && hasBreadcrumbs && hasApp;
  });

  const r2 = await test('/tools/wifi-hacker', 308, (_, res) => res.headers.location === '/tools/wifi-hacker-simulator');
  const r3 = await test('/tools/location-tracker', 308, (_, res) => res.headers.location === '/tools/phone-location-prank');
  const r4 = await test('/tools/screen-lock', 308, (_, res) => res.headers.location === '/tools/phone-unlock-simulator');

  const r5 = await test('/category/wifi-network', 200, (html) => {
    const hasCanonical = html.includes('https://devdrop.vercel.app/category/wifi-network');
    const hasCol = html.includes('CollectionPage');
    const hasFaq = html.includes('FAQPage');
    return hasCanonical && hasCol && hasFaq;
  });

  const r6 = await test('/', 200, (html) => {
    return html.includes('https://devdrop.vercel.app') && html.includes('WebSite');
  });

  const r7 = await test('/tools', 200, (html) => {
    return html.includes('https://devdrop.vercel.app/tools');
  });

  const r8 = await test('/sitemap.xml', 200, (xml) => {
    return xml.includes('https://devdrop.vercel.app/tools/wifi-hacker-simulator') &&
           !xml.includes('/tools/wifi-hacker<');
  });

  const r9 = await test('/robots.txt', 200, (txt) => {
    return txt.includes('Sitemap: https://devdrop.vercel.app/sitemap.xml');
  });

  console.log('--- ALL ACCEPTANCE TESTS COMPLETE ---');
}

run();
