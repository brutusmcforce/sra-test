import fi from "./fi";
import sv from "./sv";
import en from "./en";

export const SUPPORTED_LOCALES = ["fi", "sv", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "sv";

export const messages = { fi, sv, en };

export function detectLocale(): SupportedLocale {
  const stored = localStorage.getItem("locale");
  if (stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)) {
    return stored as SupportedLocale;
  }
  return DEFAULT_LOCALE;
}
