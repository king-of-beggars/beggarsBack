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

    //유저아이디로 db체크
    async userByName(userName : string) {
        if(!userName) {
            throw new Error('아이디가 넘어오지 않음')
        }
        const query = this.userRepository.findOne({
            where:{userName}
        })
        return query
    }

    //유저닉네임으로 db체크
    async userByNickname(userNickname: string) {
        if(!userNickname) {
            throw new Error('닉네임이 넘어오지 않음')
        }

        const query = await this.userRepository.findOne({
          where: {userNickname}
        }) 

         return query
        
    }

    //유저아이디, 패스워드 DB확인
    async userPwdCheck(inputPwd:string, comparePwd:string) {
        if(!inputPwd || !comparePwd) {
            throw new Error('비밀번호가 넘어오지 않음')
        }
        const result = await bcrypt.compare(
            inputPwd, comparePwd
        )
        return result
    }
 


}
