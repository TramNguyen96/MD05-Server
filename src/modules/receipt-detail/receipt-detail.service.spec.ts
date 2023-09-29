import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptDetailService } from './receipt-detail.service';

describe('ReceiptDetailService', () => {
  let service: ReceiptDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptDetailService],
    }).compile();

    service = module.get<ReceiptDetailService>(ReceiptDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
