import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.use-case';
import { IUserRepository } from 'domain/user/interfaces/user.repository.interface';
import { UserDomainEntity } from 'domain/user/enities/user.domain.entity';
import { createUserFixture } from '../../../../test/fixtures/user.fixture';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    mockUserRepository = {
      save: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a user domain entity and save it via repository', async () => {
      await useCase.execute(createUserFixture);

      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.any(UserDomainEntity),
      );
    });

    it('should pass the correct name and email to the user entity', async () => {
      await useCase.execute(createUserFixture);

      const savedUser = mockUserRepository.save.mock
        .calls[0][0] as UserDomainEntity;
      expect(savedUser.name).toBe(createUserFixture.name);
      expect(savedUser.email).toBe(createUserFixture.email);
    });

    it('should throw an error if repository save fails', async () => {
      const error = new Error('Database connection failed');
      mockUserRepository.save.mockRejectedValue(error);

      await expect(useCase.execute(createUserFixture)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should generate unique ids for different users', async () => {
      await useCase.execute({ name: 'User 1', email: 'user1@example.com' });
      await useCase.execute({ name: 'User 2', email: 'user2@example.com' });

      const user1 = mockUserRepository.save.mock
        .calls[0][0] as UserDomainEntity;
      const user2 = mockUserRepository.save.mock
        .calls[1][0] as UserDomainEntity;

      expect(user1.id.equals(user2.id)).toBe(false);
    });
  });
});
