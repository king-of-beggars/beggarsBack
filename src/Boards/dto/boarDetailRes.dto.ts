import { ApiProperty, PickType } from '@nestjs/swagger';
import { BoardDto } from './board.dto';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import { CommentDto } from 'src/Comments/dto/comment.dto';
import { Comment } from 'src/Comments/entity/comment.entity';
import { UserDto } from 'src/Users/dto/user.dto';
import { CashDetailDto, CashbookDto } from 'src/Cashlists/dto/cashbook.dto';
import { CashDetail } from 'src/Cashlists/entity/cashDetail.entity';

class BoardCommentResDto extends PickType(CommentDto, [
  'commentId',
  'commentText',
  'commentCreatedAt',
]) {
  @ApiProperty({
    example: 2,
  })
  public likeCheck: number;
  @ApiProperty({
    example: 0,
  })
  public likeCount: number;
}

class BoardUserResDto extends PickType(UserDto, [
  'userId',
  'userName',
  'userNickname',
]) {}

class BoardCashDetailResDto extends PickType(CashbookDto, [
  'cashbookId',
  'cashbookName',
  'cashbookGoalValue',
  'cashbookCreatedAt',
  'cashbookNowValue',
  'detail',
]) {}

export class BoardDetailResDto extends PickType(BoardDto, [
  'boardId',
  'boardText',
  'boardTypes',
  'boardCreatedAt',
  'boardUpdatedAt',
]) {
  @ApiProperty({
    type: [BoardCommentResDto],
  })
  public comments?: BoardCommentResDto[];
}
