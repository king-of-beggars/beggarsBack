import { IsNotEmpty, Max } from 'class-validator';
import User from 'src/Users/user.entity';
import { Cashbook } from '../entity/cashbook.entity';
import { PickType } from '@nestjs/swagger';
import { CashbookDto } from './cashbook.dto';

export class CashbookCreateDto extends PickType(CashbookDto, [
  'cashbookCategory',
  'cashbookName',
  'cashbookGoalValue',
  'userId',
  'cashListId',
] as const) {}
 