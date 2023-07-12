import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/Users/service/user.service';
import { AuthService } from '../../service/oauth2.service'
import { Request } from 'express'
import TokenDto from 'src/Users/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy,'access') {
    constructor(
        private readonly userService : UserService,
        private readonly jwtService : JwtService,
        private readonly configService : ConfigService

    ){
        super({
            jwtFromRequest : ExtractJwt.fromExtractors([
                (request : Request) => {
                    let token = request.headers.cookie
                    if(token) {
                        token = token.split(';')[1]
                        token = token.split('=')[1]
                    } 
                    console.log(token)
                    // let token = request.headers['set-cookie'][0]
                    // if(token) {
                    //     //token = token.split(',')[1]
                    //     token = token.split('=')[1]
                    //     token = token.split(' ')[0]
                    //     token = token.replace(';','')
                    // } 
                    // console.log(token)
                    const test = jwtService.verify(token,{secret : this.configService.get('SECRET_KEY')})
                    return token 
                }
            ]),
            secretOrKey : process.env.SECRET_KEY
            
        })


    }
    async validate(payload : any) {
        console.log('유효성실행')
        console.log(this.userService.userByName(payload.userName))
        return this.userService.userByName(payload.userName);
    }
    
} 