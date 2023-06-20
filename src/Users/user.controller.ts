import { Controller,Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto'
import { TokenDto } from './dto/token.dto'
import { UserService } from './user.service';
import { AuthService } from './auth.service'
import { UserEntity } from './user.entity'
import { LocalAuthenticationGuard } from './passport/local/local.guard'


@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService,
                private readonly authService: AuthService
        ) {}

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
            const byName = await this.userService.userByName(body.userName)
            if(!byName) {
                return '사용 가능한 아이디 입니다'
            }

            throw new Error('중복된 아이디입니다')

        } catch(err) {
            throw new Error('예상치 못한 오류')
        }
    }

    @Post('nickCheck')
    @HttpCode(200)
    async userNickCheck(@Body() body : UserEntity)  {
        try {
            const byNickname = await this.userService.userByNickname(body.userNickname)
            if(!byNickname) {
                return '사용 가능한 닉네임입니다'
            }

            throw new Error('중복된 닉네임입니다')      

        } catch(err) {
            throw new Error('예상치 못한 오류')
        }
    }

    
    @Post('login')
    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    async userLogin(@Body() body : UserEntity) {

            if(!body.userName || !body.userPwd) {
                throw new Error('아이디나 비번이 없다')
            }
            //아이디 확인
            const byName : UserEntity = await this.userService.userByName(body.userName)
            .catch(e=>{throw new Error('아이디가 DB에 없습니다')})

            //DB 데이터 확인
            const pwdCheck = await this.authService.userPwdCheck(body.userPwd,byName.userPwd)

            if(!pwdCheck) {
                throw new Error('비밀번호가 일치하지 않습니다')
            }
            let tokenDto = new TokenDto();
            tokenDto.userId = byName.userId
            tokenDto.userName = byName.userName
            tokenDto.userNickname = byName.userNickname
            const refreshToken = await this.authService.setRefreshToken(tokenDto)
            const accessToken = await this.authService.setAccessToken(tokenDto)
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
