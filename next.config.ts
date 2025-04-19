import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["sqlite3", "sequelize"],
};

export default nextConfig;
