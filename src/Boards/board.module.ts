import { Module, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/Users/user.entity'
import {Board} from 'src/Boards/entity/board.entity'
import {Comment} from 'src/Comments/entity/comment.entity'
import { PassportModule } from '@nestjs/passport';
import { BoardController} from 'src/Boards/board.controller'
import { BoardService } from 'src/Boards/board.service'
import { UserModule } from 'src/Users/user.module';
import { CashbookModule } from 'src/Cashlists/cashbook.module';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import { CashDetail } from 'src/Cashlists/entity/cashDetail.entity';
import { AccessStrategy } from 'src/Users/passport/jwt/access.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([User,Board,Comment,Cashbook,CashDetail]),
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