import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBoardDTO {
  @ApiProperty({
    type: Number,
    description: '게시글 Id',
    required: true,
  })
  @IsNotEmpty()
  public boardId: number;
}
