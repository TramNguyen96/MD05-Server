import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Upload])
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
