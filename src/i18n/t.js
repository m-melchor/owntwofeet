import en from './en.json';

const dicts = { en };

// t('nav.workshops') gives that string in the page's language.
// A missing key stops the build, so a page never ships with a blank or a raw key.
export function t(key, lang = 'en') {
  const v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), dicts[lang]);
  if (typeof v !== 'string') throw new Error(`Missing ${lang} text: ${key}`);
  return v;
}
