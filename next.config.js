const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
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
