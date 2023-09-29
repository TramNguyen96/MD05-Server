import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';

describe('ReceiptsController', () => {
  let controller: ReceiptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptsController],
      providers: [ReceiptsService],
    }).compile();

    controller = module.get<ReceiptsController>(ReceiptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
