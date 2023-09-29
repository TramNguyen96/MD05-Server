import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  addtoCart(@Body() addToCart: AddToCartDto) {
    
  }
}
