import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerChat } from './entities/customer.chat.entity';

@Injectable()
export class CustomerService {

  constructor(@InjectRepository(CustomerChat) private customerChatRepository: Repository<CustomerChat>){}

  

}