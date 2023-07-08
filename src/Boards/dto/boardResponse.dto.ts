import { ApiProperty, PickType } from '@nestjs/swagger';
import { Board } from '../entity/board.entity';
import { User } from 'src/Users/user.entity';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';

export class BoardResponseDTO extends PickType(Board, [
  'boardId',
  'boardText',
  'boardTypes',
  'boardCreatedAt',
  'boardUpdatedAt',
  'userId',
  'comments',
  'cashbookId',
]) {}