import { Injectable } from '@nestjs/common';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { UpdateAuthenDto } from './dto/update-authen.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AuthenService {

  constructor(@InjectRepository(User) private users:Repository<User>){}

  create(createAuthenDto: CreateAuthenDto) {
    return 'This action adds a new authen';
  }

  async findByUserName(userName: string) {
    let user = await this.users.findOne({
      where: {
        userName
      }
    })
    return user;
  }

  findAll() {
    return `This action returns all authen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authen`;
  }

  update(id: number, updateAuthenDto: UpdateAuthenDto) {
    return `This action updates a #${id} authen`;
  }

  remove(id: number) {
    return `This action removes a #${id} authen`;
  }
}