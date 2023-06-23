import { Controller, Module,  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './Users/user.entity'
import {UserModule} from './Users/user.module'
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
        entities : [UserEntity],
        logging:true
    }),
    UserModule
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
