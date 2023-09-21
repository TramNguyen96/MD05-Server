import { Global, Module } from '@nestjs/common';
import { CustomerGateWay } from './customer.gateway';
import { JwtService } from 'src/modules/jwt/jwt';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerChat } from './entities/customer.chat.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerChat])
  ],
  controllers: [],
  providers: [CustomerGateWay, JwtService, CustomerService],
})
export class GatewayModule {}




// import { Module } from "@nestjs/common";
// import { BoxchatGateWay } from "./boxchat.gateway";


// @Module({
//     providers: [BoxchatGateWay]
// })
// export class GatewayModule {}