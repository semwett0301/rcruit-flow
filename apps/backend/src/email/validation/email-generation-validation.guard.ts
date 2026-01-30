/**
 * Email Generation Validation Guard
 *
 * NestJS guard that validates incoming email generation requests.
 * Ensures that required fields (candidateData, jobDescription) are present
 * and valid before allowing the request to proceed to the controller.
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import {
  validateEmailGenerationInput,
  ValidationResult,
} from '@recruit-flow/dto';

@Injectable()
export class EmailGenerationValidationGuard implements CanActivate {
  /**
   * Validates the email generation request body.
   *
   * @param context - The execution context containing the request
   * @returns true if validation passes
   * @throws BadRequestException if validation fails with details about missing/invalid fields
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { candidateData, jobDescription } = request.body;

    const validationResult: ValidationResult = validateEmailGenerationInput({
      candidateData: candidateData || null,
      jobDescription: jobDescription || null,
    });

    if (!validationResult.isValid) {
      throw new BadRequestException({
        message: 'Validation failed: Required fields are missing',
        errors: validationResult.errors,
      });
    }

    return true;
  }
}
