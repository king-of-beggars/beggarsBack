import { CashbookEntity } from 'src/Cashlists/entity/cashbook.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ListBoard {
  @ApiProperty()
  public CashbookEntity: CashbookEntity;
}
