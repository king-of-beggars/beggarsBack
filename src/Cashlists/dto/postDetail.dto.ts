import { IsNotEmpty, Max } from "class-validator";
import { CashbookEntity } from "../entity/cashbook.entity";

export class PostDetailDto {

    @IsNotEmpty()
    @Max(1)
    public cashbookId : CashbookEntity;

    @IsNotEmpty()
    public cashDetailText : string;

    @IsNotEmpty()
    public cashDetailValue : number

}