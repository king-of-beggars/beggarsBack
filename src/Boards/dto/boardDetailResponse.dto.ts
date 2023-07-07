import { ApiProperty, PickType } from '@nestjs/swagger';
import { BoardResponseDTO } from './boardResponse.dto';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';

export class BoardDetailReponseDTO extends PickType(BoardResponseDTO, [
  'boardId',
  'boardText',
  'boardTypes',
  'boardCreatedAt',
  'boardUpdatedAt',
  'userId',
  'comments',
  'cashbookId',
]) {
  @ApiProperty({
    type: Cashbook,
  })
  cashbookDetail: Cashbook;
}
