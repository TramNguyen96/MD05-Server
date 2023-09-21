import { Allow } from "class-validator";

export class AuthenDto {
     @Allow()
    token: string;
}
