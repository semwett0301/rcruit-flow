import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('healthCheck', () => {
    it('should return successfully', async () => {
      const result = await controller.healthCheck();

      expect(result).toBeUndefined();
    });

    it('should not throw any errors', async () => {
      await expect(controller.healthCheck()).resolves.not.toThrow();
    });
  });
});
