import { Allow, IsEmail, IsBoolean, IsEnum } from "class-validator";
import { UserRole, UserStatus } from "../users.enum";

export class UpdateUserDto {
    @Allow()
    avatar?: string;
    @IsEmail()
    email?: string;
    @IsBoolean()
    emailConfirm?: boolean;
    @Allow()
    firstName?: string;
    @Allow()
    lastName?: string;
    @Allow()
    userName?:string;
    @Allow()
    password?:string;
    @IsEnum({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
    role?: UserRole;
    @IsEnum({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status?: UserStatus
}