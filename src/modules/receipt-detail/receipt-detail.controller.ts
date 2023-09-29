import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceiptDetailService } from './receipt-detail.service';
import { CreateReceiptDetailDto } from './dto/create-receipt-detail.dto';
import { UpdateReceiptDetailDto } from './dto/update-receipt-detail.dto';

@Controller('receipt-detail')
export class ReceiptDetailController {
  constructor(private readonly receiptDetailService: ReceiptDetailService) {}

  @Post()
  create(@Body() createReceiptDetailDto: CreateReceiptDetailDto) {
    return this.receiptDetailService.create(createReceiptDetailDto);
  }

  @Get()
  findAll() {
    return this.receiptDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceiptDetailDto: UpdateReceiptDetailDto) {
    return this.receiptDetailService.update(+id, updateReceiptDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receiptDetailService.remove(+id);
  }
}
