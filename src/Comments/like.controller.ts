import { Controller, Post, Delete } from "@nestjs/common";

@Controller('api/like')
export class LikeController {

    @Post(':commentId')
    async postLike() {

    }

}