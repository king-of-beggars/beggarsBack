import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto'
import { TokenDto } from './dto/token.dto'
import { UserService } from './user.service';
import { AuthService } from './auth.service'
import { UserEntity } from './user.entity'
import { LocalAuthenticationGuard } from './passport/local/local.guard'
import { KakaoAuthenticationGuard } from './passport/kakao/kakao.guard';
import { KakaoStrategy } from './passport/kakao/kakao.strategy';

@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService,
                private readonly authService: AuthService,
                private readonly kakaoStrategy: KakaoStrategy
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
    async userLogin(@Req() req : any) {
            console.log(typeof req)
            const { user } = req
            console.log(user.userId)
            let tokenDto = new TokenDto();
            tokenDto.userId = user.userId
            tokenDto.userName = user.userName
            tokenDto.userNickname = user.userNickname
            const refreshToken = await this.authService.setRefreshToken(tokenDto)
            const accessToken = await this.authService.setAccessToken(tokenDto)
            req.res.setHeader([refreshToken,accessToken])
            return `로그인 완료`
    }

    @Post('logout')
    @HttpCode(200)
    async userLogout() {

    }

    @Get('login/kakao')
    @UseGuards(KakaoAuthenticationGuard)
    @HttpCode(200)
    async kakaoLogin(@Req() req : any, @Query('code') code) {
        return `로그인 완료`
    }
}
