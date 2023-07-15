import { IsNotEmpty, Max } from 'class-validator';
import { Cashbook } from '../entity/cashbook.entity';
import { PickType } from '@nestjs/swagger';
import { CashDetailDto } from './cashbook.dto';

export class PostDetailDto extends PickType(CashDetailDto, [
  'cashbookId',
  'cashDetailText',
  'cashDetailValue',
] as const) {}
 