import { Test, TestingModule } from '@nestjs/testing';
import { CloudStorageAuthController } from './cloud-storage-auth.controller';
import { CloudStorageAuthService } from './cloud-storage-auth.service';

describe('CloudStorageAuthController', () => {
  let controller: CloudStorageAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudStorageAuthController],
      providers: [CloudStorageAuthService],
    }).compile();

    controller = module.get<CloudStorageAuthController>(CloudStorageAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
