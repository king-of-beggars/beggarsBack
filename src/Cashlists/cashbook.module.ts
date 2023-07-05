import { Module, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/Users/user.entity'
import { PassportModule } from '@nestjs/passport';
import { BoardController} from 'src/Boards/board.controller'
import { BoardService } from 'src/Boards/board.service'
import { CashList } from './entity/cashList.entity';
import { CashDetail } from './entity/cashDetail.entity';
import { CashbookService } from './cashbook.service';
import { CashbookContoller } from './cashbook.controller';
import { Cashbook } from './entity/cashbook.entity';
import { CashActivity } from './entity/cashactivity.entity';
import { UserService } from 'src/Users/user.service';
import { AutoCreateService } from './autocreate.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Board } from 'src/Boards/entity/board.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User,CashList,CashDetail,Cashbook,CashActivity,Board]),
    PassportModule,
    ScheduleModule.forRoot()
  ],
  controllers: [
    CashbookContoller
  ], 
  providers: [
    CashbookService,
    UserService,
    AutoCreateService,
    BoardService
  ], 
  exports: [
    CashbookService,
    AutoCreateService

  ],
}) 
export class CashbookModule {}   