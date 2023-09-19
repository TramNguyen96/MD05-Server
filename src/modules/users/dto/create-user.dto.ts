import { Allow } from "class-validator";

export class CreateUserDto {
    @Allow()
    userName: string;

    @Allow()
    password: string;
}