/**
 * Unit tests for UserPreferenceService
 *
 * Tests the user preference management functionality including:
 * - Getting language preferences with fallback to defaults
 * - Updating language preferences with validation
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferenceService } from '../src/user/services/user-preference.service';
import { UserPreference } from '../src/user/entities/user-preference.entity';

describe('UserPreferenceService', () => {
  let service: UserPreferenceService;
  let repo: jest.Mocked<Repository<UserPreference>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserPreferenceService,
        {
          provide: getRepositoryToken(UserPreference),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserPreferenceService>(UserPreferenceService);
    repo = module.get(getRepositoryToken(UserPreference));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLanguagePreference', () => {
    it('should return stored language when valid', async () => {
      repo.findOne.mockResolvedValue({ language: 'nl' } as UserPreference);

      const result = await service.getLanguagePreference('user-1');

      expect(result).toBe('nl');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });

    it('should return default "en" for unsupported language', async () => {
      repo.findOne.mockResolvedValue({ language: 'xyz' } as UserPreference);

      const result = await service.getLanguagePreference('user-1');

      expect(result).toBe('en');
    });

    it('should return default "en" when no preference exists', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.getLanguagePreference('user-1');

      expect(result).toBe('en');
    });

    it('should return stored language for other supported languages', async () => {
      repo.findOne.mockResolvedValue({ language: 'de' } as UserPreference);

      const result = await service.getLanguagePreference('user-1');

      expect(result).toBe('de');
    });
  });

  describe('updateLanguagePreference', () => {
    it('should create new preference if none exists', async () => {
      const newPreference = { userId: 'user-1', language: 'nl' } as UserPreference;
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(newPreference);
      repo.save.mockResolvedValue(newPreference);

      const result = await service.updateLanguagePreference('user-1', 'nl');

      expect(result.language).toBe('nl');
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });

    it('should update existing preference', async () => {
      const existingPreference = { userId: 'user-1', language: 'en' } as UserPreference;
      const updatedPreference = { userId: 'user-1', language: 'fr' } as UserPreference;
      repo.findOne.mockResolvedValue(existingPreference);
      repo.save.mockResolvedValue(updatedPreference);

      const result = await service.updateLanguagePreference('user-1', 'fr');

      expect(result.language).toBe('fr');
      expect(repo.save).toHaveBeenCalled();
    });

    it('should fallback to default "en" for unsupported language', async () => {
      const newPreference = { userId: 'user-1', language: 'en' } as UserPreference;
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(newPreference);
      repo.save.mockResolvedValue(newPreference);

      const result = await service.updateLanguagePreference('user-1', 'invalid');

      expect(result.language).toBe('en');
    });

    it('should fallback to default "en" for empty language string', async () => {
      const newPreference = { userId: 'user-1', language: 'en' } as UserPreference;
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(newPreference);
      repo.save.mockResolvedValue(newPreference);

      const result = await service.updateLanguagePreference('user-1', '');

      expect(result.language).toBe('en');
    });
  });
});
