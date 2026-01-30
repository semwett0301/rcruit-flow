/**
 * User Controller
 *
 * Handles user-related HTTP endpoints including language preferences
 * and user settings management.
 */
import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateLanguagePreferenceDto } from './dto/update-language-preference.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Update the authenticated user's language preference
   *
   * @param req - The request object containing the authenticated user
   * @param dto - The DTO containing the new language preference
   * @returns The updated user preferences
   */
  @UseGuards(JwtAuthGuard)
  @Patch('me/language')
  async updateLanguagePreference(
    @Request() req,
    @Body() dto: UpdateLanguagePreferenceDto,
  ) {
    return this.userService.updateLanguagePreference(req.user.id, dto.language);
  }

  /**
   * Get the authenticated user's preferences
   *
   * @param req - The request object containing the authenticated user
   * @returns The user's current preferences
   */
  @UseGuards(JwtAuthGuard)
  @Get('me/preferences')
  async getUserPreferences(@Request() req) {
    return this.userService.getUserPreferences(req.user.id);
  }
}
