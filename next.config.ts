// import type { NextConfig } from "next";

import { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig : NextConfig= {
  images: {
    domains: ['openstreetmap.org'],
  },
};

module.exports = nextConfig;