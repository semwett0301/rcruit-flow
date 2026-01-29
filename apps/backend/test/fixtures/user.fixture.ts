import type { CreateUserRequest } from '@repo/dto';

export const createUserFixture: CreateUserRequest = {
  name: 'John Doe',
  email: 'john.doe@example.com',
};

export const createUserFixtures = (count: number): CreateUserRequest[] => {
  return Array.from({ length: count }, (_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }));
};
