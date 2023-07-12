import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/Users/user.entity';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import { BoardDto } from './board.dto';
import { UserDto } from 'src/Users/dto/user.dto';
import { CashbookDto } from 'src/Cashlists/dto/cashbook.dto';

class BoardUserDto extends PickType(UserDto,[
  'userName',
  'userNickname'
]) {}

class BoardCashbookDto extends PickType(CashbookDto,[
  'cashbookId',
  'cashbookCategory',
  'cashbookName',
  'cashbookNowValue',
  'cashbookGoalValue',
  'cashbookCreatedAt'
]){}

export class BoardResDto extends PickType(BoardDto, [
  'boardId',
  'boardName',
  'boardText',
  'boardTypes',
  'boardCreatedAt',
]) {

  @ApiProperty({
    type : BoardUserDto,
    example : {
        'userName' : 'dfgdfg',
        'userNickname' : 'fgdhgfhfgh'
    }
  })
  public userId : BoardUserDto

  @ApiProperty({
    type : BoardCashbookDto,
    example : {
        "cashbookId": 188,
        "cashbookCategory": "식비", 
        "cashbookName": "asdsdfsdf",
        "cashbookNowValue": 0,
        "cashbookGoalValue": 3000,
        "cashbookCreatedAt": "2023-07-11T16:36:01.000Z"
      }
  })
  public cashbookId : BoardCashbookDto
}