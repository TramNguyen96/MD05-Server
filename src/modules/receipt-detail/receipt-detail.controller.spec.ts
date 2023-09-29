import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptDetailController } from './receipt-detail.controller';
import { ReceiptDetailService } from './receipt-detail.service';

describe('ReceiptDetailController', () => {
  let controller: ReceiptDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptDetailController],
      providers: [ReceiptDetailService],
    }).compile();

    controller = module.get<ReceiptDetailController>(ReceiptDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
