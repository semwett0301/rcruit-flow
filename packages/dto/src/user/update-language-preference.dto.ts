/**
 * DTOs for language preference update operations.
 * Handles validation and response formatting for user language settings.
 */
import { IsString, IsIn } from 'class-validator';

/**
 * Supported languages in the application.
 * Add new language codes here when expanding language support.
 */
export const SUPPORTED_LANGUAGES = ['en', 'nl', 'de', 'fr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * DTO for updating a user's language preference.
 * Validates that the provided language is one of the supported options.
 */
export class UpdateLanguagePreferenceDto {
  /**
   * The language code to set as the user's preference.
   * Must be one of the supported language codes: 'en', 'nl', 'de', 'fr'
   */
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES, {
    message: `Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`,
  })
  language: SupportedLanguage;
}

/**
 * Response DTO for language preference operations.
 * Returns the updated language setting along with the timestamp.
 */
export class LanguagePreferenceResponseDto {
  /**
   * The user's current language preference.
   */
  language: string;

  /**
   * Timestamp when the language preference was last updated.
   */
  updatedAt: Date;
}
