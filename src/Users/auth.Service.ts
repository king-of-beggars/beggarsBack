import { InjectRepository } from '@nestjs/typeorm';
import { Injectable ,Body} from '@nestjs/common'
import UserEntity  from './user.entity'
import {Repository, In} from 'typeorm'
import { TokenDto } from './dto/token.dto'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'
import { UserService } from './user.service';

@Injectable()
export class AuthService { 
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly configService : ConfigService,
        private readonly userService : UserService
    ){}


    //패스워드 DB확인
    async userCheck(userName: string, userPwd:string) : Promise<UserEntity> {
        
        if(!userName || !userPwd) {
            throw new Error('아이디나 비번이 없다')
        }
        //아이디 확인
        const byName : UserEntity = await this.userService.userByName(userName)
        .catch(e=>{
            throw new Error('아이디가 DB에 없습니다')
        })

        //DB 데이터 확인
        const result = await bcrypt.compare(
            userPwd, byName.userPwd
        )

        if(!result) {
            throw new Error('비밀번호가 일치하지 않습니다')
        }

        return byName
    }

    //액세스 토큰 발급
    async setAccessToken(tokenDto : TokenDto) {
        const accessToken = this.jwtService.sign(JSON.parse(JSON.stringify(tokenDto)), { 
            secret :this.configService.get('ACCESS_KEY'), 
            expiresIn : this.configService.get('ACCESS_TIME')
        })
        return `Bearer ${accessToken}`
    }
    
    //리프레시 토큰 발급
    async setRefreshToken(tokenDto : TokenDto) {
        console.log(`${tokenDto} 213`)
        const refreshToken = this.jwtService.sign(JSON.parse(JSON.stringify(tokenDto)), { 
            secret :this.configService.get('REFRESH_KEY'), 
            expiresIn : this.configService.get('REFRESH_TIME')
        })
        return `Bearer ${refreshToken}`

    }
    


}