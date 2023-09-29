import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './entities/receipt.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Receipt])
  ],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
