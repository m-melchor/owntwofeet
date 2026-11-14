import { defineConfig } from 'astro/config';

// GitHub Pages serves this repo at m-melchor.github.io/owntwofeet/
export default defineConfig({
  site: 'https://m-melchor.github.io',
  base: '/owntwofeet',
  // Keep the HTML exactly as written while the old page is being ported.
  compressHTML: false,
  // Page files keep their names: privacy.astro -> privacy.html, manuals/money -> manuals/money.html, workshops/index.astro -> workshops/.
  build: { format: 'preserve' },
  // Spanish pages live under /es/ (src/pages/es/ wraps the English pages); Astro.currentLocale tells a component which words to use.
  i18n: { locales: ['en', 'es'], defaultLocale: 'en', routing: { prefixDefaultLocale: false } },
});
