import { Allow, Length, MinLength } from "class-validator";

export class LoginDto {
    @Allow()
    @Length(3, 20)
    userNameOrEmail: string;

    @Allow()
    @MinLength(6)
    password: string;
}