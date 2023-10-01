import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsString, MinLength } from "class-validator";
import { StringFormat } from "firebase/storage";

export class CreateProductDto {

    @ApiProperty()
    @IsString() 
    @MinLength(3) 
    name: string;

    // @ApiProperty()
    // @Allow()
    // price: number

    @ApiProperty()
    @Allow()
    des?: string

    @ApiProperty()
    @Allow()
    @IsString()
    categoryId: StringFormat

    // @ApiProperty()
    // @Allow()
    // @IsString()
    // avatar: string
}
