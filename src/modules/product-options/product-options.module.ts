import { Module } from '@nestjs/common';
import { ProductOptionsService } from './product-options.service';
import { ProductOptionsController } from './product-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOption } from './entities/product-option.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([ProductOption])
  ],
  controllers: [ProductOptionsController],
  providers: [ProductOptionsService],
})
export class ProductOptionsModule {}
