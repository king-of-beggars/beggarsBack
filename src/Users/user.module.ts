import { Module, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './user.entity';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local/local.strategy';
import { KakaoStrategy } from './passport/kakao/kakao.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule
  ],
  controllers: [UserController], 
  providers: [
    UserService, 
    AuthService, 
    JwtService, 
    ConfigService,
    LocalStrategy,
    KakaoStrategy
  ], 
  exports: [
    UserService, 
    AuthService, 
    JwtService,
  ],
}) 
export class UserModule {}   