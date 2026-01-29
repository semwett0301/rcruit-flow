export const mockUserRepository = {
  save: jest.fn().mockResolvedValue(undefined),
};

export const createMockUserRepository = (overrides = {}) => ({
  ...mockUserRepository,
  ...overrides,
});
