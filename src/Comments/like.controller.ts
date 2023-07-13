import { Controller, Post, Delete, Param, Req, Body } from '@nestjs/common';
import { Comment } from './entity/comment.entity';
import { CommentService } from './comment.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/like')
@ApiTags('댓글/좋아요 API')
export class LikeController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':commentId')
  async postLike(@Param() params: Comment, @Req() req: any) {
    let { user } = req;
    await this.commentService.postLike(user.userId, params);
    return `좋아요 완료`;
  }
}
