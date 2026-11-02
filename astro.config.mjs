import { defineConfig } from "astro/config";

// Served from the custom domain's root on Cloudflare Pages, so the site is served from root: `base` stays unset.
export default defineConfig({
  site: "https://kaenirr.com",
});
