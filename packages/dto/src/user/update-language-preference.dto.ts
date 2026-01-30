/**
 * DTO for updating user language preference
 * @module user/update-language-preference.dto
 */
import { IsString, IsIn } from 'class-validator';

/**
 * Data Transfer Object for updating a user's language preference.
 * Validates that the language is a supported locale.
 */
export class UpdateLanguagePreferenceDto {
  /**
   * The preferred language code.
   * Must be one of the supported languages: 'en' (English) or 'nl' (Dutch).
   */
  @IsString()
  @IsIn(['en', 'nl'])
  language: string;
}
