/**
 * User Service
 *
 * Provides user-related operations including language preference management.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service for managing user data and preferences.
 */
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the language preference for a specific user.
   *
   * @param userId - The unique identifier of the user
   * @param language - The language code to set (e.g., 'en', 'es', 'fr')
   * @returns The updated user with id and languagePreference
   */
  async updateLanguagePreference(userId: string, language: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { languagePreference: language },
      select: { id: true, languagePreference: true },
    });
    return user;
  }

  /**
   * Retrieves the preferences for a specific user.
   *
   * @param userId - The unique identifier of the user
   * @returns An object containing the user's language preference (defaults to 'en')
   * @throws NotFoundException if the user does not exist
   */
  async getUserPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { languagePreference: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { language: user.languagePreference || 'en' };
  }
}
