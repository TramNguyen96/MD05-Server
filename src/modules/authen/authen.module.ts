import { Module } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { AuthenController } from './authen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthenController],
  providers: [AuthenService, UsersService, JwtService],
})
export class AuthenModule {}
