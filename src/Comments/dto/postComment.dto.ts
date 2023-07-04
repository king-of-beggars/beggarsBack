import { IsNotEmpty, Max } from "class-validator";
import { Board } from "src/Boards/entity/board.entity";
import {User} from "src/Users/user.entity";

export class PostCommentDto  {

    @IsNotEmpty()
    public boardId : Board;

    @IsNotEmpty()
    public userId : User;

    @IsNotEmpty()
    public commentText : string;

}