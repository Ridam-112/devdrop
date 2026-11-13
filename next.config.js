const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
  async headers() {
    return [
      {
        // Cache all static games and their assets (HTML, JS, audio, models) for 1 year immutable
        // Browser serves directly from disk cache after 1st load, using 0 Vercel bandwidth on replay
        source: '/games/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        // Long-term cache for images, audio, fonts, and media
        source: '/:path*.(svg|jpg|jpeg|png|webp|avif|ico|mp3|ogg|wav|glb|gltf|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/tools/wifi-hacker',
        destination: '/tools/wifi-hacker-simulator',
        permanent: true,
      },
      {
        source: '/tools/free-fire-hacker',
        destination: '/tools/free-fire-hacker-prank',
        permanent: true,
      },
      {
        source: '/tools/bgmi-hacker',
        destination: '/tools/bgmi-hacker-simulator',
        permanent: true,
      },
      {
        source: '/tools/instagram-prank',
        destination: '/tools/instagram-hacker-simulator',
        permanent: true,
      },
      {
        source: '/tools/location-tracker',
        destination: '/tools/phone-location-prank',
        permanent: true,
      },
      {
        source: '/tools/hacker-terminal',
        destination: '/tools/fake-hacker-terminal',
        permanent: true,
      },
      {
        source: '/tools/password-simulator',
        destination: '/tools/password-strength-checker',
        permanent: true,
      },
      {
        source: '/tools/screen-lock',
        destination: '/tools/phone-unlock-simulator',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
