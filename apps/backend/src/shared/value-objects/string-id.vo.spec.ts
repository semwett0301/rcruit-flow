import { StringId } from './string-id.vo';

describe('StringId', () => {
  describe('constructor', () => {
    it('should generate a valid UUID when no value is provided', () => {
      const stringId = new StringId();

      expect(stringId.toString()).toBeDefined();
      expect(stringId.toString().length).toBeGreaterThanOrEqual(5);
    });

    it('should accept a valid string value', () => {
      const value = 'valid-id-12345';
      const stringId = new StringId(value);

      expect(stringId.toString()).toBe(value);
    });

    it('should throw an error for an empty string', () => {
      expect(() => new StringId('')).toThrow('Invalid ID');
    });

    it('should throw an error for a string shorter than 5 characters', () => {
      expect(() => new StringId('abcd')).toThrow('Invalid ID');
    });

    it('should accept a string with exactly 5 characters', () => {
      const value = '12345';
      const stringId = new StringId(value);

      expect(stringId.toString()).toBe(value);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      const value = 'test-string-id';
      const stringId = new StringId(value);

      expect(stringId.toString()).toBe(value);
    });
  });

  describe('equals', () => {
    it('should return true for StringIds with the same value', () => {
      const value = 'same-value-12345';
      const stringId1 = new StringId(value);
      const stringId2 = new StringId(value);

      expect(stringId1.equals(stringId2)).toBe(true);
    });

    it('should return false for StringIds with different values', () => {
      const stringId1 = new StringId('value-one-12345');
      const stringId2 = new StringId('value-two-12345');

      expect(stringId1.equals(stringId2)).toBe(false);
    });
  });
});
