import { IsNotEmpty, Max } from "class-validator";
import { Cashbook } from "src/Cashlists/entity/cashbook.entity";
import User from "src/Users/user.entity"

export class PostBoardDto {

    @IsNotEmpty()
    @Max(1)
    public boardTypes : number;

    @IsNotEmpty()
    public boardText : string;

    @IsNotEmpty()
    public userId : User;

    @IsNotEmpty()
    public cashbookId : Cashbook;


}