import { IsNotEmpty, Max } from 'class-validator';
import { CashbookEntity } from 'src/Cashlists/entity/cashbook.entity';
import UserEntity from 'src/Users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PostBoardDto {
  @ApiProperty({
    type: Number,
    maxLength: 1,
    description: 'board 타입(혼나기=1/자랑하기=0)',
    required: true,
  })
  @IsNotEmpty()
  @Max(1)
  public boardTypes: number;

  @ApiProperty({ type: String, description: 'board  내용', required: true })
  @IsNotEmpty()
  public boardText: string;

  @ApiProperty({ type: Number, description: '유저 id', required: true })
  @IsNotEmpty()
  public userId: UserEntity;

  @ApiProperty({ type: Number, description: 'cashbook id', required: true })
  @IsNotEmpty()
  public cashbookId: CashbookEntity;
}
