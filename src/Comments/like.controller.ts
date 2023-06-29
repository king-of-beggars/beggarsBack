import { Controller, Post, Delete, Param, Req, Body } from "@nestjs/common";
import { CommentEntity } from "./entity/comment.entity";
import { CommentService } from "./comment.service";

@Controller('api/like')
export class LikeController {
    constructor(
        private readonly commentService : CommentService
    ){}

    @Post(':commentId')
    async postLike(@Param() params : CommentEntity, @Req() req : any) {
        let { user } = req
        //this.commentService.postLike(user.userId,params)

    }

}