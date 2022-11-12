import { defineConfig } from "cypress";
import { initPlugin } from "@frsource/cypress-plugin-visual-regression-diff/plugins";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      initPlugin(on, config);
    },
    baseUrl: "http://localhost:5173",
  },

  component: {
    devServer: {
      framework: "svelte",
      bundler: "vite",
    },
    setupNodeEvents(on, config) {
      initPlugin(on, config);
    },
  },
});
