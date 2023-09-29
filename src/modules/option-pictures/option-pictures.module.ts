import { Module } from '@nestjs/common';
import { OptionPicturesService } from './option-pictures.service';
import { OptionPicturesController } from './option-pictures.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionPicture } from './entities/option-picture.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OptionPicture])
  ],
  controllers: [OptionPicturesController],
  providers: [OptionPicturesService],
})
export class OptionPicturesModule {}
