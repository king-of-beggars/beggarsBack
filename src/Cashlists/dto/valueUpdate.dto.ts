import { IsNotEmpty, Max } from "class-validator";
import { CashbookEntity } from "../entity/cashbook.entity";

export class ValueUpdateDto {

    @IsNotEmpty()
    @Max(1)
    public cashbookId : CashbookEntity;

    @IsNotEmpty()
    public cashDetailValue : number

}