/**
 * User Preference Service
 *
 * Service for managing user language preferences.
 * Handles retrieval, update, and creation of user language settings.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from '../entities/user-preference.entity';
import { DEFAULT_LANGUAGE, isLanguageSupported } from '../../config/languages.config';

@Injectable()
export class UserPreferenceService {
  constructor(
    @InjectRepository(UserPreference)
    private readonly preferenceRepo: Repository<UserPreference>,
  ) {}

  /**
   * Retrieves the language preference for a user.
   * Returns the default language if no preference exists or if the stored language is not supported.
   *
   * @param userId - The unique identifier of the user
   * @returns The user's language preference or the default language
   */
  async getLanguagePreference(userId: string): Promise<string> {
    const pref = await this.preferenceRepo.findOne({ where: { userId } });
    if (!pref || !isLanguageSupported(pref.language)) {
      return DEFAULT_LANGUAGE;
    }
    return pref.language;
  }

  /**
   * Updates the language preference for a user.
   * Creates a new preference record if one doesn't exist.
   * Falls back to the default language if the provided language is not supported.
   *
   * @param userId - The unique identifier of the user
   * @param language - The desired language code
   * @returns The updated or created UserPreference entity
   */
  async updateLanguagePreference(userId: string, language: string): Promise<UserPreference> {
    if (!isLanguageSupported(language)) {
      language = DEFAULT_LANGUAGE;
    }
    let pref = await this.preferenceRepo.findOne({ where: { userId } });
    if (!pref) {
      pref = this.preferenceRepo.create({ userId, language });
    } else {
      pref.language = language;
    }
    return this.preferenceRepo.save(pref);
  }

  /**
   * Creates a default language preference for a new user.
   *
   * @param userId - The unique identifier of the user
   * @returns The newly created UserPreference entity with default language
   */
  async createDefaultPreference(userId: string): Promise<UserPreference> {
    const pref = this.preferenceRepo.create({ userId, language: DEFAULT_LANGUAGE });
    return this.preferenceRepo.save(pref);
  }
}
