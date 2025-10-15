import React, { createContext, useContext, useEffect, useMemo } from 'react';
import en from './locales/en.js';

const dictionary = en;

const I18nCtx = createContext({
  lang: 'en',
  t: (key, params) => key,
});

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
}

function format(str, params) {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? '');
}

export function I18nProvider({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute('lang', 'en');
  }, []);

  const t = useMemo(() => {
    return (key, params) => {
      const val = get(dictionary, key) ?? key;
      if (typeof val === 'string') return format(val, params);
      return String(val);
    };
  }, []);

  const value = useMemo(() => ({ lang: 'en', t }), [t]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}
