import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, Max } from 'class-validator';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import User from 'src/Users/user.entity';
import { BoardDto } from './board.dto';

export class PostBoardDto extends PickType(BoardDto, [
  'boardTypes',
  'boardName',
  'boardText',
  'userId',
  'cashbookId',
]) {}
 