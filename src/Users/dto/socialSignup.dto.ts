import {IsNotEmpty} from 'class-validator' 
import { ApiProperty } from '@nestjs/swagger';
import { PickType } from "@nestjs/swagger";
import User from "../user.entity";
import { SignupDto } from './signup.dto';

export class SocialSignupDto extends PickType(SignupDto, ['userName', 'userNickname'] as const) {

    
    public userType: number;

    public userLoginType: string;
}
