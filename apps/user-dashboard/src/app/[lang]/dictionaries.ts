import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ta: () => import('./dictionaries/ta.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const locales: Locale[] = ['en', 'ta']
export const defaultLocale: Locale = 'en'

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
