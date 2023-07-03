import {IsNotEmpty} from 'class-validator' 
import { ApiProperty } from '@nestjs/swagger';

export class SocialSignupDto {
    
    @IsNotEmpty()
    @ApiProperty({ description: '유저아이디' })
    public userName : string;

    @IsNotEmpty()
    @ApiProperty({ description: '유저닉네임' })
    public userNickname : string;

    @IsNotEmpty()
    public userType : number
    
    @IsNotEmpty()
    public userLoginType : string 
}

export default SocialSignupDto;