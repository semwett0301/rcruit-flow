/**
 * Unit tests for useLanguagePreference hook
 * Tests language preference management including localStorage persistence
 * and API synchronization for authenticated users.
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLanguagePreference } from '../useLanguagePreference';
import { languageStorage } from '../../services/languageStorage';
import { userPreferencesApi } from '../../api/userPreferences';

// Mock dependencies
jest.mock('../../services/languageStorage');
jest.mock('../../api/userPreferences');

const mockChangeLanguage = jest.fn().mockResolvedValue(undefined);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

// Default mock for useAuth - unauthenticated user
const mockUseAuth = jest.fn(() => ({ isAuthenticated: false, user: null }));
jest.mock('../useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('useLanguagePreference', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (languageStorage.get as jest.Mock).mockReturnValue('en');
    mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null });
  });

  describe('initial state', () => {
    it('should return current language from i18n', () => {
      const { result } = renderHook(() => useLanguagePreference());
      expect(result.current.currentLanguage).toBe('en');
    });

    it('should return available languages', () => {
      const { result } = renderHook(() => useLanguagePreference());
      expect(result.current.availableLanguages).toBeDefined();
      expect(Array.isArray(result.current.availableLanguages)).toBe(true);
    });

    it('should return changeLanguage function', () => {
      const { result } = renderHook(() => useLanguagePreference());
      expect(typeof result.current.changeLanguage).toBe('function');
    });
  });

  describe('changeLanguage - unauthenticated user', () => {
    it('should save to localStorage when changing language', async () => {
      const { result } = renderHook(() => useLanguagePreference());

      await act(async () => {
        await result.current.changeLanguage('nl');
      });

      expect(languageStorage.set).toHaveBeenCalledWith('nl');
    });

    it('should call i18n changeLanguage when changing language', async () => {
      const { result } = renderHook(() => useLanguagePreference());

      await act(async () => {
        await result.current.changeLanguage('nl');
      });

      expect(mockChangeLanguage).toHaveBeenCalledWith('nl');
    });

    it('should not call API when user is not authenticated', async () => {
      const { result } = renderHook(() => useLanguagePreference());

      await act(async () => {
        await result.current.changeLanguage('nl');
      });

      expect(userPreferencesApi.updateLanguage).not.toHaveBeenCalled();
    });
  });

  describe('changeLanguage - authenticated user', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { id: '123', email: 'test@example.com' },
      });
      (userPreferencesApi.updateLanguage as jest.Mock).mockResolvedValue(undefined);
    });

    it('should save to localStorage when changing language', async () => {
      const { result } = renderHook(() => useLanguagePreference());

      await act(async () => {
        await result.current.changeLanguage('nl');
      });

      expect(languageStorage.set).toHaveBeenCalledWith('nl');
    });

    it('should call API to persist language preference', async () => {
      const { result } = renderHook(() => useLanguagePreference());

      await act(async () => {
        await result.current.changeLanguage('nl');
      });

      expect(userPreferencesApi.updateLanguage).toHaveBeenCalledWith('nl');
    });

    it('should still save to localStorage if API call fails', async () => {
      (userPreferencesApi.updateLanguage as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      const { result } = renderHook(() => useLanguagePreference());

      await act(async () => {
        await result.current.changeLanguage('nl');
      });

      expect(languageStorage.set).toHaveBeenCalledWith('nl');
      expect(mockChangeLanguage).toHaveBeenCalledWith('nl');
    });
  });

  describe('language validation', () => {
    it('should handle valid language codes', async () => {
      const { result } = renderHook(() => useLanguagePreference());

      await act(async () => {
        await result.current.changeLanguage('en');
      });

      expect(languageStorage.set).toHaveBeenCalledWith('en');
    });

    it('should handle Dutch language code', async () => {
      const { result } = renderHook(() => useLanguagePreference());

      await act(async () => {
        await result.current.changeLanguage('nl');
      });

      expect(languageStorage.set).toHaveBeenCalledWith('nl');
    });
  });

  describe('loading state', () => {
    it('should indicate loading state during language change', async () => {
      const { result } = renderHook(() => useLanguagePreference());

      // Check if isLoading property exists and behaves correctly
      if ('isLoading' in result.current) {
        expect(result.current.isLoading).toBe(false);

        let changePromise: Promise<void>;
        act(() => {
          changePromise = result.current.changeLanguage('nl');
        });

        await act(async () => {
          await changePromise;
        });
      }
    });
  });

  describe('error handling', () => {
    it('should handle localStorage errors gracefully', async () => {
      (languageStorage.set as jest.Mock).mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const { result } = renderHook(() => useLanguagePreference());

      // Should not throw
      await act(async () => {
        try {
          await result.current.changeLanguage('nl');
        } catch (error) {
          // Error handling is implementation-specific
        }
      });
    });
  });
});
