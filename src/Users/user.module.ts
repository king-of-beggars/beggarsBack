import { Module, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './oauth2.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './user.entity';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local/local.strategy';
import { KakaoStrategy } from './passport/kakao/kakao.strategy';
import { AccessStrategy } from './passport/jwt/access.strategy';
import { NaverStrategy } from './passport/naver/naver.strategy';
// import { RedisService } from './redis.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
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
    NaverStrategy,
  ],
  exports: [UserService, AuthService, JwtService],
})
export class UserModule {}
