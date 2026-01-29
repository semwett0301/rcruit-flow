import { extractTextFromPdf } from './extractTextFromPdf';
import pdfParse from 'pdf-parse';

jest.mock('pdf-parse');

const mockedPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>;

describe('extractTextFromPdf', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should extract text from a PDF buffer', async () => {
    const expectedText = 'Extracted PDF content';
    mockedPdfParse.mockResolvedValue({
      text: expectedText,
      numpages: 1,
      info: {},
      metadata: null,
      version: '1.0.0',
    });

    const buffer = Buffer.from('mock pdf content');
    const result = await extractTextFromPdf(buffer);

    expect(result).toBe(expectedText);
    expect(mockedPdfParse).toHaveBeenCalledWith(buffer);
  });

  it('should throw an error when PDF parsing fails', async () => {
    const errorMessage = 'PDF is corrupted';
    mockedPdfParse.mockRejectedValue(new Error(errorMessage));

    const buffer = Buffer.from('invalid pdf');

    await expect(extractTextFromPdf(buffer)).rejects.toThrow(
      `It was impossible to extract text from PDF: ${errorMessage}`,
    );
  });

  it('should handle empty PDF content', async () => {
    mockedPdfParse.mockResolvedValue({
      text: '',
      numpages: 0,
      info: {},
      metadata: null,
      version: '1.0.0',
    });

    const buffer = Buffer.from('empty pdf');
    const result = await extractTextFromPdf(buffer);

    expect(result).toBe('');
  });

  it('should handle multi-page PDF content', async () => {
    const multiPageText = 'Page 1 content\nPage 2 content\nPage 3 content';
    mockedPdfParse.mockResolvedValue({
      text: multiPageText,
      numpages: 3,
      info: {},
      metadata: null,
      version: '1.0.0',
    });

    const buffer = Buffer.from('multi page pdf');
    const result = await extractTextFromPdf(buffer);

    expect(result).toBe(multiPageText);
  });
});
