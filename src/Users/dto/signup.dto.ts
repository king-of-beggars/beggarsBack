import {IsNotEmpty} from 'class-validator' 

export class SignupDto {

    @IsNotEmpty()
    public userName : string;
    @IsNotEmpty()
    public userNickname : string;
    @IsNotEmpty()
    public userPwd : string;
}

export default SignupDto;