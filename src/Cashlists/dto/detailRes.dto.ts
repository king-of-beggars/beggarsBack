import { PickType,ApiProperty } from "@nestjs/swagger";
import { CashDetailDto, CashbookDto } from "./cashbook.dto";

class DetailValueDto extends PickType(CashDetailDto,['cashDetailId','cashDetailText','cashDetailValue', 'cashDetailCreatedAt'] as const) {}

export class DetailResDto extends PickType(CashbookDto, ['cashbookName','cashbookCategory','cashbookGoalValue'] as const) {

    @ApiProperty({
        example : [{
            "cashDetailId": 1,
            "cashDetailText": "츄파츕스",
            "cashDetailValue": 500,
            "cashDetailCreatedAt": "2023-06-26T01:34:16.570Z"
        }],
        description : '캐시 디테일'
    })
    public detail : DetailValueDto[]

}
