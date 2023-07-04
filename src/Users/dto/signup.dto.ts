import {IsNotEmpty} from 'class-validator' 
import { ApiProperty } from '@nestjs/swagger';
import { PickType } from "@nestjs/swagger";
import User from "../user.entity";

export class SignupDto {
    @ApiProperty({
        example : 'rlatmdcjf',
        description : '사용자 아이디'
    })
    public userName : string;

    @ApiProperty({
        example : 'qwe123456',
        description : '유저 비밀번호'
    })
    public userPwd: string;

    @ApiProperty({
        example : '거지왕',
        description : '사용자 닉네임'
    })
    public userNickname: string;

}