import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  root: "./src",
  base: "/hangman",
  site: "https://guest363.github.io",
  server: { port: 8080 },
});
