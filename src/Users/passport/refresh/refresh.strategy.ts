import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/Users/service/user.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/Users/service/redis.service';
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService
      ) {
        super({
          jwtFromRequest: ExtractJwt.fromExtractors([
            (request: Request) => {
                try 
                  {
                    if(!request.headers.refreshtoken) {
                        throw new HttpException('리프레시 토큰이 없습니다.',HttpStatus.BAD_REQUEST)
                    }
                    const token = request.headers.refreshToken
                    if(!token) {
                      throw new HttpException('리프레시 토큰이 없습니다.',HttpStatus.BAD_REQUEST)
                    }
                    const test = jwtService.verify(token, {
                    secret: this.configService.get('SECRET_KEY')
                    })
                    console.log(test)
                    const userName = this.redisService.getRefresh(test.userName)
                    if(!userName) {
                      throw new HttpException('리프레시 토큰이 DB에 없습니다', HttpStatus.BAD_REQUEST)
                    }
                    return token; 
                 } catch(e) {
                    console.log(e)
                    throw new HttpException('리프레시 토큰이 유효하지 않습니다.',HttpStatus.FORBIDDEN)
                }
            } 
          ]),
          secretOrKey: process.env.SECRET_KEY,
        });
      } 
      async validate(payload: any) {
        //이부분은 REDIS 도입중
        const user =  this.userService.userByName(payload.userName);
        if(!user) {
            throw new HttpException('리프레시 토큰 정보가 일치하지 않습니다',HttpStatus.FORBIDDEN)
        }
        return user;
    }
}

