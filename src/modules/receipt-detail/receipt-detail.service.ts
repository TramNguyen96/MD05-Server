import { Injectable } from '@nestjs/common';
import { CreateReceiptDetailDto } from './dto/create-receipt-detail.dto';
import { UpdateReceiptDetailDto } from './dto/update-receipt-detail.dto';

@Injectable()
export class ReceiptDetailService {
  create(createReceiptDetailDto: CreateReceiptDetailDto) {
    return 'This action adds a new receiptDetail';
  }

  findAll() {
    return `This action returns all receiptDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} receiptDetail`;
  }

  update(id: number, updateReceiptDetailDto: UpdateReceiptDetailDto) {
    return `This action updates a #${id} receiptDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} receiptDetail`;
  }
}
