/**
 * Unit tests for the language storage service.
 * Tests localStorage-based language preference persistence.
 */
import { languageStorage } from '../languageStorage';

describe('languageStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('get', () => {
    it('should return default language when nothing stored', () => {
      expect(languageStorage.get()).toBe('en');
    });

    it('should return stored language', () => {
      localStorage.setItem('rcruit-flow-language', 'nl');
      expect(languageStorage.get()).toBe('nl');
    });

    it('should return default for invalid stored value', () => {
      localStorage.setItem('rcruit-flow-language', 'invalid');
      expect(languageStorage.get()).toBe('en');
    });
  });

  describe('set', () => {
    it('should store language preference', () => {
      languageStorage.set('nl');
      expect(localStorage.getItem('rcruit-flow-language')).toBe('nl');
    });
  });

  describe('isSupported', () => {
    it('should return true for supported languages', () => {
      expect(languageStorage.isSupported('en')).toBe(true);
      expect(languageStorage.isSupported('nl')).toBe(true);
    });

    it('should return false for unsupported languages', () => {
      expect(languageStorage.isSupported('fr')).toBe(false);
    });
  });
});
