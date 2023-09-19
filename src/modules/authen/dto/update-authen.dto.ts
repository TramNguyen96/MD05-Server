import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthenDto } from './create-authen.dto';

export class UpdateAuthenDto extends PartialType(CreateAuthenDto) {}
