export function parseGptJsonSafe<T extends object = object>(raw: string): T {
  try {
    const cleaned = raw
      .replace(/```json\s*/i, '')
      .replace(/```$/, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      `Failed to parse GPT response as JSON: ${err.message}\nRaw output: ${raw}`,
    );
  }
}
