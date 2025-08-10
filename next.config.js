/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    trailingSlash: true,
    images: {
        domains: ['images.prismic.io'],
        unoptimized: true,
    },
};

module.exports = nextConfig;
