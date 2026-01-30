/**
 * Language Storage Service
 *
 * Provides local storage persistence for language preferences.
 * Used for guest users who don't have server-side preference storage.
 * Handles browser language detection and fallback to defaults.
 */

import {
  LANGUAGE_STORAGE_KEY,
  DEFAULT_LANGUAGE,
  isLanguageSupported,
  SupportedLanguage,
} from '../config/languages';

export const languageStorage = {
  /**
   * Retrieves the stored language preference from localStorage.
   * Returns the default language if no valid preference is found.
   *
   * @returns The stored language or default language
   */
  get(): SupportedLanguage {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && isLanguageSupported(stored)) {
        return stored;
      }
    } catch (e) {
      console.warn('Failed to read language from localStorage:', e);
    }
    return DEFAULT_LANGUAGE;
  },

  /**
   * Saves the language preference to localStorage.
   *
   * @param language - The language code to store
   */
  set(language: SupportedLanguage): void {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (e) {
      console.warn('Failed to save language to localStorage:', e);
    }
  },

  /**
   * Detects the user's browser language preference.
   * Falls back to default language if browser language is not supported.
   *
   * @returns The browser's language if supported, otherwise default language
   */
  getBrowserLanguage(): SupportedLanguage {
    const browserLang = navigator.language.split('-')[0];
    return isLanguageSupported(browserLang) ? browserLang : DEFAULT_LANGUAGE;
  },

  /**
   * Determines the initial language to use on app load.
   * Priority:
   * 1. Stored preference (if exists and valid)
   * 2. Browser language (if supported)
   * 3. Default language
   *
   * @returns The initial language to use
   */
  getInitialLanguage(): SupportedLanguage {
    const stored = this.get();
    if (stored !== DEFAULT_LANGUAGE) return stored;

    // If no stored preference, check browser language
    const hasStoredValue = localStorage.getItem(LANGUAGE_STORAGE_KEY) !== null;
    if (!hasStoredValue) {
      return this.getBrowserLanguage();
    }

    return stored;
  },
};
