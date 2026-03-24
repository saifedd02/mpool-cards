/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers are set in middleware.ts (dynamic, more flexible).
  // Keep this file minimal — only build/runtime config belongs here.
  poweredByHeader: false,
};

export default nextConfig;
