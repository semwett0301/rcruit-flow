/**
 * Unit tests for UserPreferenceController
 * Tests the user preference endpoints for language settings
 */
import { Test, TestingModule } from '@nestjs/testing';
import { UserPreferenceController } from '../src/user/controllers/user-preference.controller';
import { UserPreferenceService } from '../src/user/services/user-preference.service';

describe('UserPreferenceController', () => {
  let controller: UserPreferenceController;
  let service: jest.Mocked<UserPreferenceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPreferenceController],
      providers: [
        {
          provide: UserPreferenceService,
          useValue: {
            getLanguagePreference: jest.fn(),
            updateLanguagePreference: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserPreferenceController>(UserPreferenceController);
    service = module.get(UserPreferenceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLanguage', () => {
    it('should return user language preference', async () => {
      service.getLanguagePreference.mockResolvedValue('nl');
      
      const result = await controller.getLanguage({ user: { id: 'user-1' } });
      
      expect(result).toEqual({ language: 'nl' });
      expect(service.getLanguagePreference).toHaveBeenCalledWith('user-1');
    });

    it('should return default language when no preference is set', async () => {
      service.getLanguagePreference.mockResolvedValue('en');
      
      const result = await controller.getLanguage({ user: { id: 'user-2' } });
      
      expect(result).toEqual({ language: 'en' });
      expect(service.getLanguagePreference).toHaveBeenCalledWith('user-2');
    });

    it('should handle service errors gracefully', async () => {
      service.getLanguagePreference.mockRejectedValue(new Error('Database error'));
      
      await expect(controller.getLanguage({ user: { id: 'user-1' } }))
        .rejects.toThrow('Database error');
    });
  });

  describe('updateLanguage', () => {
    it('should update and return language preference', async () => {
      const mockPref = { language: 'nl', updatedAt: new Date() };
      service.updateLanguagePreference.mockResolvedValue(mockPref as any);
      
      const result = await controller.updateLanguage(
        { user: { id: 'user-1' } },
        { language: 'nl' }
      );
      
      expect(result.language).toBe('nl');
      expect(service.updateLanguagePreference).toHaveBeenCalledWith('user-1', 'nl');
    });

    it('should update language to English', async () => {
      const mockPref = { language: 'en', updatedAt: new Date() };
      service.updateLanguagePreference.mockResolvedValue(mockPref as any);
      
      const result = await controller.updateLanguage(
        { user: { id: 'user-1' } },
        { language: 'en' }
      );
      
      expect(result.language).toBe('en');
      expect(service.updateLanguagePreference).toHaveBeenCalledWith('user-1', 'en');
    });

    it('should update language to French', async () => {
      const mockPref = { language: 'fr', updatedAt: new Date() };
      service.updateLanguagePreference.mockResolvedValue(mockPref as any);
      
      const result = await controller.updateLanguage(
        { user: { id: 'user-1' } },
        { language: 'fr' }
      );
      
      expect(result.language).toBe('fr');
      expect(service.updateLanguagePreference).toHaveBeenCalledWith('user-1', 'fr');
    });

    it('should handle service errors during update', async () => {
      service.updateLanguagePreference.mockRejectedValue(new Error('Update failed'));
      
      await expect(controller.updateLanguage(
        { user: { id: 'user-1' } },
        { language: 'nl' }
      )).rejects.toThrow('Update failed');
    });

    it('should include updatedAt timestamp in response', async () => {
      const timestamp = new Date('2024-01-15T10:00:00Z');
      const mockPref = { language: 'nl', updatedAt: timestamp };
      service.updateLanguagePreference.mockResolvedValue(mockPref as any);
      
      const result = await controller.updateLanguage(
        { user: { id: 'user-1' } },
        { language: 'nl' }
      );
      
      expect(result.updatedAt).toEqual(timestamp);
    });
  });
});
