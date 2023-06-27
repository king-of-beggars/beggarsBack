import { Controller, Post, Delete, UseGuards } from "@nestjs/common";



@Controller('api/board/:boardId/comment')
export class CommentController {

    @Post('/')
    //@UseGuards(AccessAuthenticationGuard)
    async postComment() {

    }

    @Delete(':commentId')
    //@UseGuards(AccessAuthenticationGuard)
    async deleteComment() {

    }

}