/**
 * Hook for managing user language preference with sync logic.
 * 
 * Handles language preference storage locally and syncs with server
 * for authenticated users. Provides automatic fetching of server-side
 * preferences on authentication and optimistic updates with server sync.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { languageStorage } from '../services/languageStorage';
import { userPreferencesApi } from '../api/userPreferences';
import { SupportedLanguage, DEFAULT_LANGUAGE, isLanguageSupported } from '../config/languages';

export interface UseLanguagePreferenceReturn {
  /** Current language preference */
  language: SupportedLanguage;
  /** Function to update language preference (syncs with server for authenticated users) */
  setLanguage: (newLang: SupportedLanguage) => Promise<void>;
  /** Loading state while fetching language from server */
  isLoading: boolean;
}

/**
 * Custom hook for managing language preference with local storage and server sync.
 * 
 * For unauthenticated users:
 * - Language is stored in local storage only
 * 
 * For authenticated users:
 * - Language is fetched from server on mount/auth change
 * - Language changes are synced to server
 * - Local storage is used as cache
 * 
 * @returns Object containing current language, setter function, and loading state
 * 
 * @example
 * ```tsx
 * function LanguageSelector() {
 *   const { language, setLanguage, isLoading } = useLanguagePreference();
 *   
 *   if (isLoading) return <Spinner />;
 *   
 *   return (
 *     <select value={language} onChange={(e) => setLanguage(e.target.value)}>
 *       <option value="en">English</option>
 *       <option value="es">Español</option>
 *     </select>
 *   );
 * }
 * ```
 */
export function useLanguagePreference(): UseLanguagePreferenceReturn {
  const { isAuthenticated, user } = useAuth();
  const [language, setLanguageState] = useState<SupportedLanguage>(
    languageStorage.getInitialLanguage()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch language from server for authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    userPreferencesApi
      .getLanguage()
      .then(({ language: serverLang }) => {
        if (!isMounted) return;

        if (isLanguageSupported(serverLang)) {
          setLanguageState(serverLang);
          languageStorage.set(serverLang);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch language preference:', error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // Cleanup to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id]);

  /**
   * Updates the language preference.
   * Stores locally and syncs with server for authenticated users.
   * Falls back to default language if provided language is not supported.
   */
  const setLanguage = useCallback(
    async (newLang: SupportedLanguage): Promise<void> => {
      // Validate and fallback to default if not supported
      const validatedLang = isLanguageSupported(newLang) ? newLang : DEFAULT_LANGUAGE;

      // Optimistic update - set local state immediately
      setLanguageState(validatedLang);
      languageStorage.set(validatedLang);

      // Sync with server for authenticated users
      if (isAuthenticated) {
        try {
          await userPreferencesApi.updateLanguage(validatedLang);
        } catch (error) {
          console.error('Failed to sync language preference:', error);
          // Note: We don't revert the local state on failure
          // The local preference is still valid, just not synced
        }
      }
    },
    [isAuthenticated]
  );

  return { language, setLanguage, isLoading };
}
