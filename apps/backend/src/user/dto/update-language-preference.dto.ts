/**
 * DTO for updating user language preference
 * Validates that the language is one of the supported locales
 */
import { IsString, IsIn } from 'class-validator';

export class UpdateLanguagePreferenceDto {
  /**
   * The preferred language code
   * Must be one of the supported languages: 'en' (English) or 'nl' (Dutch)
   */
  @IsString()
  @IsIn(['en', 'nl'])
  language: string;
}
