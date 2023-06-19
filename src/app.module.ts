import { Controller, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './Users/user.entity'
import {UserModule} from './Users/user.module'
import { RedisModule } from '@liaoliaots/nestjs-redis';
@Module({
  imports: [
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

  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
