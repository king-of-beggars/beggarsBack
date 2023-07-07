import { IsNotEmpty, Max, isEmpty } from 'class-validator';
import UserEntity from 'src/Users/user.entity';
import { CashbookEntity } from '../entity/cashbook.entity';
import { CashListEntity } from '../entity/cashList.entity';

export class FrameDto {
  @IsNotEmpty()
  public cashCategory: string;

  public cashName?: string;

  @IsNotEmpty()
  public cashListGoalValue: number;

  @IsNotEmpty()
  public userId: UserEntity;

  public cashListId?: number;
}
