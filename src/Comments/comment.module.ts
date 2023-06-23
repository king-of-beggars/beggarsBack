import { Module, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from 'src/Users/user.entity'
import {BoardEntity} from 'src/Boards/entity/board.entity'
import {CommentEntity} from 'src/Comments/entities/comment.entity'
import { LikeEntity } from '../Comments/entities/like.entity';
import { PassportModule } from '@nestjs/passport';
import { BoardController} from 'src/Boards/board.controller'
import { BoardService } from 'src/Boards/board.service'
import { CommentService } from './comment.service';
import { LikeController } from './like.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity,BoardEntity,CommentEntity,LikeEntity]),
    PassportModule,

  ],
  controllers: [BoardController,LikeController], 
  providers: [
    CommentService
  ], 
  exports: [
    CommentService
  ],
}) 
export class CommentModule {}   