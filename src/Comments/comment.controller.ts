import { Controller, Post, Delete, UseGuards, Param, Body } from "@nestjs/common";
import { CommentEntity } from "./entity/comment.entity";
import { CommentService } from "./comment.service";
import { PostCommentDto } from "./dto/postComment.dto";

@Controller('api/board/:boardId/comment')
export class CommentController {
    constructor(
        private readonly commentService : CommentService
    ){}

    @Post('/')
    //@UseGuards(AccessAuthenticationGuard)
    async postComment(@Param() params : any, @Body() commentText : string) {
        let postCommentDto = new PostCommentDto()
        postCommentDto = {
            boardId : params,
            commentText : commentText
        }
        this.commentService.postComment(postCommentDto)

    }

    @Delete(':commentId')
    //@UseGuards(AccessAuthenticationGuard)
    async deleteComment() {
        
    }

}