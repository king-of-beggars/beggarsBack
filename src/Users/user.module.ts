import { Module, Controller } from '@nestjs/common';
import { UserService } from './service/user.service';
import { AuthService } from './service/oauth2.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local/local.strategy';
import { KakaoStrategy } from './passport/kakao/kakao.strategy';
import { AccessStrategy } from './passport/jwt/access.strategy';
import { RefreshStrategy } from './passport/refresh/refresh.strategy';
// import { RedisService } from './redis.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    JwtService,
    ConfigService, 
    LocalStrategy,
    KakaoStrategy,
    AccessStrategy,
    RefreshStrategy
  ],
  exports: [UserService, AuthService, JwtService],
})
export class UserModule {}
