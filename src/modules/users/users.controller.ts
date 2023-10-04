import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {Response} from 'express';
import { Request } from 'express';
import { EmailService, templates } from '../mail/mail.service';
import { JwtService } from '../jwt/jwt';
import * as ejs from 'ejs';
import * as path from 'path'
import * as  bcrypt from 'bcrypt'
import { LoginDto } from './dto/login-users.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import axios from 'axios';
import jwt from '../utils/jwt'
import common from '../utils/common';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  @Post('google-login')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto, @Req() req: Request, @Res() res: Response) {
    try {
      await axios.post("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAndetqmt474VMsWg9ZB5QLWjymvfCHWaA", {
        idToken: googleLoginDto.accessToken
      })
      let userExist = await this.usersService.findByUserName(googleLoginDto.email);

      if(userExist.status) {
        // đã có tài khoản liên kết gmail này
        let token = jwt.createToken(userExist.data, "1d");
        return res.status(200).json({
          token
        })
      }else {
        /* Đăng ký */
        let newUserRes = await this.usersService.register({
          email: googleLoginDto.email,
          userName: googleLoginDto.userName,
          password: googleLoginDto.password,
          firstName: googleLoginDto.firstName,
          lastName: googleLoginDto.lastName
        })

        if(newUserRes.status) {
          
          let token = jwt.createToken(newUserRes.data, "1d");
          console.log("token", token);
          
          return res.status(200).json({
            token
          })
        }

        return res.status(213).json({
          message: "Đăng nhập với google thất bại!"
        })
      }
    } catch(err) {
      console.log("err", err);
      
      return res.status(500).json({
        message: "Lỗi controller"
      })
    }
  }

  @Get('resend-email')
  async resendMail(@Req() req: Request,  @Res() res: Response){
    try{
      let userDecode = this.jwt.verifyToken(String(req.headers.token));
      let serResUser = await this.usersService.findById(userDecode.id);
      if(serResUser.status && userDecode){
        if(serResUser.data.updateAt == userDecode.updateAt){
          if(!serResUser.data.emailConfirm){
            /* Mail */
            let check = await this.mail.sendMail({
              subject: "RESEND AUTHENTICATION EMAIL",
              to: serResUser.data.email,
              html: templates.emailConfirm(
                {
                  confirmLink: `${process.env.HOST}:${process.env.PORT}/api/v1/users/email-authen/${serResUser.data.id}/${this.jwt.createToken(serResUser.data, "300000")}`,
                  language:"en",
                  productName: "DANIEL WELLINGTON",
                  productWebUrl: "https://apac.danielwellington.com/",
                  receiverName: `${serResUser.data.firstName} ${serResUser.data.lastName}`
                }
              )
            })

            return res.status(200).send(" Please Check Mail")
          }else{
            return res.status(213).send("Account has been activated !")

          }
        }
      }
      return res.status(213).send("Authentication failed !")
    }catch(err){
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res: Response) {
    try {

        let serResUser = await this.usersService.findByEmailOrUserName(resetPasswordDto.email);
        if(serResUser) {
          await this.mail.sendMail({
            subject: "RECOVER YOUR PASSWORD",
            to: resetPasswordDto.email,
            html: templates.emailChangePass({
                  confirmLink: `${process.env.HOST}:${process.env.PORT}/api/v1/users/authentication-reset-password/${this.jwt.createToken(
                    serResUser.data,
                    "300000"
                  )}`,
                  productName: "Daniel Wellington",
                  productWebUrl: "https://apac.danielwellington.com",
                  receiverName: `${serResUser.data.firstName} ${serResUser.data.lastName}`
              })
          })
          return res.status(200).json({
            message: "Check email!"
          });
        }
    } catch (err) {
      console.log("err", err);
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

  @Get('authentication-reset-password/:token')
  async authenticationResetPassword(@Param('token') token: string, @Res() res: Response) {
    try {
      let userDecode = this.jwt.verifyToken(String(token));
      if (userDecode) {
        let serResUser = await this.usersService.findById(userDecode.id);
        if (serResUser.data.updateAt == userDecode.updateAt) {
          if (serResUser.status) {
            if (serResUser.data.updateAt == userDecode.updateAt) {
              let randomPassword = common.generateOTP();
              let serUpdateUser = await this.usersService.update(userDecode.id, {
                password: await bcrypt.hash(randomPassword, 10)
              })
              if (serUpdateUser.status) {
                await this.mail.sendMail({
                subject: " CHANGE PASSWORD EMAIL",
                to: userDecode.email,
                html: 
                `
                  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                      <div style="margin:50px auto;width:70%;padding:20px 0">
                          <div style="border-bottom:1px solid #eee">
                          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Catherine Deane</a>
                          </div>
                          <p style="font-size:1.1em">Hi,</p>
                          <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${randomPassword}</h2>
                          <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
                          <hr style="border:none;border-top:1px solid #eee" />
                          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                          <p>Your Brand Inc</p>
                          <p>1600 Amphitheatre Parkway</p>
                          <p>California</p>
                          </div>
                      </div>
                  </div>
                `
                })
                return res.status(200).send(await ejs.renderFile(path.join(__dirname, '../../../src/modules/mail/templates/emailEjs/emailResetPassword.ejs')))
              }
            }
          }
        }
      }

      return res.status(213).json({
        message: "Xác thực thất bại!"
      })
    } catch (err) {
      console.log("err", err);
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

   @Post('change-password')
   async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: Request, @Res() res: Response){
    try{
      let userDecode = this.jwt.verifyToken(String(req.headers.token));
      
      if(userDecode){
        let serResUser = await this.usersService.findById(userDecode.id);

        if(serResUser.data.updateAt == userDecode.updateAt){
          if(serResUser.status){
            if(await bcrypt.compare(changePasswordDto.oldPassword, userDecode.password )){
              await this.mail.sendMail({
                subject: " CHANGE PASSWORD EMAIL",
                to: userDecode.email,
                html: templates.emailChangePass({
                  confirmLink: `${process.env.HOST}:${process.env.PORT}/api/v1/users/authentication-change-password/${this.jwt.createToken(
                    {
                      ...(serResUser.data),
                      newPassword: changePasswordDto.newPassword
                    },
                    "300000"
                  )}`,
                  productName: "Daniel Wellington",
                  productWebUrl: "https://apac.danielwellington.com",
                  receiverName: `${serResUser.data.firstName} ${serResUser.data.lastName}`
              })
            })

            return res.status(200).json({
                message: "Check your email to confirm password change!"
              })
          }else{
          return res.status(213).json({
                message: "Incorrect password!"
              })
        }
        }
        }

        
      }
      return res.status(213).json({
        message: "Authentication failed!"
      })
    }catch(err){
      console.log("err", err);
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
   }

  @Get('authentication-change-password/:token')
  async changePasswordByEmail(@Param('token') token: string, @Body() body: any, @Res() res: Response){
    try{
      let userDecode = this.jwt.verifyToken(String(token))
      if(userDecode){
        let serResUser = await this.usersService.findById(userDecode.id);
        if(serResUser.data.updateAt == userDecode.updateAt){
          if(serResUser.status){
            if(serResUser.data.updateAt == userDecode.updateAt){
              let serUpdateUser = await this.usersService.update(userDecode.id, {
                password: await bcrypt.hash(userDecode.newPassword, 10)
              })

              if(serUpdateUser.status){
                return res.status(200).send(await ejs.renderFile(path.join(__dirname, '../../../src/modules/mail/templates/emailEjs/emailChangePass.ejs')))
              }
            }
          }
        }
      }

      return res.status(213).json({
        message: "Authentication failed !"
      })

    }catch(err){
      console.log("err", err)
      
      return res.status(500).json({
        message: "Server Controller Error!"
      })

    } 
  }

  @Get()
  async findAll(@Res() res: Response): Promise<any> {
     try{
      let serviceRes = await this.usersService.findAll()
      return res.status(serviceRes.status ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)

    }catch(err){
       throw new HttpException('Lỗi Controller', HttpStatus.BAD_REQUEST);
    }
  }
  

}