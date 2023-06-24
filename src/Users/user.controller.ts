import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto'
import { TokenDto } from './dto/token.dto'
import { UserService } from './user.service';
import { AuthService } from './oauth2.service'
import { UserEntity } from './user.entity'
import { LocalAuthenticationGuard } from './passport/local/local.guard'
import { KakaoAuthenticationGuard } from './passport/kakao/kakao.guard';
import { KakaoStrategy } from './passport/kakao/kakao.strategy';
import { SocialSignupDto } from './dto/socialSignup.dto'

@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService,
                private readonly authService: AuthService
        ) {}

    @Post('signup')
    @HttpCode(201)
    async userSignup(@Body() SignupDto : SignupDto, @Req() req) {
        try {
            const userInfo = await this.userService.userSignup(SignupDto)
            let tokenDto = new TokenDto();
            tokenDto.userId = userInfo.userId
            tokenDto.userName = userInfo.userId
            tokenDto.userNickname = userInfo.userNickname
            const refreshToken = await this.authService.setRefreshToken(tokenDto)
            const accessToken = await this.authService.setAccessToken(tokenDto)
            req.res.setHeader('refreshToken', refreshToken)
            req.res.setHeader('accessToken', accessToken)
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
            throw new Error(err)
        }
    }

    
    @Post('login')
    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    async userLogin(@Req() req : any) {
            const { user } = req
            let tokenDto = new TokenDto();
            tokenDto.userId = user.userId
            tokenDto.userName = user.userName
            tokenDto.userNickname = user.userNickname
            const refreshToken = await this.authService.setRefreshToken(tokenDto)
            const accessToken = await this.authService.setAccessToken(tokenDto)
            req.res.setHeader('refreshToken', refreshToken)
            req.res.setHeader('accessToken', accessToken)
            return `로그인 완료`
    }

    @Post('logout')
    @HttpCode(200)
    async userLogout() {
        return `로그아웃`
    }

    @Get('login/kakao')
    @UseGuards(KakaoAuthenticationGuard)
    @HttpCode(200)
    async kakaoLogin(@Query() code, @Req() req : any) {
        const { user } = req
        let tokenDto = new TokenDto();
        tokenDto.userId = user.userId
        tokenDto.userName = user.userName
        tokenDto.userNickname = user.userNickname
        if(!tokenDto.userId) {
            req.res.setHeader('loginSuccess',false)
            req.res.setHeader('userName',tokenDto.userName)
            console.log(req.res)
            return '회원가입을 하세요'
        }
        const refreshToken = await this.authService.setRefreshToken(tokenDto)
        const accessToken = await this.authService.setAccessToken(tokenDto)
        req.res.setHeader('refreshToken', refreshToken)
        req.res.setHeader('accessToken', accessToken)
        return `로그인 완료`
    }

    @Post('signup/social')
    @HttpCode(201)
    async signupSocial(@Body() SignupDto : SocialSignupDto, @Req() req) {
        try {
            const nickCheck = await this.userService.userByNickname(SignupDto.userNickname)
            console.log(nickCheck)
            if(nickCheck) {
                throw new Error('다른 닉네임을 지정해주세요')
            }
            SignupDto.userLoginType = 'kakao'
            SignupDto.userType = 1
            const userInfo = await this.userService.socialSignup(SignupDto)
            let tokenDto = new TokenDto();
            tokenDto.userId = userInfo.userId
            tokenDto.userName = userInfo.userId
            tokenDto.userNickname = userInfo.userNickname

            const refreshToken = await this.authService.setRefreshToken(tokenDto)
            const accessToken = await this.authService.setAccessToken(tokenDto)
            req.res.setHeader('refreshToken', refreshToken)
            req.res.setHeader('accessToken', accessToken)
            return '회원가입이 완료됐습니다'
        } catch(err) {
            throw new Error(err);
        }
    }

}
