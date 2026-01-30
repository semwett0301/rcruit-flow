/**
 * Language Context
 *
 * Provides language preference management throughout the application.
 * Wraps the useLanguagePreference hook and exposes language state
 * and setter through React Context.
 */

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useLanguagePreference } from '../hooks/useLanguagePreference';
import { SupportedLanguage } from '../config/languages';

/**
 * Shape of the language context value
 */
interface LanguageContextValue {
  /** Current selected language */
  language: SupportedLanguage;
  /** Function to update the language preference */
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  /** Whether the language preference is being loaded */
  isLoading: boolean;
}

/**
 * Language context - undefined when accessed outside of provider
 */
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * Props for the LanguageProvider component
 */
interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Language Provider Component
 *
 * Provides language preference state and management to child components.
 * Also updates the document's lang attribute when language changes.
 *
 * @param props - Component props
 * @param props.children - Child components to wrap
 *
 * @example
 * ```tsx
 * <LanguageProvider>
 *   <App />
 * </LanguageProvider>
 * ```
 */
export function LanguageProvider({ children }: LanguageProviderProps): JSX.Element {
  const { language, setLanguage, isLoading } = useLanguagePreference();

  // Update document lang attribute for accessibility and SEO
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const contextValue: LanguageContextValue = {
    language,
    setLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context
 *
 * Provides access to the current language, setter function, and loading state.
 * Must be used within a LanguageProvider.
 *
 * @returns The language context value
 * @throws Error if used outside of LanguageProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { language, setLanguage, isLoading } = useLanguage();
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <select
 *       value={language}
 *       onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
 *     >
 *       <option value="en">English</option>
 *       <option value="es">Español</option>
 *     </select>
 *   );
 * }
 * ```
 */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}

export { LanguageContext };
export type { LanguageContextValue, LanguageProviderProps };
