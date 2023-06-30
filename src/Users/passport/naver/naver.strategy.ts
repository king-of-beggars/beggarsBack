import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { UserService } from '../../user.service';
import { UserEntity } from 'src/Users/user.entity';
import { TokenDto } from '../../dto/token.dto';
@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.NAVER_ID,
      callbackURL: 'https://poorkingapi.shop/api/user/login/naver',
      // callbackURL: 'https://localhost:3000/api/user/login/naver',
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    id_token: any,
    profile: any,
    done: Function,
  ): Promise<any> {
    const dbCheck = await this.userService.userByName(id_token.id);
    return dbCheck;
  }
}
