import { Module } from '@nestjs/common';
import { ReceiptDetailService } from './receipt-detail.service';
import { ReceiptDetailController } from './receipt-detail.controller';

@Module({
  controllers: [ReceiptDetailController],
  providers: [ReceiptDetailService],
})
export class ReceiptDetailModule {}
