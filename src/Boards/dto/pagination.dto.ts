import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ type: Number, required: true, description: '페이지수' })
  @IsNotEmpty()
  @IsOptional()
  public page: number;

  @ApiProperty({ type: Number, required: true, description: '데이터 개수' })
  @IsNotEmpty()
  @IsOptional()
  public limit: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: '게시물 타입(혼나기=1/자랑하기=0)',
  })
  @IsNotEmpty()
  @IsOptional()
  @Max(1)
  public boardTypes: number;
}
