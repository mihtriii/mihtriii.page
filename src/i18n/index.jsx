import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './locales/en.js';
import vi from './locales/vi.js';

const dictionaries = { en, vi };

const I18nCtx = createContext({
  lang: 'en',
  t: (key, params) => key,
  setLang: () => {}
});

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
}

function format(str, params) {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (params[k] ?? ''));
}

export function I18nProvider({ children }) {
  const detect = () => {
    try {
      const saved = localStorage.getItem('ui:lang');
      if (saved === 'vi' || saved === 'en') return saved;
    } catch {}
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.startsWith('vi') ? 'vi' : 'en';
  };
  const [lang, setLang] = useState(detect);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem('ui:lang', lang); } catch {}
  }, [lang]);

  const t = useMemo(() => {
    return (key, params) => {
      const dict = dictionaries[lang] || dictionaries.en;
      const alt = dictionaries.en;
      const val = get(dict, key) ?? get(alt, key) ?? key;
      if (typeof val === 'string') return format(val, params);
      return String(val);
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() { return useContext(I18nCtx); }

