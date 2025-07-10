import pdfParse from 'pdf-parse';

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const result = await pdfParse(buffer);
    return result.text;
  } catch (error) {
    throw new Error(
      `It was impossible to extract text from PDF: ${error.message}`,
    );
  }
}
