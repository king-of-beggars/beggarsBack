import { IsNotEmpty, Max } from "class-validator";
import { CashbookEntity } from "src/Cashlists/entity/cashbook.entity";
import UserEntity from "src/Users/user.entity"

export class PostBoardDto {

    @IsNotEmpty()
    @Max(1)
    public boardTypes : number;

    @IsNotEmpty()
    public boardText : string;

    @IsNotEmpty()
    public userId : UserEntity;

    @IsNotEmpty()
    public cashbookId : CashbookEntity;


}