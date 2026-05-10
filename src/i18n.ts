import { createI18n } from 'vue-i18n'
import { messages, detectLocale, DEFAULT_LOCALE } from '@/locales'

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages,
})

export function setLocale(locale: string) {
  ;(i18n.global.locale as any).value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.setAttribute('lang', locale)
}
