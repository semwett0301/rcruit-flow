/**
 * Unit tests for UsersService update and delete methods
 * Tests the update and remove functionality with proper mocking of TypeORM repository
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/users/entities/user.entity';
import { UserNotFoundException } from '../../src/common/exceptions';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should update user name successfully', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockUser, name: 'Updated Name' } as User);

      const result = await service.update(1, { name: 'Updated Name' });

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Name');
    });

    it('should update user email successfully', async () => {
      const updatedEmail = 'updated@example.com';
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockUser, email: updatedEmail } as User);

      const result = await service.update(1, { email: updatedEmail });

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalled();
      expect(result.email).toBe(updatedEmail);
    });

    it('should update multiple user fields successfully', async () => {
      const updateData = { name: 'New Name', email: 'new@example.com' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockUser, ...updateData } as User);

      const result = await service.update(1, updateData);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe(updateData.name);
      expect(result.email).toBe(updateData.email);
    });

    it('should throw UserNotFoundException when user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(UserNotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should handle empty update data', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser as User);

      const result = await service.update(1, {});

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockUser as User);

      await expect(service.remove(1)).resolves.not.toThrow();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UserNotFoundException when user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(UserNotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('should call remove with the correct user entity', async () => {
      const userToDelete = { id: 5, name: 'Delete Me', email: 'delete@example.com' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(userToDelete as User);
      jest.spyOn(repository, 'remove').mockResolvedValue(userToDelete as User);

      await service.remove(5);

      expect(repository.remove).toHaveBeenCalledWith(userToDelete);
    });
  });
});
