import {IsNotEmpty} from 'class-validator' 

export class TokenDto {

    @IsNotEmpty()
    public userName : string;

    @IsNotEmpty()
    public userNickname : string;

    @IsNotEmpty()
    public userId : number;
}

export default TokenDto;