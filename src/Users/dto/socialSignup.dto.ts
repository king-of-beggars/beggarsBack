import {IsNotEmpty} from 'class-validator' 

export class SocialSignupDto {
    
    @IsNotEmpty()
    public userName : string;

    @IsNotEmpty()
    public userNickname : string;

    @IsNotEmpty()
    public userType : number
    
    @IsNotEmpty()
    public userLoginType : string 
}

export default SocialSignupDto;