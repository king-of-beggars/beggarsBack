import { IsNotEmpty, Max } from "class-validator";
import User from "src/Users/user.entity";
import { Cashbook } from "../entity/cashbook.entity";
import { ApiProperty } from "@nestjs/swagger";
export class PostCashbookDto {

    @IsNotEmpty()
    @ApiProperty({
        example : '식비',
        description : '사용자 소비 카테고리'
    })
    public cashbookCategory: string;

    @ApiProperty({
        example : '점심',
        description : '카드섹션 이름'
    })
    public cashbookName?: string;

    @IsNotEmpty()
    @ApiProperty({
        example : 4000,
        description : '사용자의 목표 금액'
    })
    public cashbookGoalValue: number;


}