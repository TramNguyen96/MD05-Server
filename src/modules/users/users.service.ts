import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindByIdSerRes, UpdateSerRes } from './users.interface';
import emailValidate from '../utils/emailValidate';
import { CreateGoogleDto } from './dto/create-google.dto';


@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>){}

  async register(createUserDto: CreateUserDto) {
    try{
      let hashUser = this.userRepository.create(createUserDto)
      let newUser = await this.userRepository.save(hashUser)
      return {
        status : true ,
        message:"Create new user success",
        data: hashUser
      }

    }catch(err){
      console.log("err", err);
      if(err.code == "ER_DUP_ENTRY"){
        return {
          message: "Email already exists!"
        }
      }
      throw new  HttpException("Service Error", HttpStatus.BAD_REQUEST)
    }
  }

   async createGoogle(createGoogleDto: CreateGoogleDto) {
    try {
      let newUser = this.userRepository.create(createGoogleDto)
      let results = await this.userRepository.save(newUser);
      return {
        status: true,
        message: "Create user successfully",
        data: newUser
      };
    } catch (err) {
      return {
        status: false,
        message: "Faild",
        data: null
      }
    }
  }


  async findAll() {
    try{
      let result = await this.userRepository.find()

      if(!result){
        throw new Error
      }

      return {
        status:true,
        message:'Get all user Success!',
        data: result
      }

    }catch(err){
      return {
        status:false,
        message:'Service Error',
        data: null
      }
    }
  }

  async findById(userId: string) {
    try{
      let result = await this.userRepository.findOne(
        {
          where: {
            id: userId
          }
        }
      )

      if(!result){
        throw new Error
      }

      return {
        status:true,
        message:'Get user by ID Success',
        data: result
      }

    }catch(err){
      return {
        status:false,
        message:'Service Error',
        data: null
      }
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto):Promise<UpdateSerRes> {
    try{
      let user = await this.userRepository.findOne(
        {
          where: {
            id: userId
          }
        }
      )

      let userUpdate = this.userRepository.merge(user, updateUserDto);
      let result = await this.userRepository.save(userUpdate);
      return {
        status : true ,
        message:"Update user success",
        data: result
      }

    }catch(err){
      return {
        status:true,
        message:'Service Error',
        data: null
      }
    }
  }

  async findByEmailOrUserName(emailOrUserName: string): Promise<FindByIdSerRes> {
    try {
      let result = await this.userRepository.findOne({
        where: emailValidate.isEmail(emailOrUserName)
        ? {
          email: emailOrUserName,
          emailConfirm: true
        }
        : {
          userName: emailOrUserName
        }
      });

      if (!result) {
        throw new Error
      }

      return {
        status: true,
        data: result,
        message: "Find user success!"
      }
    }catch(err) {
      return {
        status: false,
        data: null,
        message: "Service Error"
      }
    }
  }

  async findByUserName(userName: string): Promise<FindByIdSerRes> {
    try {
      let result = await this.userRepository.findOne({
        where: {
            userName
          }
      });
      console.log("result", result);


      if (!result) {
        throw new Error
      }

      return {
        status: true,
        data: result,
        message: "Find user ok!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model"
      }
    }
  }

 
}