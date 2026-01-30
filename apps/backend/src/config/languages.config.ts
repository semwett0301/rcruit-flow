/**
 * Language Configuration
 *
 * This module defines the supported languages for the application,
 * provides type definitions, and utility functions for language validation.
 */

/**
 * Array of supported language codes.
 * Uses ISO 639-1 two-letter language codes.
 */
export const SUPPORTED_LANGUAGES = ['en', 'nl', 'de', 'fr'] as const;

/**
 * Type representing a valid supported language code.
 * Derived from the SUPPORTED_LANGUAGES array for type safety.
 */
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * The default language used when no language is specified
 * or when an unsupported language is requested.
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * Type guard to check if a given string is a supported language.
 *
 * @param lang - The language code to validate
 * @returns True if the language is supported, false otherwise
 *
 * @example
 * ```typescript
 * const userLang = 'de';
 * if (isLanguageSupported(userLang)) {
 *   // userLang is now typed as SupportedLanguage
 *   setLanguage(userLang);
 * }
 * ```
 */
export function isLanguageSupported(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}
