import { en } from './en';
import { es } from './es';
import type { Dictionary, Locale } from './types';

export { locales, type Locale } from './types';

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

/** Data that does not change with the language. */
export const profile = {
  name: 'Ismael de la Rosa Guerrero',
  shortName: 'Ismael de la Rosa',
  email: 'ismaeldelarosaguerrero@gmail.com',
  github: 'https://github.com/ide-la-r',
  linkedin: 'https://www.linkedin.com/in/ismael-de-la-rosa-guerrero',
  trayectosLive: 'https://trayectos.onrender.com',
  trayectosCode: 'https://github.com/ide-la-r/Trayectos',
} as const;
