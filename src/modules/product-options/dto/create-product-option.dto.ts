import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProductOptionDto {
    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    title: string;
}