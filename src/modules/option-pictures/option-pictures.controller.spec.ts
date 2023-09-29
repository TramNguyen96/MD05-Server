import { Test, TestingModule } from '@nestjs/testing';
import { OptionPicturesController } from './option-pictures.controller';
import { OptionPicturesService } from './option-pictures.service';

describe('OptionPicturesController', () => {
  let controller: OptionPicturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionPicturesController],
      providers: [OptionPicturesService],
    }).compile();

    controller = module.get<OptionPicturesController>(OptionPicturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
