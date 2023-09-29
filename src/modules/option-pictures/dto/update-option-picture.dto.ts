import { PartialType } from '@nestjs/swagger';
import { CreateOptionPictureDto } from './create-option-picture.dto';

export class UpdateOptionPictureDto extends PartialType(CreateOptionPictureDto) {}
