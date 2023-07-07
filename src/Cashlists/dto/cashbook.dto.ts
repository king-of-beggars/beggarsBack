import User from "src/Users/user.entity";
import { CashDetail } from "../entity/cashDetail.entity";
import { Cashbook } from "../entity/cashbook.entity";
import { ApiProperty } from "@nestjs/swagger";

class CashbookDto {

    @ApiProperty({
        example : 14,
        description : '캐시북 번호'
    })
    public cashbookId : number

    @ApiProperty({
        example : '식비',
        description : '캐시북 카테고리'
    })
    public cashbookCategory : string

    @ApiProperty({
        example : '중식',
        description : '캐시북 카테고리 소분류'
    })
    public cashbookName : string

    @ApiProperty({
        example : 2000,
        description : '현재 소비된 금액'
    })
    public cashbookNowValue : number;

    @ApiProperty({
        example : 4000,
        description : '목표 소비 금액'
    })
    public cashbookGoalValue : number;

    @ApiProperty({
        example : '2023-07-04 04:49:37.783151',
        description : '캐시북 생성 날짜. 디폴트 당일 00시'
    })
    public cashbookCreatedAt : Date

    @ApiProperty({
        example : '2023-07-04 04:49:37.783151',
        description : '캐시북 수정'
    })
    public cashbookUpdatedAt : Date

    public userId : User

    public detail? : CashDetail[]; 

}

class CashListDto {
    
    @ApiProperty({
        example : 14,
        description : '캐시 리스트 번호'
    })
    public cashListId : number

    @ApiProperty({
        example : '식비',
        description : '가계부 프레임 카테고리'
    })
    public cashCategory : string

    @ApiProperty({
        example : '식비',
        description : '가계부 프레임 이름'
    })
    public cashName : string

    @ApiProperty({
        example : 5000,
        description : '가계부 프레임 목표'
    })
    public cashListGoalValue : number;

    @ApiProperty({
        example : '2023-07-04 04:49:37.783151',
        description : '가계부 프레임 생성일'
    })
    public cashListCreatedAt : Date

    @ApiProperty({
        example : '2023-07-04 04:49:37.783151',
        description : '가계부 프레임 수정일'
    })
    public cashListUpdatedAt : Date

    public userId : User


}

class CashDetailDto {

    @ApiProperty({
        example : 14,
        description : '캐시 디테일 번호'
    })
    public cashDetailId : number

    @ApiProperty({
        example : '짬뽕',
        description : '소비 상세 정보'
    })
    public cashDetailText : string

    @ApiProperty({
        example : 5000,
        description : '소비 상세 가격'
    })
    public cashDetailValue : number


    @ApiProperty({
        example : '2023-07-04 04:49:37.783151',
        description : '가계부 디테일 생성일'
    })
    public cashDetailCreatedAt : Date

    public cashbookId : Cashbook

}

class CashActivityDto {

}

export { CashbookDto, CashListDto , CashDetailDto, CashActivityDto}