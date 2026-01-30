/**
 * Unit tests for UserController language preference endpoints
 * Tests the updateLanguagePreference and getUserPreferences controller methods
 */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    updateLanguagePreference: jest.fn(),
    getUserPreferences: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('updateLanguagePreference', () => {
    it('should update language preference successfully', async () => {
      const req = { user: { id: 'user-1' } };
      const dto = { language: 'nl' };
      mockUserService.updateLanguagePreference.mockResolvedValue({
        id: 'user-1',
        languagePreference: 'nl',
      });

      const result = await controller.updateLanguagePreference(req, dto);

      expect(service.updateLanguagePreference).toHaveBeenCalledWith('user-1', 'nl');
      expect(service.updateLanguagePreference).toHaveBeenCalledTimes(1);
      expect(result.languagePreference).toBe('nl');
    });

    it('should update language preference to English', async () => {
      const req = { user: { id: 'user-2' } };
      const dto = { language: 'en' };
      mockUserService.updateLanguagePreference.mockResolvedValue({
        id: 'user-2',
        languagePreference: 'en',
      });

      const result = await controller.updateLanguagePreference(req, dto);

      expect(service.updateLanguagePreference).toHaveBeenCalledWith('user-2', 'en');
      expect(result.languagePreference).toBe('en');
    });

    it('should update language preference to French', async () => {
      const req = { user: { id: 'user-3' } };
      const dto = { language: 'fr' };
      mockUserService.updateLanguagePreference.mockResolvedValue({
        id: 'user-3',
        languagePreference: 'fr',
      });

      const result = await controller.updateLanguagePreference(req, dto);

      expect(service.updateLanguagePreference).toHaveBeenCalledWith('user-3', 'fr');
      expect(result.languagePreference).toBe('fr');
    });

    it('should handle service errors when updating language preference', async () => {
      const req = { user: { id: 'user-1' } };
      const dto = { language: 'de' };
      const error = new Error('Database connection failed');
      mockUserService.updateLanguagePreference.mockRejectedValue(error);

      await expect(controller.updateLanguagePreference(req, dto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(service.updateLanguagePreference).toHaveBeenCalledWith('user-1', 'de');
    });
  });

  describe('getUserPreferences', () => {
    it('should return user preferences with English language', async () => {
      const req = { user: { id: 'user-1' } };
      mockUserService.getUserPreferences.mockResolvedValue({ language: 'en' });

      const result = await controller.getUserPreferences(req);

      expect(service.getUserPreferences).toHaveBeenCalledWith('user-1');
      expect(service.getUserPreferences).toHaveBeenCalledTimes(1);
      expect(result.language).toBe('en');
    });

    it('should return user preferences with Dutch language', async () => {
      const req = { user: { id: 'user-2' } };
      mockUserService.getUserPreferences.mockResolvedValue({ language: 'nl' });

      const result = await controller.getUserPreferences(req);

      expect(service.getUserPreferences).toHaveBeenCalledWith('user-2');
      expect(result.language).toBe('nl');
    });

    it('should return user preferences with additional settings', async () => {
      const req = { user: { id: 'user-3' } };
      mockUserService.getUserPreferences.mockResolvedValue({
        language: 'fr',
        timezone: 'Europe/Paris',
        notifications: true,
      });

      const result = await controller.getUserPreferences(req);

      expect(service.getUserPreferences).toHaveBeenCalledWith('user-3');
      expect(result.language).toBe('fr');
      expect(result.timezone).toBe('Europe/Paris');
      expect(result.notifications).toBe(true);
    });

    it('should handle service errors when getting user preferences', async () => {
      const req = { user: { id: 'user-1' } };
      const error = new Error('User not found');
      mockUserService.getUserPreferences.mockRejectedValue(error);

      await expect(controller.getUserPreferences(req)).rejects.toThrow('User not found');
      expect(service.getUserPreferences).toHaveBeenCalledWith('user-1');
    });

    it('should handle null preferences response', async () => {
      const req = { user: { id: 'user-4' } };
      mockUserService.getUserPreferences.mockResolvedValue(null);

      const result = await controller.getUserPreferences(req);

      expect(service.getUserPreferences).toHaveBeenCalledWith('user-4');
      expect(result).toBeNull();
    });
  });
});
