/**
 * Language Storage Service
 *
 * Provides localStorage-based persistence for anonymous user language preferences.
 * This service handles storing, retrieving, and validating language settings
 * for users who are not logged in.
 */

const LANGUAGE_STORAGE_KEY = 'rcruit-flow-language';
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'nl'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Language storage service for managing anonymous user language preferences.
 * Uses localStorage to persist language selection across browser sessions.
 */
export const languageStorage = {
  /**
   * Retrieves the stored language preference.
   * Falls back to default language if no valid preference is stored.
   *
   * @returns The stored language or default language ('en')
   */
  get(): SupportedLanguage {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
        return stored as SupportedLanguage;
      }
    } catch (error) {
      // localStorage may not be available (e.g., private browsing, SSR)
      console.warn('Unable to access localStorage for language preference:', error);
    }
    return DEFAULT_LANGUAGE;
  },

  /**
   * Stores the user's language preference.
   *
   * @param language - The language code to store
   */
  set(language: SupportedLanguage): void {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      // localStorage may not be available or quota exceeded
      console.warn('Unable to save language preference to localStorage:', error);
    }
  },

  /**
   * Removes the stored language preference.
   * Useful when user logs in and preference should come from their profile.
   */
  remove(): void {
    try {
      localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to remove language preference from localStorage:', error);
    }
  },

  /**
   * Type guard to check if a language string is a supported language.
   *
   * @param language - The language string to validate
   * @returns True if the language is supported
   */
  isSupported(language: string): language is SupportedLanguage {
    return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
  },
};

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };
