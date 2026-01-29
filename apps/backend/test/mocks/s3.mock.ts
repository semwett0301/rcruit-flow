export const mockS3Service = {
  uploadFile: jest.fn().mockResolvedValue('test-file-key'),
  getFile: jest.fn().mockResolvedValue(Buffer.from('mock pdf content')),
};

export const createMockS3Service = (overrides = {}) => ({
  ...mockS3Service,
  ...overrides,
});
