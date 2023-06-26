import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { UserService } from '../../user.service'
import { UserEntity} from 'src/Users/user.entity'
import { TokenDto } from '../../dto/token.dto'
@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor(
                private userService : UserService
        ) {
        super({
            //clientID: process.env.KAKAO_ID,
            clientID : '2ad53ec39ebaac5ba8a250967f431977',
            callbackURL: 'https://poorkingapi.shop/api/user/login/kakao',
        })

    }
    async validate(accessToken: string, refreshToken: string, id_token : any, profile: any, done: Function) : Promise<any> {
            const dbCheck = await this.userService.userByName(id_token.id)
            return dbCheck;
            // let tokenDto : TokenDto;
            // dbCheck.then((user)=>{
            //     tokenDto.userId = user.userId
            //     tokenDto.userName = user.userName
            //     tokenDto.userNickname = user.userNickname
            //     return tokenDto;
            // }).catch((err) => {
            //     console.log(err)
            //     tokenDto.userId = id_token.id
            //     return tokenDto;
            // })
                              
    }  
}