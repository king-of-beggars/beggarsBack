import { IsNotEmpty, Max } from "class-validator";
import UserEntity from "src/Users/user.entity";
import { CashbookEntity } from "../entity/cashbook.entity";

export class PostCashbookDto {

    @IsNotEmpty()
    public cashbookCategory: string;

    public cashbookName?: string;

    @IsNotEmpty()
    public cashbookGoalValue: number;


}