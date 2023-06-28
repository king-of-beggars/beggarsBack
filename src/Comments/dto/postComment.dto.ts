import { IsNotEmpty, Max } from "class-validator";
import { BoardEntity } from "src/Boards/entity/board.entity";

export class PostCommentDto  {

    @IsNotEmpty()
    public boardId : BoardEntity;

    @IsNotEmpty()
    public commentText : string;

}