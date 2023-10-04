import { IsEmail, IsNotEmpty, Length, MinLength, MaxLength } from 'class-validator';

export class CreateGoogleDto {
    @MinLength(3, {
        message: 'userName is too short. Minimal length is $constraint1 characters, but actual is $value',
    })
    userName: string;

    @IsEmail()
    email: string;

    @MinLength(6, {
        message: 'userName is too short. Minimal length is $constraint1 characters, but actual is $value',
    })
    password: string;
}
