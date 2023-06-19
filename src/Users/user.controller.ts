import { Controller,Post, Body, HttpCode } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto'
import { UserService } from './user.service';
import { UserEntity } from './user.entity'
@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    @HttpCode(201)
    async userSignup(@Body() SignupDto : SignupDto) {
        try {
            await this.userService.userSignup(SignupDto)
            return '회원가입이 완료됐습니다'
        } catch(err) {
            throw new Error(err);
        }
    }

    @Post('idCheck')
    @HttpCode(200)
    async userIdCheck(@Body() body : UserEntity) {
        try {
            await this.userService.userIdCheck(body.userName)
            return '사용 가능한 아이디 입니다'

        } catch(err) {
            throw new Error('예상치 못한 오류')
        }
    }

    @Post('nickCheck')
    @HttpCode(200)
    async userNickCheck(@Body() body : UserEntity)  {
        try {
            await this.userService.userNickCheck(body.userNickname)
            return '사용 가능한 닉네임 입니다'
        } catch(err) {
            throw new Error('예상치 못한 오류')
        }
    }

    
    @Post('login')
    @HttpCode(200)
    async userLogin(@Body() body : UserEntity) {
        if(!body.userName || !body.userPwd) {
            throw new Error('아이디나 비번이 없다')
        }
        return 

    }

    @Post('logout')
    @HttpCode(200)
    async userLogout() {

    }

    @Post('login/kakao')
    @HttpCode(200)
    async kakaoLogin() {

    }
}
