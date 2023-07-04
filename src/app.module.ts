import { Controller, Module,  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './Users/user.entity'
import {UserModule} from './Users/user.module'
import { CacheModule } from '@nestjs/cache-manager';  
import { redisStore } from 'cache-manager-redis-yet'
import { Board } from './Boards/entity/board.entity';
import { Comment } from './Comments/entity/comment.entity';
import { Like } from './Comments/entity/like.entity';
import { Cashbook } from './Cashlists/entity/cashbook.entity';
import { CashList } from './Cashlists/entity/cashList.entity';
import { CashActivity } from './Cashlists/entity/cashactivity.entity';
import { CashDetail } from './Cashlists/entity/cashDetail.entity';
import { BoardModule } from './Boards/board.module';
import { CashbookModule } from './Cashlists/cashbook.module';
import { CommentModule } from './Comments/comment.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    // ClusterModule.forRootAsync({
    //   useFactory: () => ({
    //   config : {
    //     nodes : [{host :process.env.REDIS_HOST,
    //               port : Number(process.env.REDIS_PORT)}],
    //     slotsRefreshTimeout : 100000,
    //     enableReadyCheck: true,
    //     dnsLookup :(address, callback) => callback(null, address)
    //   }
    // }) 
    //}),
    TypeOrmModule.forRoot({
        type:'mysql',
        host: process.env.DB_HOST,
        port: 3306,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'poorking',
        timezone: 'Asia/Seoul',
        synchronize:true,
        entities : [
                  User,
                  Board,
                  Comment,
                  Cashbook,
                  CashList,
                  CashActivity,
                  CashDetail,
                  Like
                  ],
        logging:true
    }),
    UserModule,
    BoardModule,
    CashbookModule,
    CommentModule,
    ConfigModule.forRoot({
      isGlobal : true
    })
    //CommentModule
    // CacheModule.registerAsync({
    //   useFactory : async() => ({
    //       store: await redisStore({
    //         socket : {
    //           host:process.env.REDIS_HOST,
    //           port:6379
    //         }
    //       })
    //     })
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
