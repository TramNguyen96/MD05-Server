import { PartialType } from '@nestjs/swagger';
import { CreateProductOptionDto } from './create-product-option.dto';

export class UpdateProductOptionDto extends PartialType(CreateProductOptionDto) {}
