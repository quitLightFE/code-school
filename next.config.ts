import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true
};

// export default nextConfig;

// const withNextIntl = createNextIntlPlugin();
const withNextIntl = createNextIntlPlugin();

// const nextConfig = {};

export default withNextIntl(nextConfig);
