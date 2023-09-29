import { Injectable } from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Receipt } from './entities/receipt.entity';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ReceiptStatus } from './receipts.enum';

@Injectable()
export class ReceiptsService {

  constructor(@InjectRepository(Receipt) private readonly receiptRepository: Repository<Receipt>){}

  addToCart(newReceipt: AddToCartDto){
    return {
      status: true,
      message: "OK"
    }
  }

  async findShoppingCart(userId: string) {
    try{
      let shoppingCart = await this.receiptRepository.find({
        where: {
          userId,
          // status: ReceiptStatus.SHOPPING
        }
      })

      if(shoppingCart.length == 0){
        return false
      }
      return shoppingCart[0]

    }catch(err){
      return false
    }
  }

}
