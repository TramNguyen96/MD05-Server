import { Test, TestingModule } from '@nestjs/testing';
import { OptionPicturesService } from './option-pictures.service';

describe('OptionPicturesService', () => {
  let service: OptionPicturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptionPicturesService],
    }).compile();

    service = module.get<OptionPicturesService>(OptionPicturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
