import { ApiProperty, PickType } from "@nestjs/swagger";
import { CashbookDto } from "./cashbook.dto";

export class GetByCashbookId extends PickType(CashbookDto, ['cashbookId'] as const) {

    
}