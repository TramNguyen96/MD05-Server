import { Allow, IsEmail, IsString, IsStrongPassword, Length, MinLength } from "class-validator";

export class CreateUserDto {
    @Allow()
    @Length(3, 20)
    userName: string;

    @Allow()
    @IsEmail()
    email: string;

    @Allow()
    @MinLength(6)
    password: string;

    @Allow()
    @IsString()
    firstName: string;

    @Allow()
    @IsString()
    lastName: string;
}