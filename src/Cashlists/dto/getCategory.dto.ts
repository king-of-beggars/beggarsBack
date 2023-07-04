import { ApiProperty, PickType } from "@nestjs/swagger";
import { PostCashbookDto } from "./postCashbook.dto";

export class GetCategory extends PickType(PostCashbookDto, ['cashbookCategory', 'cashbookGoalValue'] as const) {

    @ApiProperty({
        example : 4000,
        description : '사용자의 이용 금액'
    })
    public cashbookNowValue : number; 
}