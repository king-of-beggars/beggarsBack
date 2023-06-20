import { Module, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './user.entity';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController], 
  providers: [UserService, AuthService, JwtService, ConfigService], 
  exports: [UserService, AuthService, JwtService, ConfigService],
}) 
export class UserModule {}   