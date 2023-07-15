import { IsNotEmpty, Max } from 'class-validator';
import User from 'src/Users/user.entity';
import { Cashbook } from '../entity/cashbook.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { CashbookDto } from './cashbook.dto';
export class PostCashbookDto extends PickType(CashbookDto, [
  'cashbookCategory',
  'cashbookName',
  'cashbookGoalValue',
] as const) {}
 