import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Redirect, PayloadTooLargeException, Res } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto'
import { TokenDto } from './dto/token.dto'
import { UserService } from './user.service';
import { AuthService } from './oauth2.service'
import { UserEntity } from './user.entity'
import { LocalAuthenticationGuard } from './passport/local/local.guard'
import { KakaoAuthenticationGuard } from './passport/kakao/kakao.guard';
import { KakaoStrategy } from './passport/kakao/kakao.strategy';
import { SocialSignupDto } from './dto/socialSignup.dto'
import * as bcrypt from 'bcrypt';
import {Response} from 'express'
import {HttpStatus} from 'httpstatus'

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
    async userNickCheck(@Req() req, @Body() body : UserEntity)  {

        try {
            console.log(req)
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
    async userLogin(@Req() req : any, @Res() res : Response) {
            const { user } = req
            let tokenDto = new TokenDto();
            tokenDto.userId = user.userId
            tokenDto.userName = user.userName
            tokenDto.userNickname = user.userNickname
            const refreshToken = await this.authService.setRefreshToken(tokenDto)
            const accessToken = await this.authService.setAccessToken(tokenDto)
            await res.cookie('accessToken', accessToken, {
                host:'http://localhost:3000/',
                sameSite : 'none',
                secure : 'true',
                httpOnly : 'false'
            })
            await res.setHeader('user', user, {
                host:'http://localhost:3000',
                sameSite : 'none',
                secure : 'true',
                httpOnly : 'false'
            })
            // await req.res.cookie('refreshToken', refreshToken, {
            //     //host:'https://beggars-front.vercel.app',
            //     host:'http://localhost:3000',
            //     sameSite : 'none',
            //     secure : 'true', 
            //     httpOnly : 'false'
            // })
            return res.redirect('http://localhost:3000')
    }

    @Post('logout')
    @HttpCode(200)
    async userLogout(@Res() res : any) {
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        return `로그아웃 완료`
    }

    @Get('login/kakao')
    @UseGuards(KakaoAuthenticationGuard)
    @HttpCode(200)
    async kakaoLogin(@Query() code, @Req() req : any, @Res() res: any) {
        const { user } = req
        if(!user.userName) {
            throw new Error('잘못된 접근입니다')
        }
        if(!user.userId) {
            const loginSuccess = false
            //await req.res.setHeader('loginSuccess',false)
            //await req.res.setHeader('userName',user)
            const userName = await bcrypt.hash(user.userName,12)
            //await req.res.setHeader('Set-Cookie', ['mycookie=hello; Samesite=none; domain=http://localhost:3000'])
            console.log('로그인')
            return res.redirect(`https://beggars-front.vercel.app?loginSuccess=${loginSuccess}&uid=${userName}`)
        }
        
        const refreshToken = await this.authService.setRefreshToken(user)
        const accessToken = await this.authService.setAccessToken(user)
        await res.cookie('acceessToken', accessToken, {
            host:'https://beggars-front.vercel.app',
            sameSite : 'none',
            secure : 'true',
            httpOnly : 'false'
        })
        await res.cookie('refreshToken', refreshToken, {
            host:'https://beggars-front.vercel.app',
            sameSite : 'none',
            secure : 'true',
            httpOnly : 'false'
        })

        //req.res.setHeader('refreshToken', refreshToken)
        //req.res.setHeader('accessToken', accessToken)
        
        const userInfo = await bcrypt.hash(user,12)

        return res.redirect(`https://beggars-front.vercel.app?info=${userInfo}`)
    }

    @Post('signup/social')
    @HttpCode(201)
    async signupSocial(@Body() SignupDto : SocialSignupDto, @Req() req, @Res() res : any) {
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
            await res.cookie('acceessToken', accessToken, {
                host:'https://beggars-front.vercel.app',
                sameSite : 'none',
                secure : 'true',
                httpOnly : 'false'
            })
            await res.cookie('refreshToken', refreshToken, {
                host:'https://beggars-front.vercel.app',
                sameSite : 'none',
                secure : 'true',
                httpOnly : 'false'
            })
            return res.redirect(`https://beggars-front.vercel.app?info=${userInfo}`)
        } catch(err) {
            throw new Error(err);
        }
    }


    async setCookie(refreshToken : unknown, accessToken : unknown) {

    }

    async getCookie() {

    }


}
