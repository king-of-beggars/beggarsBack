import { IsNotEmpty, Max } from "class-validator";
import { BoardEntity } from "src/Boards/entity/board.entity";
import {UserEntity} from "src/Users/user.entity";

export class PostCommentDto  {

    @IsNotEmpty()
    public boardId : BoardEntity;

    @IsNotEmpty()
    public userId : UserEntity;

    @IsNotEmpty()
    public commentText : string;

}