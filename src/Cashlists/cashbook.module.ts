import { Module, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from 'src/Users/user.entity'
import { PassportModule } from '@nestjs/passport';
import { BoardController} from 'src/Boards/board.controller'
import { BoardService } from 'src/Boards/board.service'
import { CashListEntity } from './entity/cashList.entity';
import { CashDetailEntity } from './entity/cashDetail.entity';
import { CashbookService } from './cashbook.service';
import { CashbookContoller } from './cashbook.controller';
import { CashbookEntity } from './entity/cashbook.entity';
import { CashActivityEntity } from './entity/cashactivity.entity';
import { UserService } from 'src/Users/user.service';
import { AutoCreateService } from './autocreate.service';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity,CashListEntity,CashDetailEntity,CashbookEntity,CashActivityEntity]),
    PassportModule,
    ScheduleModule.forRoot()
  ],
  controllers: [
    CashbookContoller
  ], 
  providers: [
    CashbookService,
    UserService,
    AutoCreateService
  ], 
  exports: [
    CashbookService,
    AutoCreateService

  ],
}) 
export class CashbookModule {}   