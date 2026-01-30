/**
 * LanguageProvider Component
 *
 * Initializes and manages the application language on load.
 * Handles language preference synchronization between local storage
 * and user preferences API for authenticated users.
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { languageStorage } from '../services/languageStorage';
import { useAuth } from '../hooks/useAuth';
import { userPreferencesApi } from '../api/userPreferences';

interface LanguageProviderProps {
  /** Child components to render after language initialization */
  children: React.ReactNode;
}

/**
 * Provider component that initializes the application language.
 *
 * Language initialization priority:
 * 1. For authenticated users: Fetch from user preferences API
 * 2. Fallback to localStorage value
 * 3. Default to i18n configured default language
 *
 * @param props - Component props
 * @param props.children - Child components to render
 * @returns The children wrapped in the language context, or null while initializing
 *
 * @example
 * ```tsx
 * <LanguageProvider>
 *   <App />
 * </LanguageProvider>
 * ```
 */
export function LanguageProvider({ children }: LanguageProviderProps): React.ReactElement | null {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initLanguage = async (): Promise<void> => {
      // Start with locally stored language preference
      let language = languageStorage.get();

      // For authenticated users, try to fetch language from user preferences
      if (isAuthenticated) {
        try {
          const prefs = await userPreferencesApi.getPreferences();
          language = prefs.language;
          // Sync the fetched preference to local storage
          languageStorage.set(language);
        } catch {
          // If API call fails, continue with localStorage fallback
          // This ensures the app remains functional even with network issues
        }
      }

      // Apply the determined language to i18n
      await i18n.changeLanguage(language);
      setIsInitialized(true);
    };

    initLanguage();
  }, [isAuthenticated, i18n]);

  // Don't render children until language is initialized
  // This prevents flash of untranslated content
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}

export default LanguageProvider;
