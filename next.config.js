/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { "utf-8-validate": false, bufferutil: false };
    config.experiments = {
      ...config.experiments,
    };
    return config;
  },
};

module.exports = removeImports(nextConfig);