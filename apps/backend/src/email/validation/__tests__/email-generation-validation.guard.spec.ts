/**
 * Unit tests for EmailGenerationValidationGuard
 *
 * Tests the validation guard that ensures required fields (candidateData and jobDescription)
 * are present in email generation requests.
 */
import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { EmailGenerationValidationGuard } from '../email-generation-validation.guard';

describe('EmailGenerationValidationGuard', () => {
  let guard: EmailGenerationValidationGuard;

  beforeEach(() => {
    guard = new EmailGenerationValidationGuard();
  });

  /**
   * Helper function to create a mock ExecutionContext with the given request body
   */
  const createMockContext = (body: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ body }),
      }),
    }) as ExecutionContext;

  describe('canActivate', () => {
    describe('when candidateData is missing', () => {
      it('should throw BadRequestException', () => {
        const context = createMockContext({
          jobDescription: { title: 'Dev', description: 'Code' },
        });

        expect(() => guard.canActivate(context)).toThrow(BadRequestException);
      });
    });

    describe('when jobDescription is missing', () => {
      it('should throw BadRequestException', () => {
        const context = createMockContext({
          candidateData: { name: 'John', email: 'john@test.com' },
        });

        expect(() => guard.canActivate(context)).toThrow(BadRequestException);
      });
    });

    describe('when both candidateData and jobDescription are missing', () => {
      it('should throw BadRequestException', () => {
        const context = createMockContext({});

        expect(() => guard.canActivate(context)).toThrow(BadRequestException);
      });

      it('should include validation errors in exception response', () => {
        const context = createMockContext({});

        try {
          guard.canActivate(context);
          fail('Expected BadRequestException to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          const response = (error as BadRequestException).getResponse() as any;
          expect(response.errors).toBeDefined();
          expect(response.errors.length).toBeGreaterThan(0);
        }
      });
    });

    describe('when all required fields are present', () => {
      it('should return true', () => {
        const context = createMockContext({
          candidateData: { name: 'John', email: 'john@test.com' },
          jobDescription: { title: 'Dev', description: 'Code' },
        });

        expect(guard.canActivate(context)).toBe(true);
      });

      it('should return true with additional optional fields', () => {
        const context = createMockContext({
          candidateData: {
            name: 'John Doe',
            email: 'john@test.com',
            phone: '123-456-7890',
            skills: ['TypeScript', 'NestJS'],
          },
          jobDescription: {
            title: 'Senior Developer',
            description: 'Build awesome software',
            requirements: ['5+ years experience'],
          },
          tone: 'professional',
        });

        expect(guard.canActivate(context)).toBe(true);
      });
    });

    describe('when fields are null or undefined', () => {
      it('should throw BadRequestException when candidateData is null', () => {
        const context = createMockContext({
          candidateData: null,
          jobDescription: { title: 'Dev', description: 'Code' },
        });

        expect(() => guard.canActivate(context)).toThrow(BadRequestException);
      });

      it('should throw BadRequestException when jobDescription is undefined', () => {
        const context = createMockContext({
          candidateData: { name: 'John', email: 'john@test.com' },
          jobDescription: undefined,
        });

        expect(() => guard.canActivate(context)).toThrow(BadRequestException);
      });
    });

    describe('when body is empty or undefined', () => {
      it('should throw BadRequestException when body is empty object', () => {
        const context = createMockContext({});

        expect(() => guard.canActivate(context)).toThrow(BadRequestException);
      });

      it('should throw BadRequestException when body is null', () => {
        const context = createMockContext(null);

        expect(() => guard.canActivate(context)).toThrow();
      });
    });
  });
});
