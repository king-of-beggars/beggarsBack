import { InjectRepository } from '@nestjs/typeorm';
import { Injectable ,Body} from '@nestjs/common'
import UserEntity  from './user.entity'
import {Repository, In} from 'typeorm'
import { TokenDto } from './dto/token.dto'
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly configService : ConfigService
        
    ){}


    //유저아이디, 패스워드 DB확인
    async userPwdCheck(inputPwd:string, comparePwd:string) : Promise<boolean> {
        if(!inputPwd || !comparePwd) {
            throw new Error('비밀번호가 넘어오지 않음')
        }
        const result = await bcrypt.compare(
            inputPwd, comparePwd
        )
        return result
    }

    //액세스 토큰 발급
    async setAccessToken(tokenDto : TokenDto) {
        const accessToken = this.jwtService.sign(tokenDto, { 
            secret :this.configService.get('ACCESS_KEY'), 
            expiresIn : this.configService.get('ACCESS_TIME')
        })
        return `Bearer ${accessToken}`
    }
    
    //리프레시 토큰 발급
    async setRefreshToken(tokenDto : TokenDto) {
        const refreshToken = this.jwtService.sign(tokenDto, { 
            secret :this.configService.get('REFRESH_KEY'), 
            expiresIn : this.configService.get('REFRESH_TIME')
        })
        return `Bearer ${refreshToken}`

    }

    //토큰 저장
    


}