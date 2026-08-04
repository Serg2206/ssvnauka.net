/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
];

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      // RU/UK-аудитория обслуживается на ssvnauka.com (клинический сайт).
      // После создания /ua/ на .com поменять destination для /uk.
      { source: "/ru", destination: "https://ssvnauka.com/", permanent: true },
      { source: "/ru/:path*", destination: "https://ssvnauka.com/", permanent: true },
      { source: "/uk", destination: "https://ssvnauka.com/", permanent: true },
      { source: "/uk/:path*", destination: "https://ssvnauka.com/", permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;
