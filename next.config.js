// import { API } from "./config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API: 'http://localhost:8081',
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
