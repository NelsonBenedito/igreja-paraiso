import type { NextConfig } from "next";
import { buildRemotePatterns } from "./src/lib/media/remote-patterns";

const nextConfig: NextConfig = {
  images: {
    // Hosts atuais + SITE_MEDIA_HOSTNAMES (mídia do painel/R2). Lida no build.
    remotePatterns: buildRemotePatterns(process.env.SITE_MEDIA_HOSTNAMES),
  },
};

export default nextConfig;
