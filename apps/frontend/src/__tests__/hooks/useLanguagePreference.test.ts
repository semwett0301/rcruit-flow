/**
 * Tests for useLanguagePreference hook
 * 
 * This hook manages language preferences for both guest and authenticated users.
 * - Guest users: preferences stored in localStorage
 * - Authenticated users: preferences synced with server API
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useLanguagePreference } from '../../hooks/useLanguagePreference';
import { languageStorage } from '../../services/languageStorage';
import { userPreferencesApi } from '../../api/userPreferences';
import * as useAuthModule from '../../hooks/useAuth';

jest.mock('../../services/languageStorage');
jest.mock('../../api/userPreferences');
jest.mock('../../hooks/useAuth');

describe('useLanguagePreference', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (languageStorage.getInitialLanguage as jest.Mock).mockReturnValue('en');
    (languageStorage.set as jest.Mock).mockImplementation(() => {});
  });

  describe('guest users (unauthenticated)', () => {
    beforeEach(() => {
      (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    });

    it('should use localStorage for guest users', async () => {
      const { result } = renderHook(() => useLanguagePreference());
      
      await act(async () => {
        await result.current.setLanguage('nl');
      });
      
      expect(languageStorage.set).toHaveBeenCalledWith('nl');
      expect(userPreferencesApi.updateLanguage).not.toHaveBeenCalled();
    });

    it('should initialize with language from localStorage', () => {
      (languageStorage.getInitialLanguage as jest.Mock).mockReturnValue('fr');
      
      const { result } = renderHook(() => useLanguagePreference());
      
      expect(result.current.language).toBe('fr');
      expect(languageStorage.getInitialLanguage).toHaveBeenCalled();
    });

    it('should update language state when setLanguage is called', async () => {
      const { result } = renderHook(() => useLanguagePreference());
      
      expect(result.current.language).toBe('en');
      
      await act(async () => {
        await result.current.setLanguage('de');
      });
      
      expect(result.current.language).toBe('de');
    });

    it('should not call API methods for guest users', async () => {
      const { result } = renderHook(() => useLanguagePreference());
      
      await act(async () => {
        await result.current.setLanguage('es');
      });
      
      expect(userPreferencesApi.getLanguage).not.toHaveBeenCalled();
      expect(userPreferencesApi.updateLanguage).not.toHaveBeenCalled();
    });
  });

  describe('authenticated users', () => {
    beforeEach(() => {
      (useAuthModule.useAuth as jest.Mock).mockReturnValue({ 
        isAuthenticated: true, 
        user: { id: 'user-1' } 
      });
    });

    it('should sync with server for authenticated users', async () => {
      (userPreferencesApi.getLanguage as jest.Mock).mockResolvedValue({ language: 'nl' });
      (userPreferencesApi.updateLanguage as jest.Mock).mockResolvedValue({ language: 'de' });
      
      const { result } = renderHook(() => useLanguagePreference());
      
      await waitFor(() => {
        expect(result.current.language).toBe('nl');
      });
      
      await act(async () => {
        await result.current.setLanguage('de');
      });
      
      expect(userPreferencesApi.updateLanguage).toHaveBeenCalledWith('de');
    });

    it('should fetch language preference from server on mount', async () => {
      (userPreferencesApi.getLanguage as jest.Mock).mockResolvedValue({ language: 'es' });
      
      const { result } = renderHook(() => useLanguagePreference());
      
      await waitFor(() => {
        expect(result.current.language).toBe('es');
      });
      
      expect(userPreferencesApi.getLanguage).toHaveBeenCalled();
    });

    it('should update both server and localStorage when setting language', async () => {
      (userPreferencesApi.getLanguage as jest.Mock).mockResolvedValue({ language: 'en' });
      (userPreferencesApi.updateLanguage as jest.Mock).mockResolvedValue({ language: 'fr' });
      
      const { result } = renderHook(() => useLanguagePreference());
      
      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });
      
      await act(async () => {
        await result.current.setLanguage('fr');
      });
      
      expect(userPreferencesApi.updateLanguage).toHaveBeenCalledWith('fr');
      expect(languageStorage.set).toHaveBeenCalledWith('fr');
    });

    it('should handle API errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (userPreferencesApi.getLanguage as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      const { result } = renderHook(() => useLanguagePreference());
      
      // Should fall back to localStorage value
      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle update API errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (userPreferencesApi.getLanguage as jest.Mock).mockResolvedValue({ language: 'en' });
      (userPreferencesApi.updateLanguage as jest.Mock).mockRejectedValue(new Error('Update failed'));
      
      const { result } = renderHook(() => useLanguagePreference());
      
      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });
      
      await act(async () => {
        try {
          await result.current.setLanguage('de');
        } catch (e) {
          // Expected to throw or handle error
        }
      });
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('authentication state changes', () => {
    it('should refetch from server when user becomes authenticated', async () => {
      (userPreferencesApi.getLanguage as jest.Mock).mockResolvedValue({ language: 'nl' });
      
      const { result, rerender } = renderHook(() => useLanguagePreference());
      
      // Initially unauthenticated
      (useAuthModule.useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
      rerender();
      
      expect(result.current.language).toBe('en');
      
      // User logs in
      (useAuthModule.useAuth as jest.Mock).mockReturnValue({ 
        isAuthenticated: true, 
        user: { id: 'user-1' } 
      });
      rerender();
      
      await waitFor(() => {
        expect(userPreferencesApi.getLanguage).toHaveBeenCalled();
      });
    });
  });

  describe('loading state', () => {
    it('should indicate loading while fetching preferences', async () => {
      (useAuthModule.useAuth as jest.Mock).mockReturnValue({ 
        isAuthenticated: true, 
        user: { id: 'user-1' } 
      });
      
      let resolvePromise: (value: { language: string }) => void;
      (userPreferencesApi.getLanguage as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );
      
      const { result } = renderHook(() => useLanguagePreference());
      
      // Should be loading initially
      expect(result.current.isLoading).toBe(true);
      
      await act(async () => {
        resolvePromise!({ language: 'en' });
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
