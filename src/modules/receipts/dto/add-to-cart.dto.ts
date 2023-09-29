import { Allow, IsBoolean, IsEmail, IsNotEmpty } from "class-validator";
import { PayMode, ReceiptStatus } from "../receipts.enum";

export class Receipt {
    @Allow()
    userId?: string;
    @Allow()
    guestName?: string;
    @IsEmail()
    guestEmail?: string;
    @Allow()
    guestPhoneNumber?: string;
    @Allow()
    status?: ReceiptStatus;
    @Allow()
    payMode: PayMode;
    @IsBoolean()
    paid?: boolean;
    @Allow()
    paidTime?: string;
    @Allow()
    total: number;
}


export class ReceiptDetail {
    @IsNotEmpty()
    receiptId: string;
    @IsNotEmpty()
    optionId: string;
    @IsNotEmpty()
    quantity: number;
}

export class AddToCartDto {
    receipt: Receipt
    receiptDetail: ReceiptDetail
}
