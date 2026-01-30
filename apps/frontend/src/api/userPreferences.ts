/**
 * API client functions for user language preferences.
 * Provides methods to get and update user preferences including language settings.
 */

import { apiClient } from './client';
import type { SupportedLanguage } from '../services/languageStorage';

/**
 * User preferences interface containing language and other user settings.
 */
export interface UserPreferences {
  language: SupportedLanguage;
}

/**
 * API client for user preferences operations.
 */
export const userPreferencesApi = {
  /**
   * Fetches the current user's preferences from the server.
   * @returns Promise resolving to the user's preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    const response = await apiClient.get('/users/me/preferences');
    return response.data;
  },

  /**
   * Updates the current user's language preference.
   * @param language - The new language to set for the user
   * @returns Promise resolving when the update is complete
   */
  async updateLanguage(language: SupportedLanguage): Promise<void> {
    await apiClient.patch('/users/me/language', { language });
  },
};
