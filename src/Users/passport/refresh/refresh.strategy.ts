import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
//import { Strategy } from 'passport-jwt';
// import {} from 'passport-naver';
import { Request } from 'express';
import { UserService } from 'src/Users/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './../../dto/token.dto';
@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['refreshToken'].split(' ')[1];
          }
          return token;
        },
      ]),
      secretOrKey: 'process.env.REFRESH_TIME',
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload: any) {
    const refreshToken = request.cookies['refreshToken'].split(' ')[1];

    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId,
    );
  }
}
