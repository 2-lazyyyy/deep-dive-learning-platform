import type { NextConfig } from "next";

const redirectsList = Array.from({ length: 26 }, (_, i) => {
  const num = i + 1;
  const hex = num.toString(16).padStart(12, '0');
  const uuid = `30000000-0000-0000-0000-${hex}`;
  return {
    source: `/lesson/${uuid}`,
    destination: `/lesson/${num}`,
    permanent: false,
  };
});

const nextConfig: NextConfig = {
  async redirects() {
    return redirectsList;
  }
};

export default nextConfig;
