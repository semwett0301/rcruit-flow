/**
 * Unit tests for UsersController update and delete endpoints
 * Tests the controller layer in isolation with mocked service dependencies
 */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';
import { UserNotFoundException } from '../../src/common/exceptions';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('update', () => {
    it('should return updated user', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser as any);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedUser);
      expect(result.name).toBe('Updated Name');
    });

    it('should update user email', async () => {
      const updateDto = { email: 'newemail@example.com' };
      const updatedUser = { ...mockUser, email: 'newemail@example.com' };
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser as any);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.email).toBe('newemail@example.com');
    });

    it('should update multiple fields at once', async () => {
      const updateDto = { name: 'New Name', email: 'new@example.com' };
      const updatedUser = { ...mockUser, ...updateDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser as any);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.name).toBe('New Name');
      expect(result.email).toBe('new@example.com');
    });

    it('should throw UserNotFoundException when user not found', async () => {
      const nonExistentId = 999;
      jest.spyOn(service, 'update').mockRejectedValue(new UserNotFoundException(nonExistentId));

      await expect(controller.update(nonExistentId, { name: 'Test' })).rejects.toThrow(UserNotFoundException);
      expect(service.update).toHaveBeenCalledWith(nonExistentId, { name: 'Test' });
    });

    it('should propagate service errors', async () => {
      const error = new Error('Database connection failed');
      jest.spyOn(service, 'update').mockRejectedValue(error);

      await expect(controller.update(1, { name: 'Test' })).rejects.toThrow('Database connection failed');
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await expect(controller.remove(1)).resolves.not.toThrow();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should call service remove with correct id', async () => {
      const userId = 42;
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(userId);

      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(userId);
    });

    it('should throw UserNotFoundException when user not found', async () => {
      const nonExistentId = 999;
      jest.spyOn(service, 'remove').mockRejectedValue(new UserNotFoundException(nonExistentId));

      await expect(controller.remove(nonExistentId)).rejects.toThrow(UserNotFoundException);
      expect(service.remove).toHaveBeenCalledWith(nonExistentId);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Database connection failed');
      jest.spyOn(service, 'remove').mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow('Database connection failed');
    });
  });
});
