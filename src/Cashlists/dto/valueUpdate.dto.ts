import { IsNotEmpty, Max } from "class-validator";
import { Cashbook } from "../entity/cashbook.entity";

export class ValueUpdateDto {

    @IsNotEmpty()
    @Max(1)
    public cashbookId : Cashbook;

    @IsNotEmpty()
    public cashDetailValue : number

}