/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "imgix",
    path: "",
    domains: ["images.prismic.io"],
  },
  async rewrites() {
    return [
      {
        source: "/articles/",
        destination: "/",
      },
      {
        source: "/projects/",
        destination: "/",
      },
      {
        source: "/creators/",
        destination: "/",
      },
    ];
  },
};

module.exports = nextConfig;
