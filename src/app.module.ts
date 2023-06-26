import { Controller, Module,  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './Users/user.entity'
import {UserModule} from './Users/user.module'
import { CacheModule } from '@nestjs/cache-manager';  
import { redisStore } from 'cache-manager-redis-yet'
import { BoardEntity } from './Boards/entity/board.entity';
import { CommentEntity } from './Comments/entity/comment.entity';
import { LikeEntity } from './Comments/entity/like.entity';
import { CashbookEntity } from './Cashlists/entity/cashbook.entity';
import { CashListEntity } from './Cashlists/entity/cashList.entity';
import { CashActivityEntity } from './Cashlists/entity/cashactivity.entity';
import { CashDetailEntity } from './Cashlists/entity/cashDetail.entity';
import { BoardModule } from './Boards/board.module';
import { CashbookModule } from './Cashlists/cashbook.module';
import { CommentModule } from './Comments/comment.module';
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
        synchronize:true,
        entities : [
                  UserEntity,
                  BoardEntity,
                  CommentEntity,
                  CashbookEntity,
                  CashListEntity,
                  CashActivityEntity,
                  CashDetailEntity,
                  LikeEntity
                  ],
        logging:true
    }),
    UserModule,
    BoardModule,
    CashbookModule,
    CommentModule
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
