import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from 'src/Users/auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor(private authService : AuthService) {
        super({
            clientID: process.env.KAKAO_ID,
            callbackURL: 'http://localhost:3000/api/user/login/kakao',
        })

    }
    async validate(accessToken: string, refreshToken: string, id_token : any, profile: any, done: Function) {
                return this.authService.kakaoLogin(id_token)
    }  
}