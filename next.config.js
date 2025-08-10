/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['images.prismic.io'],
        unoptimized: true,
    },
    async rewrites() {
        return [
            {
                source: '/articles/',
                destination: '/',
            },
            {
                source: '/projects/',
                destination: '/',
            },
        ];
    },
};

module.exports = nextConfig;
