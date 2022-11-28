import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["**/*.integration.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
  }),
);
