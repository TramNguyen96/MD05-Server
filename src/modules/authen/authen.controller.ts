import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { LoginDto } from './dto/login-authen.dto';
import {Response} from 'express'
import jwt from '../../utils/jwt';
import * as  bcrypt from 'bcrypt'
@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService) {}

  @Post('login')
  async create(@Body() body: LoginDto, @Res() res: Response) {
    let serviceRes = await this.authenService.findByUserName(body.userName);
    let check = await bcrypt.compare(body.password, serviceRes.password);
    if(check) {
      res.status(200).json({
        token: jwt.createToken(serviceRes,"1d")
      })
    }
  }
}