import { IsNotEmpty, Max } from "class-validator";
import User from "src/Users/user.entity";
import { Cashbook } from "../entity/cashbook.entity";

export class FrameDto {

    @IsNotEmpty()
    public cashCategory: string;

    public cashName?: string;

    @IsNotEmpty()
    public cashListGoalValue: number;

    @IsNotEmpty()
    public userId : User;
}