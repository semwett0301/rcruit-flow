export const mockGptService = {
  chat: jest.fn().mockResolvedValue('{"response": "mocked gpt response"}'),
};

export const createMockGptService = (overrides = {}) => ({
  ...mockGptService,
  ...overrides,
});
