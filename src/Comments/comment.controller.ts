import { Controller, Post, Delete, UseGuards, Param, Body, Req } from "@nestjs/common";
import { CommentEntity } from "./entity/comment.entity";
import { CommentService } from "./comment.service";
import { PostCommentDto } from "./dto/postComment.dto";
import UserEntity from "src/Users/user.entity";
import { AccessAuthenticationGuard } from "src/Users/passport/jwt/access.guard";
import { BoardEntity } from "src/Boards/entity/board.entity";
import { DeleteResult } from "typeorm";

@Controller('api/board/:boardId/comment/')
export class CommentController {
    constructor(
        private readonly commentService : CommentService
    ){}

    @Post('/')
    @UseGuards(AccessAuthenticationGuard)
    async postComment(@Param() params : BoardEntity, @Body() commentText : string, @Req() req : any) {
        let { user } = req
        let postCommentDto = new PostCommentDto()
        
        postCommentDto = {
            userId : user.userId,
            boardId : params,
            commentText : commentText
        }
        return await this.commentService.postComment(postCommentDto,user.userId)

    }

    @Delete(':commentId')
    @UseGuards(AccessAuthenticationGuard)
    //@UseGuards(AccessAuthenticationGuard)
    async deleteComment(@Param() commentId : number, @Req() req : any) {
        let { user } = req
        const result : DeleteResult = await this.commentService.deleteComment(commentId,user.userId)
        if(!result) {
            throw new Error('정상적으로 삭제되지 않았습니다')
        }
        return `삭제가 완료되었습니다`
    }

}