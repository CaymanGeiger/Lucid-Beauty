// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'www.micropigmentation.academy',
        'static4.depositphotos.com','img.freepik.com',
        'images.pexels.com'],
    },
};

module.exports = nextConfig;
