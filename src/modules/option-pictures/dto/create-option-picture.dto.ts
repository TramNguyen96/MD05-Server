import { IsEmpty, IsNotEmpty } from "class-validator";

export class CreateOptionPictureDto {
    @IsNotEmpty()
    optionId: string;

    @IsNotEmpty()
    icon: string;
    
    @IsEmpty()
    isAvatar: boolean;
}