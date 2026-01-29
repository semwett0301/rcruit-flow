import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from 'application/user/use-case/create-user.use-case';
import { createUserFixture } from '../../../../test/fixtures/user.fixture';

describe('UsersController', () => {
  let controller: UsersController;
  let mockCreateUserUseCase: jest.Mocked<CreateUserUseCase>;

  beforeEach(async () => {
    mockCreateUserUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<CreateUserUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call CreateUserUseCase.execute with the provided dto', async () => {
      await controller.create(createUserFixture);

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(
        createUserFixture,
      );
    });

    it('should not return any value', async () => {
      const result = await controller.create(createUserFixture);

      expect(result).toBeUndefined();
    });

    it('should throw an error if use case fails', async () => {
      mockCreateUserUseCase.execute.mockRejectedValue(
        new Error('User creation failed'),
      );

      await expect(controller.create(createUserFixture)).rejects.toThrow(
        'User creation failed',
      );
    });

    it('should handle different user data', async () => {
      const customUser = {
        name: 'Custom User',
        email: 'custom@example.com',
      };

      await controller.create(customUser);

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(customUser);
    });
  });
});
