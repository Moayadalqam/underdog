import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@underdog/core', '@underdog/database', '@underdog/auth'],
};

export default nextConfig;
