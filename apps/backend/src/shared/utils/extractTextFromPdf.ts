import pdfParse from 'pdf-parse';

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const result = await pdfParse(buffer);
    return result.text; // Извлечённый текст
  } catch (error) {
    throw new Error(`Не удалось извлечь текст из PDF: ${error.message}`);
  }
}
