import { IsNotEmpty, Max } from "class-validator";
import UserEntity from "src/Users/user.entity";
import { CashbookEntity } from "../entity/cashbook.entity";

export class FrameDto {

    @IsNotEmpty()
    public cashCategory: string;

    public cashName?: string;

    @IsNotEmpty()
    public cashListGoalValue: number;

    @IsNotEmpty()
    public userId : UserEntity;
}