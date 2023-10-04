import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { ReceiptService } from './receipts.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { Response } from 'express';
@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) { }

  @Post()
  create(@Body() createReceiptDto: CreateReceiptDto) {
    return this.receiptService.create(createReceiptDto);
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      let serviceRes = await this.receiptService.findAll()
      // res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST)
    }
  }


  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      let serviceRes = await this.receiptService.findOne(id)
      // res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST)
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceiptDto: UpdateReceiptDto) {
    return this.receiptService.update(+id, updateReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receiptService.remove(+id);
  }
}