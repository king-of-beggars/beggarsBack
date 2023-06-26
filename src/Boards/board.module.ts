import { Module, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from 'src/Users/user.entity'
import {BoardEntity} from 'src/Boards/entity/board.entity'
import {CommentEntity} from 'src/Comments/entity/comment.entity'
import { PassportModule } from '@nestjs/passport';
import { BoardController} from 'src/Boards/board.controller'
import { BoardService } from 'src/Boards/board.service'
import { UserModule } from 'src/Users/user.module';
import { CashbookModule } from 'src/Cashlists/cashbook.module';
import { CashbookEntity } from 'src/Cashlists/entity/cashbook.entity';
import { CashDetailEntity } from 'src/Cashlists/entity/cashDetail.entity';
import { AccessStrategy } from 'src/Users/passport/jwt/access.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity,BoardEntity,CommentEntity,CashbookEntity,CashDetailEntity]),
    PassportModule,
    UserModule,
    CashbookModule
  ],
  controllers: [BoardController], 
  providers: [
    BoardService
  ], 
  exports: [
    BoardService
  ],
}) 
export class BoardModule {}   