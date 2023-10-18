import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthV2Service } from './google-auth-v2.service';

describe('GoogleAuthV2Service', () => {
  let service: GoogleAuthV2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleAuthV2Service],
    }).compile();

    service = module.get<GoogleAuthV2Service>(GoogleAuthV2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
