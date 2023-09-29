import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthenModule } from './modules/authen/authen.module';
import { UsersModule } from './modules/users/users.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SocketModule } from './modules/socket/socket.module';
import { ProductOptionsModule } from './modules/product-options/product-options.module';
import { OptionPicturesModule } from './modules/option-pictures/option-pictures.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { ReceiptDetailModule } from './modules/receipt-detail/receipt-detail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    CategoriesModule,
    ProductsModule,
    UsersModule,
    AuthenModule,
    UploadsModule,
    ProductOptionsModule,
    OptionPicturesModule,
    ReceiptsModule,
    ReceiptDetailModule,
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
