import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/Users/user.service';
import { AuthService } from '../../oauth2.service'
import { Request } from 'express'
import TokenDto from 'src/Users/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy,'access') {
    constructor(
        private readonly userService : UserService,
        private readonly jwtService : JwtService,
        private readonly configServcie : ConfigService

    ){
        super({
            jwtFromRequest : ExtractJwt.fromExtractors([
                (request : Request) => {
                    console.log(request)
                    console.log(`request headers cookies :${request.headers.cookies}`)
                    console.log(`request headers cookie :${request.headers.cookie}`)
                    let token = request.headers.cookie
                    if(token) {
                        token = token.split(';')
                        token = token.split('=')
                    } 
                    console.log(token)
                    const test = jwtService.verify(token,{secret : this.configServcie.get('SECRET_KEY')})
                    return token
                }
            ]),
            secretOrKey : process.env.SECRET_KEY
            
        })


    }
    async validate(payload : any) {
        console.log('유효성실행')
        return this.userService.userByName(payload.userName);
    }
    
} 