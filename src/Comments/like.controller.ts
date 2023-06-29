import { Controller, Post, Delete, Param, Req, Body } from "@nestjs/common";
import { CommentEntity } from "./entity/comment.entity";

@Controller('api/like')
export class LikeController {

    @Post(':commentId')
    async postLike(@Param() params : CommentEntity, @Req() req : any) {
        let { user } = req
        

    }

}