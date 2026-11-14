import { base } from '../base.js';

// Words live in JSON, one set per language: en.json / es.json for the shared parts,
// and en/<page>.json / es/<page>.json for page bodies. Each file's top-level groups are merged,
// so en/home.json holding { "home": {...} } is read as t('home.hero').
const files = import.meta.glob(['./*.json', './*/*.json'], { eager: true, import: 'default' });
const dicts = { en: {}, es: {} };
for (const [path, data] of Object.entries(files)) Object.assign(dicts[path.split('/')[1].replace('.json', '')], data);

export const LANGS = ['en', 'es'];

// t('nav.workshops', 'es') gives that string in that language.
// A missing key stops the build, so a page never ships with a blank or a raw key.
export function t(key, lang = 'en') {
  const v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), dicts[lang]);
  if (v == null) throw new Error(`Missing ${lang} text: ${key}`);
  return v;
}

// The page's language: Spanish pages live under /es/ (Astro i18n sets currentLocale from the URL).
export const langOf = (Astro) => (Astro.currentLocale === 'es' ? 'es' : 'en');

// In a component: const { t, lang, home } = useT(Astro);
// home is the language's root for page links: /owntwofeet/ or /owntwofeet/es/.
export function useT(Astro) {
  const lang = langOf(Astro);
  return { lang, t: (key) => t(key, lang), home: base + (lang === 'es' ? 'es/' : '') };
}

// The same page in the other language: /owntwofeet/story/ <-> /owntwofeet/es/story/
export function twinPath(pathname) {
  const es = base + 'es/';
  if (pathname.startsWith(es)) return base + pathname.slice(es.length);
  if (pathname + '/' === es) return base;
  return es + pathname.slice(base.length);
}
