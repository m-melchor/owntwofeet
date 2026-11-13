import { defineConfig } from 'astro/config';

// GitHub Pages serves this repo at m-melchor.github.io/owntwofeet/
export default defineConfig({
  site: 'https://m-melchor.github.io',
  base: '/owntwofeet',
  // Keep the HTML exactly as written while the old page is being ported.
  compressHTML: false,
});
