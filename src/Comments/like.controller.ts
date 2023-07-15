import { Controller, Post, Delete, Param, Req, Body, HttpStatus, HttpException } from '@nestjs/common';
import { Comment } from './entity/comment.entity';
import { CommentService } from './comment.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateFail } from 'src/Utils/exception.service';

@Controller('api/like')
@ApiTags('댓글/좋아요 API')
export class LikeController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':commentId')
  async postLike(@Param() params: Comment, @Req() req: any) {
    try {
      let { user } = req;
      await this.commentService.postLike(user.userId, params);
      return `좋아요 완료`;
    } catch(e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
