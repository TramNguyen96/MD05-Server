import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {Response} from 'express';
import { EmailService, templates } from '../mail/mail.service';
import { JwtService } from '../jwt/jwt';
import * as ejs from 'ejs';
import * as path from 'path'
import * as  bcrypt from 'bcrypt'
import { LoginDto } from './dto/login-users.dto';


@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService, 
    private readonly mail: EmailService, 
    private readonly jwt: JwtService
  ) {}

  @Post()
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try{
      let serviceRes = await this.usersService.register(createUserDto)

      if(serviceRes.status){
        /* Mail */
        this.mail.sendMail(
          {
            subject: "ACCOUNT AUTHENTICATION EMAIL",
            to: serviceRes.data.email,
            html: templates.emailConfirm(
              {
                confirmLink: `${process.env.HOST}:${process.env.PORT}/api/v1/users/email-authen/${serviceRes.data.id}/${this.jwt.createToken(serviceRes.data, "300000")}`,
                language:"en",
                productName: "DANIEL WELLINGTON",
                productWebUrl: "https://apac.danielwellington.com/",
                receiverName: `${serviceRes.data.firstName} ${serviceRes.data.lastName}`
              }
            )
          }
        )
      }

      return res.status(serviceRes.status ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)

    }catch(err){
      console.log("err", err);
       throw new HttpException('Controller Error', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('email-authen/:userId/:token')
  async emailAuthentication(@Param('userId') userId: string, @Param('token') token: string, @Res() res: Response) {
    try {
      let userDecode = this.jwt.verifyToken(token);
      let serviceResUser = await this.usersService.findById(userId);
      if (serviceResUser.status && userDecode) {
        if (serviceResUser.data.updateAt == userDecode.updateAt) {
          if (!serviceResUser.data.emailConfirm) {
            let serRes = await this.usersService.update(userId, {
              emailConfirm: true
            });
            console.log("serRes", serRes)

            if (serRes.status) {
              /* Mail */
              this.mail.sendMail({
                subject: "Authentication Email Notice",
                to: serRes.data.email,
                text: `Email is already connected with the account ${serRes.data.userName}`
              })
            }

            return res.status(serRes.status ? 200 : 213).send(serRes.status ? await ejs.renderFile(path.join(__dirname, '../../../src/modules/mail/templates/emailEjs/emailVerification.ejs')) : await ejs.renderFile(path.join(__dirname, '../../../src/modules/mail/templates/emailEjs/emailVerificationFailed.ejs')));
          } else {
            return res.status(213).send("Account has been email activated!");
          }
        }
      }
      return res.status(213).send(await ejs.renderFile(path.join(__dirname, '../../../src/modules/mail/templates/emailEjs/emailExpired.ejs')));
    } catch (err) {
      console.log("err", err);
      
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      let serviceRes = await this.usersService.findByEmailOrUserName(loginDto.userNameOrEmail);

      if (!serviceRes.status) {
        return res.status(213).json({
          message: "Account not found"
        });
      }

      if (serviceRes.data.status != "ACTIVE") {
        return res.status(213).json({
          message: `Account is ${serviceRes.data.status}`
        });
      }

      if (!(await bcrypt.compare(loginDto.password, serviceRes.data.password))) {
        return res.status(213).json({
          message: "Incorrect password"
        });
      }

      /* Mail */
      this.mail.sendMail({
        subject: "Register Authentication Email",
        to: serviceRes.data.email,
        text: `Your account has just been logged in on a new device.`
      })

      return res.status(200).json({
        token: this.jwt.createToken(serviceRes.data, '1d')
      });
    } catch (err) {
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }



}