import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],
    // outputFileTracingIncludes: {
    //   './**/*': ['./node_modules/@sparticuz/chromium/**'],
    // },
};

export default nextConfig;
