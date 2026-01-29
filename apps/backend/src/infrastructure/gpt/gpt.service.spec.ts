import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GptService } from './gpt.service';

const mockCreate = jest.fn();

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});

describe('GptService', () => {
  let service: GptService;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'GPT response' } }],
    });

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        const config: Record<string, string> = {
          OPENAI_API_KEY: 'test-api-key',
          OPENAI_ORG_ID: 'test-org-id',
          OPENAI_MODEL: 'gpt-4',
        };
        return config[key] ?? defaultValue;
      }),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GptService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<GptService>(GptService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('chat', () => {
    it('should return GPT response content', async () => {
      const messages = [{ role: 'user' as const, content: 'Hello' }];

      const result = await service.chat(messages);

      expect(result).toBe('GPT response');
    });

    it('should call OpenAI with correct parameters', async () => {
      const messages = [
        { role: 'system' as const, content: 'You are helpful' },
        { role: 'user' as const, content: 'Help me' },
      ];

      await service.chat(messages);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
          messages,
          temperature: 0.7,
        }),
      );
    });

    it('should use custom options when provided', async () => {
      const messages = [{ role: 'user' as const, content: 'Test' }];
      const options = { temperature: 0, model: 'gpt-3.5-turbo' };

      await service.chat(messages, options);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-3.5-turbo',
          temperature: 0,
        }),
      );
    });

    it('should return empty string when content is null', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: null } }],
      });

      const messages = [{ role: 'user' as const, content: 'Test' }];
      const result = await service.chat(messages);

      expect(result).toBe('');
    });

    it('should throw HttpException with BAD_GATEWAY status on OpenAI error', async () => {
      mockCreate.mockRejectedValue(new Error('Rate limit exceeded'));

      const messages = [{ role: 'user' as const, content: 'Test' }];

      await expect(service.chat(messages)).rejects.toThrow(HttpException);

      try {
        await service.chat(messages);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_GATEWAY);
        expect((error as HttpException).message).toContain('Rate limit exceeded');
      }
    });

    it('should use default model when OPENAI_MODEL is not configured', async () => {
      const noModelConfigService = {
        get: jest.fn((key: string, defaultValue?: string) => {
          const config: Record<string, string | undefined> = {
            OPENAI_API_KEY: 'test-api-key',
            OPENAI_ORG_ID: 'test-org-id',
            OPENAI_MODEL: undefined,
          };
          return config[key] ?? defaultValue;
        }),
      } as unknown as jest.Mocked<ConfigService>;

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          GptService,
          {
            provide: ConfigService,
            useValue: noModelConfigService,
          },
        ],
      }).compile();

      const newService = module.get<GptService>(GptService);
      await newService.chat([{ role: 'user', content: 'Test' }]);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4.1',
        }),
      );
    });
  });
});
