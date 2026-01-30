/**
 * Custom hook for managing language preference with persistence.
 *
 * This hook handles language preference management with the following features:
 * - Initializes language from user preferences (authenticated) or localStorage (anonymous)
 * - Persists language changes to both localStorage and backend (when authenticated)
 * - Syncs language state with i18n instance
 */

import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { languageStorage, SupportedLanguage } from '../services/languageStorage';
import { userPreferencesApi } from '../api/userPreferences';
import { useAuth } from './useAuth';

/** List of supported languages in the application */
const SUPPORTED_LANGUAGES = ['en', 'nl'] as const;

export interface UseLanguagePreferenceReturn {
  /** Currently active language */
  currentLanguage: SupportedLanguage;
  /** Function to change the language with persistence */
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  /** List of supported languages */
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

/**
 * Hook for managing language preference with automatic persistence.
 *
 * For authenticated users:
 * - Fetches language preference from backend on mount
 * - Saves language changes to both localStorage and backend
 *
 * For anonymous users:
 * - Uses localStorage for persistence
 *
 * @returns Object containing current language, change function, and supported languages
 *
 * @example
 * ```tsx
 * function LanguageSelector() {
 *   const { currentLanguage, changeLanguage, supportedLanguages } = useLanguagePreference();
 *
 *   return (
 *     <select
 *       value={currentLanguage}
 *       onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
 *     >
 *       {supportedLanguages.map((lang) => (
 *         <option key={lang} value={lang}>{lang}</option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export function useLanguagePreference(): UseLanguagePreferenceReturn {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();

  // Initialize language on mount and when authentication state changes
  useEffect(() => {
    const initLanguage = async () => {
      let language: SupportedLanguage;

      if (isAuthenticated) {
        try {
          // Fetch language preference from backend for authenticated users
          const prefs = await userPreferencesApi.getPreferences();
          language = prefs.language;
          // Sync to localStorage for offline access
          languageStorage.set(language);
        } catch {
          // Fallback to localStorage if backend request fails
          language = languageStorage.get();
        }
      } else {
        // Use localStorage for anonymous users
        language = languageStorage.get();
      }

      // Only change language if it differs from current
      if (i18n.language !== language) {
        await i18n.changeLanguage(language);
      }
    };

    initLanguage();
  }, [isAuthenticated, i18n]);

  /**
   * Changes the application language and persists the preference.
   *
   * @param language - The language code to switch to
   */
  const changeLanguage = useCallback(
    async (language: SupportedLanguage) => {
      // Always save to localStorage for immediate persistence
      languageStorage.set(language);

      // If authenticated, also save to backend for cross-device sync
      if (isAuthenticated) {
        try {
          await userPreferencesApi.updateLanguage(language);
        } catch (error) {
          // Log error but don't block the language change
          console.error('Failed to save language preference to server:', error);
        }
      }

      // Update i18n instance to trigger re-renders
      await i18n.changeLanguage(language);
    },
    [isAuthenticated, i18n]
  );

  return {
    currentLanguage: i18n.language as SupportedLanguage,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
