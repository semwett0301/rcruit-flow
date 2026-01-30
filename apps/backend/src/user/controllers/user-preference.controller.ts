/**
 * User Preference Controller
 *
 * Handles HTTP endpoints for managing user preferences,
 * including language preference settings.
 */
import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserPreferenceService } from '../services/user-preference.service';
import {
  UpdateLanguagePreferenceDto,
  LanguagePreferenceResponseDto,
} from '@rcruit-flow/dto';

/**
 * Controller for user preference management endpoints.
 * All endpoints require JWT authentication.
 */
@Controller('user/preferences')
export class UserPreferenceController {
  constructor(private readonly preferenceService: UserPreferenceService) {}

  /**
   * Get the current user's language preference.
   *
   * @param req - The authenticated request containing user information
   * @returns The user's current language preference
   */
  @UseGuards(JwtAuthGuard)
  @Get('language')
  async getLanguage(@Request() req): Promise<{ language: string }> {
    const language = await this.preferenceService.getLanguagePreference(
      req.user.id,
    );
    return { language };
  }

  /**
   * Update the current user's language preference.
   *
   * @param req - The authenticated request containing user information
   * @param dto - The DTO containing the new language preference
   * @returns The updated language preference with timestamp
   */
  @UseGuards(JwtAuthGuard)
  @Put('language')
  async updateLanguage(
    @Request() req,
    @Body() dto: UpdateLanguagePreferenceDto,
  ): Promise<LanguagePreferenceResponseDto> {
    const pref = await this.preferenceService.updateLanguagePreference(
      req.user.id,
      dto.language,
    );
    return { language: pref.language, updatedAt: pref.updatedAt };
  }
}
