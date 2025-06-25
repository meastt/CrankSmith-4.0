/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      typedRoutes: true,
    },
    images: {
      domains: [
        'images.sram.com',
        'bike.shimano.com',
        'content.competitivecyclist.com'
      ],
    },
  }
  
  module.exports = nextConfig