/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@underdog/core',
    '@underdog/admin',
    '@underdog/database',
  ],
};

module.exports = nextConfig;
