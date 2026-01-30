/**
 * LanguageSelector Component
 *
 * A dropdown component that allows users to select their preferred language.
 * Integrates with the LanguageContext to manage language state across the application.
 */

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, SupportedLanguage } from '../config/languages';

/**
 * LanguageSelector renders a select dropdown for language selection.
 *
 * Features:
 * - Displays all supported languages with their localized labels
 * - Syncs with global language context
 * - Disables selection while language is loading/changing
 * - Accessible with proper aria-label
 *
 * @returns A select element for language selection
 */
export function LanguageSelector(): React.ReactElement {
  const { language, setLanguage, isLoading } = useLanguage();

  /**
   * Handles language selection change events
   * @param e - The change event from the select element
   */
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedLanguage = e.target.value as SupportedLanguage;
    setLanguage(selectedLanguage);
  };

  return (
    <select
      value={language}
      onChange={handleChange}
      disabled={isLoading}
      aria-label="Select language"
      className="language-selector"
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {LANGUAGE_LABELS[lang]}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;
