/**
 * LanguageSwitcher Component
 *
 * A dropdown component that allows users to switch between supported languages.
 * Uses the useLanguagePreference hook to persist language selection.
 */
import React from 'react';
import { useLanguagePreference, SupportedLanguage } from '../hooks/useLanguagePreference';

/**
 * Human-readable labels for each supported language.
 * Displayed in the dropdown options.
 */
const languageLabels: Record<SupportedLanguage, string> = {
  en: 'English',
  nl: 'Nederlands',
};

/**
 * LanguageSwitcher component provides a dropdown select for changing
 * the application language. The selected language is persisted using
 * the useLanguagePreference hook.
 *
 * @returns A select element with language options
 */
export function LanguageSwitcher(): React.ReactElement {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguagePreference();

  /**
   * Handles the language selection change event.
   * Updates the language preference when user selects a new language.
   */
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const newLanguage = event.target.value as SupportedLanguage;
    changeLanguage(newLanguage);
  };

  return (
    <select
      value={currentLanguage}
      onChange={handleChange}
      aria-label="Select language"
    >
      {supportedLanguages.map((lang) => (
        <option key={lang} value={lang}>
          {languageLabels[lang]}
        </option>
      ))}
    </select>
  );
}
