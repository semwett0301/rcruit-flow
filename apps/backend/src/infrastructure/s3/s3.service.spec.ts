import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';
import * as AWS from 'aws-sdk';
import { createMockFile } from '../../../test/fixtures/cv.fixture';

jest.mock('aws-sdk', () => {
  const mockS3Instance = {
    upload: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Key: 'uploaded-file-key' }),
    }),
    getObject: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Body: Buffer.from('file content') }),
    }),
  };

  return {
    S3: jest.fn(() => mockS3Instance),
  };
});

describe('S3Service', () => {
  let service: S3Service;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockS3Instance: {
    upload: jest.Mock;
    getObject: jest.Mock;
  };

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          R2_ENDPOINT: '',
          DEFAULT_BUCKET_NAME: 'test-bucket',
          AWS_REGION: 'eu-west-1',
        };
        return config[key];
      }),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
    mockS3Instance = (AWS.S3 as jest.MockedClass<typeof AWS.S3>).mock
      .results[0].value;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload a file and return the key', async () => {
      const mockFile = createMockFile();

      const result = await service.uploadFile(mockFile);

      expect(result).toBe('uploaded-file-key');
      expect(mockS3Instance.upload).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: 'test-bucket',
          Body: mockFile.buffer,
          ContentType: mockFile.mimetype,
        }),
      );
    });

    it('should use a custom bucket when provided', async () => {
      const mockFile = createMockFile();

      await service.uploadFile(mockFile, 'custom-bucket');

      expect(mockS3Instance.upload).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: 'custom-bucket',
        }),
      );
    });

    it('should generate a key with timestamp and original filename', async () => {
      const mockFile = createMockFile({ originalname: 'my-cv.pdf' });

      await service.uploadFile(mockFile);

      expect(mockS3Instance.upload).toHaveBeenCalledWith(
        expect.objectContaining({
          Key: expect.stringMatching(/^\d+-my-cv\.pdf$/),
        }),
      );
    });
  });

  describe('getFile', () => {
    it('should retrieve a file from S3', async () => {
      const result = await service.getFile('test-key');

      expect(result).toEqual(Buffer.from('file content'));
      expect(mockS3Instance.getObject).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: 'test-key',
      });
    });

    it('should use a custom bucket when provided', async () => {
      await service.getFile('test-key', 'custom-bucket');

      expect(mockS3Instance.getObject).toHaveBeenCalledWith({
        Bucket: 'custom-bucket',
        Key: 'test-key',
      });
    });

    it('should throw an error if file retrieval fails', async () => {
      mockS3Instance.getObject.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('NoSuchKey')),
      });

      await expect(service.getFile('non-existent-key')).rejects.toThrow(
        'Error in extraction: NoSuchKey',
      );
    });
  });

  describe('R2 configuration', () => {
    it('should configure for R2 when R2_ENDPOINT is provided', async () => {
      const r2ConfigService = {
        get: jest.fn((key: string) => {
          const config: Record<string, string> = {
            R2_ENDPOINT: 'https://r2.cloudflare.com',
            R2_ACCESS_KEY_ID: 'r2-access-key',
            R2_SECRET_ACCESS_KEY: 'r2-secret-key',
            DEFAULT_BUCKET_NAME: 'r2-bucket',
          };
          return config[key];
        }),
      } as unknown as jest.Mocked<ConfigService>;

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          S3Service,
          {
            provide: ConfigService,
            useValue: r2ConfigService,
          },
        ],
      }).compile();

      module.get<S3Service>(S3Service);

      expect(AWS.S3).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: 'https://r2.cloudflare.com',
          accessKeyId: 'r2-access-key',
          secretAccessKey: 'r2-secret-key',
          region: 'auto',
          signatureVersion: 'v4',
          s3ForcePathStyle: true,
        }),
      );
    });
  });
});
