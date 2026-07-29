/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // face-api.js ships a node build that references fs/encoding; the browser
  // bundle never touches these, but webpack still tries to resolve them.
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      encoding: false,
    };
    return config;
  },
};

module.exports = nextConfig;
