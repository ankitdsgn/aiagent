import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  output: "standalone", // enables .next/standalone
};

export default withFlowbiteReact(nextConfig);
