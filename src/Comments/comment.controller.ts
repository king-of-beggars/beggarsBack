import { Controller, Post, Delete, UseGuards, Param, Body } from "@nestjs/common";
import { CommentEntity } from "./entity/comment.entity";
import { CommentService } from "./comment.service";
import { PostCommentDto } from "./dto/postComment.dto";
import UserEntity from "src/Users/user.entity";

@Controller('api/board/:boardId/comment/')
export class CommentController {
    constructor(
        private readonly commentService : CommentService
    ){}

    @Post('/')
    //@UseGuards(AccessAuthenticationGuard)
    async postComment(@Param() params : any, @Body() commentText : string) {
        let postCommentDto = new PostCommentDto()
        const userId : any = 1
        postCommentDto = {
            userId : userId,
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