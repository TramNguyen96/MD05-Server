import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty()
    @IsString() 
    @MinLength(3) 
    name: string;

    @ApiProperty()
    @Allow()
    des?: string

    @ApiProperty()
    @Allow()
    @IsString()
    categoryId: string
}
