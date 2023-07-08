import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max } from 'class-validator';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import User from 'src/Users/user.entity';

export class PostBoardDto {
  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @Max(1)
  public boardTypes: number;

  @ApiProperty({ type: String, required: true })
  @ApiProperty()
  @IsNotEmpty()
  public boardText: string;

  @ApiProperty({ type: User, required: true })
  @IsNotEmpty()
  public userId: User;

  @ApiProperty({ type: Cashbook, required: true })
  @IsNotEmpty()
  public cashbookId: Cashbook;
}