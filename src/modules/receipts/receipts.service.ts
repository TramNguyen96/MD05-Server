import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from './entities/receipt.entity';

@Injectable()
export class ReceiptService {

  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
  ) { }

  create(createReceiptDto: CreateReceiptDto) {
    return 'This action adds a new receipt';
  }

  async findAll() {
    try {
      let receipts = await this.receiptRepository.find({
        relations: {
          detail: {
            option: {
              product: true,
              pictures: true
            }
          }
        }
      })
      return {
        message: "find receipt success",
        data: receipts
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(id: string) {
    try {
      let receiptDetail = await this.receiptRepository.findOne({
        where: { id },
        relations: {
          detail: {
            option: {
              product: true,
              pictures: true
            }
          }
        }
      })
      return {
        message: "get product success",
        data: receiptDetail
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  update(id: number, updateReceiptDto: UpdateReceiptDto) {
    return `This action updates a #${id} receipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} receipt`;
  }
}