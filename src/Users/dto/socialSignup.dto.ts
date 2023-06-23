export class SocialSignupDto {
    public userName : string;
    public userNickname : string;
    public userType : number = 1 
    public userLoginType : string = 'kakao'
}

export default SocialSignupDto;