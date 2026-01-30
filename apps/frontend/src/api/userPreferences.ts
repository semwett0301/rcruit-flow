/**
 * User Preferences API Client
 *
 * This module provides API client functions for managing user preferences,
 * including language settings.
 */

import { apiClient } from './client';
import { SupportedLanguage } from '../config/languages';

/**
 * Response structure for language preference updates
 */
export interface LanguagePreferenceResponse {
  /** The user's selected language */
  language: SupportedLanguage;
  /** ISO timestamp of when the preference was last updated */
  updatedAt: string;
}

/**
 * API client for user preference endpoints
 */
export const userPreferencesApi = {
  /**
   * Retrieves the current user's language preference
   *
   * @returns Promise resolving to the user's language setting
   */
  async getLanguage(): Promise<{ language: SupportedLanguage }> {
    const response = await apiClient.get('/user/preferences/language');
    return response.data;
  },

  /**
   * Updates the current user's language preference
   *
   * @param language - The new language to set for the user
   * @returns Promise resolving to the updated language preference with timestamp
   */
  async updateLanguage(language: SupportedLanguage): Promise<LanguagePreferenceResponse> {
    const response = await apiClient.put('/user/preferences/language', { language });
    return response.data;
  },
};
