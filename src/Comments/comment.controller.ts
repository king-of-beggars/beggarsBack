import { Controller, Post, Delete, UseGuards, Param, Body, Req } from "@nestjs/common";
import { Comment } from "./entity/comment.entity";
import { CommentService } from "./comment.service";
import { PostCommentDto } from "./dto/postComment.dto";
import User from "src/Users/user.entity";
import { AccessAuthenticationGuard } from "src/Users/passport/jwt/access.guard";
import { Board } from "src/Boards/entity/board.entity";
import { DeleteResult } from "typeorm";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('댓글/좋아요 API')
@Controller('api/board/:boardId/comment/')
export class CommentController {
    constructor(
        private readonly commentService : CommentService
    ){}

    @Post('/')
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '댓글 입력', description: '댓글 입력, 포인트 1점 기입' })
    @ApiParam({ name: 'boardId', type: 'number' })
    async postComment(@Param() boardId : Board, @Body() commentText : string, @Req() req : any) {
        let { user } = req
        let postCommentDto = new PostCommentDto()
        
        postCommentDto = {
            userId : user.userId, 
            boardId : boardId,
            commentText : commentText
        }
        return await this.commentService.postComment(postCommentDto,user.userId)

    }

    @Delete(':commentId')
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '댓글 삭제', description: '삭제가 완료되었습니다 리턴' })
    async deleteComment(@Param() commentId : number, @Req() req : any) {
        let { user } = req
        const result : DeleteResult = await this.commentService.deleteComment(commentId,user.userId)
        if(!result) {
            throw new Error('정상적으로 삭제되지 않았습니다')
        }
        return `삭제가 완료되었습니다`
    }

}