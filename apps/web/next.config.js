/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  basePath: '/trueminds',
  assetPrefix: '/trueminds/',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  transpilePackages: ['@trueminds/npc', '@trueminds/gm', '@trueminds/prompt', '@trueminds/llm'],
};
