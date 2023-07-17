import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/Users/service/user.service';
import { AuthService } from '../../service/oauth2.service';
import { Request } from 'express';
import TokenDto from 'src/Users/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
            console.log(request.cookies.accessToken);
            let token = request.cookies.accessToken;
            if(!token) {
              throw new HttpException('액세스 토큰이 없습니다',HttpStatus.UNAUTHORIZED)
            }
            try {
              const test = jwtService.verify(token, {
              secret: this.configService.get('SECRET_KEY'),
            }); 
              return token;
            } catch(e) {
              throw new HttpException('액세스 토큰이 유효하지 않습니다',HttpStatus.UNAUTHORIZED)
            }
        },
      ]),
      secretOrKey: process.env.SECRET_KEY,
    });
  }
  async validate(payload: any) { 
    const user = this.userService.userByName(payload.userName);
    if(!user) {
      throw new HttpException('액세스 토큰 검증 실패',HttpStatus.UNAUTHORIZED)
    }
    return user;
  }
}
