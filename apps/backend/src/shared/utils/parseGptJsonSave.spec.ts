import { parseGptJsonSafe } from './parseGptJsonSave';

describe('parseGptJsonSafe', () => {
  it('should parse a valid JSON string', () => {
    const raw = '{"name": "John", "age": 30}';
    const result = parseGptJsonSafe<{ name: string; age: number }>(raw);

    expect(result).toEqual({ name: 'John', age: 30 });
  });

  it('should remove markdown json code block and parse', () => {
    const raw = '```json\n{"key": "value"}\n```';
    const result = parseGptJsonSafe<{ key: string }>(raw);

    expect(result).toEqual({ key: 'value' });
  });

  it('should handle JSON with leading/trailing whitespace', () => {
    const raw = '   \n{"data": "test"}\n   ';
    const result = parseGptJsonSafe<{ data: string }>(raw);

    expect(result).toEqual({ data: 'test' });
  });

  it('should handle case-insensitive json marker', () => {
    const raw = '```JSON\n{"result": true}\n```';
    const result = parseGptJsonSafe<{ result: boolean }>(raw);

    expect(result).toEqual({ result: true });
  });

  it('should throw an error for invalid JSON', () => {
    const raw = '{invalid json}';

    expect(() => parseGptJsonSafe(raw)).toThrow(
      /Failed to parse GPT response as JSON/,
    );
  });

  it('should include raw output in error message', () => {
    const raw = 'not json at all';

    expect(() => parseGptJsonSafe(raw)).toThrow(/Raw output: not json at all/);
  });

  it('should handle nested objects', () => {
    const raw = '{"user": {"name": "Test", "address": {"city": "NYC"}}}';
    const result = parseGptJsonSafe(raw);

    expect(result).toEqual({
      user: { name: 'Test', address: { city: 'NYC' } },
    });
  });

  it('should handle arrays', () => {
    const raw = '```json\n["a", "b", "c"]\n```';
    const result = parseGptJsonSafe<string[]>(raw);

    expect(result).toEqual(['a', 'b', 'c']);
  });
});
