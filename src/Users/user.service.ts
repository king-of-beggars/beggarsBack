import { InjectRepository } from '@nestjs/typeorm';
import { Injectable} from '@nestjs/common'
import UserEntity  from './user.entity'
import {Repository, In} from 'typeorm'
import { SignupDto } from './dto/signup.dto'
import * as bcrypt from 'bcrypt';
import { SocialSignupDto } from './dto/socialSignup.dto'
import TokenDto from './dto/token.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>

        
    ){}

    //회원가입 서비스
    async userSignup(SignupDto : SignupDto) : Promise<any> {

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

    //소셜 회원가입 서비스
    async socialSignup(SignupDto : SocialSignupDto) : Promise<any> {

        const query = this.userRepository.create(
            SignupDto
        )
        await this.userRepository.save(query)
        return query
    
}

    //유저아이디로 db체크
    async userByName(userName : string) : Promise<UserEntity> {
        if(!userName) {
            throw new Error('아이디가 넘어오지 않음')
        }
        const query = await this.userRepository
                     .createQueryBuilder('user')
                     .select(['user.userId','user.userName','user.userNickname'])
                     .where('user.userName=:userName', {userName})
                     .getOne()
        console.log(query)
        return query;
    }

    //유저닉네임으로 db체크
    async userByNickname(userNickname: string) : Promise<UserEntity> {
        if(!userNickname) {
            throw new Error('닉네임이 넘어오지 않음')
        }
        console.log(userNickname)
        const query = this.userRepository.findOne({
          where: {userNickname}
        }) 

         return query 
        
    }

    async pointCheck(userId:number) {
        const result = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.userPoint'])
        .where('user.userId = :userId', {userId})
        .getOne()
        return Number(result.userPoint)
    }

    async pointInput(point : number) {
        const userId = 1
        let userPoint : number = await this.pointCheck(userId)
        console.log(userPoint)
        userPoint = userPoint + point
        console.log(userPoint)
        return await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({userPoint:userPoint})
        .where('userId = :userId',{userId})
        .execute()
    }

    async encodeNick(nickname:string) {
        return encodeURIComponent(nickname)
    }

    async userSignupDate(userId : UserEntity) {
        const now : string = new Date().toISOString().split('T')[0]
        const nowdate = new Date(now)    
        let date = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.userCreatedAt'])
        .where('user.userId=:userId',{userId})
        .getOne()
        const tempdate : string = new Date(date.userCreatedAt).toISOString().split('T')[0]
        const signupdate : Date = new Date(tempdate)
        const diffDate = nowdate.getTime() - signupdate.getTime()
        return Math.abs(diffDate / (1000*60*60*24))

    }

}
