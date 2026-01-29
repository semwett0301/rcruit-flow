import 'reflect-metadata';

// Global mock for pdf-parse
jest.mock('pdf-parse', () => {
  return jest.fn().mockImplementation((buffer: Buffer) => {
    return Promise.resolve({
      text: 'Mocked PDF content for testing',
      numpages: 1,
      info: {},
      metadata: null,
      version: '1.0.0',
    });
  });
});

// Clear all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  jest.restoreAllMocks();
});
