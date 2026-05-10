import { createI18n } from 'vue-i18n'
import {
  messages,
  detectLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/locales'

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages,
})

const isSupportedLocale = (l: string): l is SupportedLocale =>
  (SUPPORTED_LOCALES as readonly string[]).includes(l)

export function setLocale(locale: string) {
  if (!isSupportedLocale(locale)) return
  // The composition API's locale is a WritableComputedRef<string>.
  if (typeof i18n.global.locale === 'object' && 'value' in i18n.global.locale) {
    i18n.global.locale.value = locale
  }
  localStorage.setItem('locale', locale)
  document.documentElement.setAttribute('lang', locale)
}
