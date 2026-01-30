/**
 * Language configuration for the frontend application.
 * Defines supported languages, default language, and utility functions
 * for language validation and display.
 */

/**
 * Array of supported language codes.
 * Uses 'as const' for type inference of literal types.
 */
export const SUPPORTED_LANGUAGES = ['en', 'nl', 'de', 'fr'] as const;

/**
 * Type representing a supported language code.
 * Derived from the SUPPORTED_LANGUAGES array for type safety.
 */
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Default language used when no preference is set or stored language is invalid.
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * Local storage key for persisting the user's language preference.
 */
export const LANGUAGE_STORAGE_KEY = 'rcruit-flow-language';

/**
 * Human-readable labels for each supported language.
 * Labels are displayed in their native language for better UX.
 */
export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
};

/**
 * Type guard to check if a string is a supported language code.
 *
 * @param lang - The language code to validate
 * @returns True if the language is supported, false otherwise
 *
 * @example
 * ```ts
 * const userLang = 'de';
 * if (isLanguageSupported(userLang)) {
 *   // userLang is typed as SupportedLanguage here
 *   setLanguage(userLang);
 * }
 * ```
 */
export function isLanguageSupported(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}
