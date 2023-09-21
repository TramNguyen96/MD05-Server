import { Allow, IsEmail, IsString, Length, MinLength } from "class-validator";

export class CreateUserDto {
    @Allow()
    @Length(3, 20)
    userName: string;

    @Allow()
     @IsEmail()
    email: string;

    @Allow()
    password: string;

    @Allow()
    @IsString()
    firstName: string;

    @Allow()
    @IsString()
    lastName: string;
}