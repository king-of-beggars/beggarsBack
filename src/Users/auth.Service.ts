import { InjectRepository } from '@nestjs/typeorm';
import { Injectable ,Body} from '@nestjs/common'
import UserEntity  from './user.entity'
import {Repository, In} from 'typeorm'
import { SignupDto } from './dto/signup.dto'
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
        
    ){}
    

    async userLogin(@Body() body : SignupDto) {
        
    }
    
    async kakaoLogin() {

    }

    async naverLogin() {
        
    }



}