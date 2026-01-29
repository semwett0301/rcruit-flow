import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { UserOrmEntity } from '../entities/user.orm.entity';
import { UserDomainEntity } from 'domain/user/enities/user.domain.entity';
import { StringId } from 'shared/value-objects/string-id.vo';

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockOrmRepository: jest.Mocked<Repository<UserOrmEntity>>;

  beforeEach(async () => {
    mockOrmRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      find: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<UserOrmEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserOrmEntity),
          useValue: mockOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save a user domain entity to the database', async () => {
      const userId = new StringId('user-id-12345');
      const user = new UserDomainEntity('John Doe', 'john@example.com', userId);

      await repository.save(user);

      expect(mockOrmRepository.save).toHaveBeenCalledWith({
        id: 'user-id-12345',
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should convert StringId to string when saving', async () => {
      const user = new UserDomainEntity('Jane Doe', 'jane@example.com');

      await repository.save(user);

      expect(mockOrmRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
        }),
      );
    });

    it('should throw an error if database save fails', async () => {
      mockOrmRepository.save.mockRejectedValue(
        new Error('Database connection failed'),
      );

      const user = new UserDomainEntity('Test User', 'test@example.com');

      await expect(repository.save(user)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should pass all user properties correctly', async () => {
      const userId = new StringId('custom-uuid-value');
      const user = new UserDomainEntity(
        'Alice Smith',
        'alice.smith@company.com',
        userId,
      );

      await repository.save(user);

      expect(mockOrmRepository.save).toHaveBeenCalledWith({
        id: 'custom-uuid-value',
        name: 'Alice Smith',
        email: 'alice.smith@company.com',
      });
    });

    it('should handle special characters in user data', async () => {
      const user = new UserDomainEntity(
        "O'Brien-Smith",
        'obriensmith@example.com',
      );

      await repository.save(user);

      expect(mockOrmRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "O'Brien-Smith",
        }),
      );
    });
  });
});
