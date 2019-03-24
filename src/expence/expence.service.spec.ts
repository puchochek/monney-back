import { Test, TestingModule } from '@nestjs/testing';
import { ExpenceService } from './expence.service';

describe('ExpenceService', () => {
  let service: ExpenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpenceService],
    }).compile();

    service = module.get<ExpenceService>(ExpenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
