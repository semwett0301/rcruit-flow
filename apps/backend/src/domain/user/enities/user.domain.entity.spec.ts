import { UserDomainEntity } from './user.domain.entity';
import { StringId } from 'shared/value-objects/string-id.vo';
import type { CreateUserRequest } from '@repo/dto';

describe('UserDomainEntity', () => {
  const validName = 'John Doe';
  const validEmail = 'john.doe@example.com';

  describe('constructor', () => {
    it('should create a user with provided name and email', () => {
      const user = new UserDomainEntity(validName, validEmail);

      expect(user.name).toBe(validName);
      expect(user.email).toBe(validEmail);
    });

    it('should generate a StringId when none is provided', () => {
      const user = new UserDomainEntity(validName, validEmail);

      expect(user.id).toBeInstanceOf(StringId);
      expect(user.id.toString().length).toBeGreaterThanOrEqual(5);
    });

    it('should use the provided StringId', () => {
      const customId = new StringId('custom-id-12345');
      const user = new UserDomainEntity(validName, validEmail, customId);

      expect(user.id).toBe(customId);
      expect(user.id.toString()).toBe('custom-id-12345');
    });
  });

  describe('getters', () => {
    it('should return the name through the getter', () => {
      const user = new UserDomainEntity(validName, validEmail);

      expect(user.name).toBe(validName);
    });

    it('should return the email through the getter', () => {
      const user = new UserDomainEntity(validName, validEmail);

      expect(user.email).toBe(validEmail);
    });
  });

  describe('fromCreateUserDto', () => {
    it('should create a UserDomainEntity from a CreateUserRequest DTO', () => {
      const dto: CreateUserRequest = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
      };

      const user = UserDomainEntity.fromCreateUserDto(dto);

      expect(user.name).toBe(dto.name);
      expect(user.email).toBe(dto.email);
      expect(user.id).toBeInstanceOf(StringId);
    });

    it('should generate a new id for each user created from DTO', () => {
      const dto: CreateUserRequest = {
        name: 'Test User',
        email: 'test@example.com',
      };

      const user1 = UserDomainEntity.fromCreateUserDto(dto);
      const user2 = UserDomainEntity.fromCreateUserDto(dto);

      expect(user1.id.equals(user2.id)).toBe(false);
    });
  });
});
