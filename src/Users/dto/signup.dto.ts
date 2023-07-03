import {IsNotEmpty} from 'class-validator' 
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {

    @IsNotEmpty()
    @ApiProperty({ description: '유저아이디' })
    public userName : string;

    @IsNotEmpty()
    @ApiProperty({ description: '유저닉네임' })
    public userNickname : string;

    @IsNotEmpty()
    @ApiProperty({ description: '유저 비밀번호' })
    public userPwd : string;
}

export default SignupDto;