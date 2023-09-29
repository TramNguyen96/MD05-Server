import { PartialType } from '@nestjs/swagger';
import { CreateReceiptDetailDto } from './create-receipt-detail.dto';

export class UpdateReceiptDetailDto extends PartialType(CreateReceiptDetailDto) {}
