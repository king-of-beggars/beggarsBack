import { InjectRepository } from '@nestjs/typeorm';
import { Injectable} from '@nestjs/common'
import UserEntity  from './user.entity'
import {Repository, In} from 'typeorm'
import { SignupDto } from './dto/signup.dto'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>

        
    ){}

    //회원가입 서비스
    async userSignup(SignupDto : SignupDto) {

            if(!SignupDto.userPwd) {
                throw new Error('비밀번호가 넘어오지 않음')
            }
            SignupDto.userPwd = await bcrypt.hash(SignupDto.userPwd,12)
            const query = this.userRepository.create(
                SignupDto
            )
            await this.userRepository.save(query)
            return query
        
    }

    //유저아이디 중복체크
    async userIdCheck(userName : string) {
        if(!userName) {
            throw new Error('아이디가 넘어오지 않음')
        }
        const query = this.userRepository.findOne({
            where:{userName}
        })
        if(query===null) {
            return query
        }
        throw new Error('이미 아이디가 있다') 
    }

    //유저닉네임 중복체크
    async userNickCheck(userNickname: string) {
        if(!userNickname) {
            throw new Error('닉네임이 넘어오지 않음')
        }
        const query = await this.userRepository.findOne({
          where: {userNickname}
        }) 
        if(query===null) {
            return query
        }
        throw new Error('이미 닉네임이 있다')      
    }

    


}
