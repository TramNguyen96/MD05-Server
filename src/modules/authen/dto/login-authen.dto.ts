import { Allow } from "class-validator";

export class LoginDto {
    @Allow()
    userName: string;
    @Allow()
    password: string;
}