/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Only run the page generator during development
if (process.env.NODE_ENV === 'development') {
  // Simple synchronous integration
  require('next-page-generator/dist/cli');
}

module.exports = nextConfig;
