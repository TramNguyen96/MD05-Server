import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { AuthenDto } from './dto/authen.dto';
import {Response} from 'express'
import {JwtService} from '../jwt/jwt';
import * as  bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service';
@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService, private readonly usersService: UsersService, private readonly jwt: JwtService) {}

  @Post()
  async memberAuthen(@Body() authenDto: AuthenDto, @Res() res: Response) {
    try{
      let userDecode = this.jwt.verifyToken(authenDto.token)
      // console.log("userDecode", userDecode);
      
      if(userDecode){
        let serviceResUser = await this.usersService.findById(userDecode.id)
        if(serviceResUser.status){
          if(userDecode.updateAt == serviceResUser.data.updateAt){
            return res.status(200).json(serviceResUser)
          }
        }
      }
      return res.status(213).json(
        {
          message: "Authen failed"
        }
      )
    }catch(err){
      return res.status(500).json(
        {
          message: "Controller Error"
        }
      )

    }
  }
}