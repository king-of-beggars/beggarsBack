import { IsNotEmpty, Max } from "class-validator";
import { Cashbook } from "../entity/cashbook.entity";

export class PostDetailDto {

    @IsNotEmpty()
    @Max(1)
    public cashbookId : Cashbook;

    @IsNotEmpty()
    public cashDetailText : string;

    @IsNotEmpty()
    public cashDetailValue : number

}