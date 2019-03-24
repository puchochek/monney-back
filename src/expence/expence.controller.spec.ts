import { Test, TestingModule } from '@nestjs/testing';
import { ExpenceController } from './expence.controller';

describe('Expence Controller', () => {
  let controller: ExpenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenceController],
    }).compile();

    controller = module.get<ExpenceController>(ExpenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
