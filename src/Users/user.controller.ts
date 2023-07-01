import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Redirect, PayloadTooLargeException, Res } from '@nestjs/common';
import { SignupDto} from './dto/signup.dto'
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
import { AccessAuthenticationGuard } from './passport/jwt/access.guard';

@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService,
                private readonly authService: AuthService
        ) {}
    

    @Post('signup')
    @HttpCode(201)
    async userSignup(@Body() SignupDto : SignupDto, @Req() req, @Res() res : Response) {
        try {
            const user = await this.userService.userSignup(SignupDto)
            let tokenDto = new TokenDto();
            tokenDto.userId = user.userId
            tokenDto.userName = user.userName
            tokenDto.userNickname = user.userNickname
            const refreshToken = await this.authService.setRefreshToken(tokenDto)
            const accessToken = await this.authService.setAccessToken(tokenDto)
            res.cookie('refreshToken', refreshToken, {
                host:'https://beggars-front.vercel.app',
                sameSite : 'none',
                secure : 'true',
                httpOnly : 'false'
            })

            res.cookie('accessToken', accessToken, {
                host:'https://beggars-front.vercel.app',
                sameSite : 'none',
                secure : 'true',
                httpOnly : 'false'
            })
            res.setHeader('userId', user.userId)
            
            const nickname : string = await this.userService.encodeNick(user.userNickname)
            res.setHeader('userNickname', nickname)
            res.send('회원가입이 완료되었습니다')
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
            res.cookie('refreshToken', refreshToken, {
                domain:'https://beggars-front.vercel.app',
                sameSite : 'none',
                secure : 'true',
                httpOnly : 'False',
                path : '/'
            })

            res.cookie('accessToken', accessToken, {
                domain:'https://beggars-front.vercel.app',
                sameSite : 'none',
                secure : 'true',
                httpOnly : 'False',
                path : '/'
            })
            res.setHeader('userId', user.userId)
            
            const nickname : string = await this.userService.encodeNick(user.userNickname)
            res.setHeader('userNickname', nickname)
            //return res.redirect('http://localhost:3000')
            res.send('완료')
    }

    @Post('logout')
    @HttpCode(200)
    @UseGuards(AccessAuthenticationGuard)
    async userLogout(@Req() req : any ,@Res() res : Response) {
        const { user } = req
        console.log('#############',user)
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@')
        console.log(req)
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        return `로그아웃 완료`
    }

    @Get('login/kakao')
    @UseGuards(KakaoAuthenticationGuard)
    @HttpCode(200)
    async kakaoLogin(@Query() code, @Req() req : any, @Res() res: Response) {
        const { user } = req
        console.log(user)
        if(!user) {
            throw new Error('잘못된 접근입니다')
        }
        if(!user.userId) {
            const loginSuccess = false
            //await req.res.setHeader('loginSuccess',false)
            //await req.res.setHeader('userName',user)
            res.cookie('userName', user, {
                host:'https://beggars-front.vercel.app',
                sameSite : 'none',
                secure : 'true',
                httpOnly : 'false'
            })

            res.setHeader('Set-Cookie',`userName=${user}; Path=/; host=https://beggars-front.vercel.app; sameSite=None; secure=true; httpOnly=false;`)
            return res.redirect(`https://beggars-front.vercel.app?loginSuccess=false`)
        }
        
        const refreshToken = await this.authService.setRefreshToken(user)
        const accessToken = await this.authService.setAccessToken(user)
        res.cookie('refreshToken', refreshToken, {
            host:'https://beggars-front.vercel.app',
            sameSite : 'none',
            secure : 'true',
            httpOnly : 'false'
        })

        res.cookie('accessToken', accessToken, {
            host:'https://beggars-front.vercel.app',
            sameSite : 'none',
            secure : 'true',
            httpOnly : 'false'
        })
        res.setHeader('userId', user.userId)
        
        const nickname : string = await this.userService.encodeNick(user.userNickname)
        res.setHeader('userNickname', nickname)
        
        return res.redirect(`https://beggars-front.vercel.app`)
    }

    @Post('signup/social')
    @HttpCode(201)
    async signupSocial(@Body() body : any, @Req() req, @Res() res : Response) {
        console.log('#######',req)
        console.log('#######',res)
        try {
            const nickCheck = await this.userService.userByNickname(body.userNickname)
            console.log(nickCheck)
            if(nickCheck) {
                throw new Error('다른 닉네임을 지정해주세요')
            }
            let SignupDto : SocialSignupDto

            SignupDto = {
                userName : 'asdasd',
                userNickname : body.userNickname,
                userLoginType : 'kakao',
                userType : 1
            }

            const user = await this.userService.socialSignup(SignupDto)
            let tokenDto = new TokenDto();
            tokenDto.userId = user.userId
            tokenDto.userName = user.userName
            tokenDto.userNickname = user.userNickname

            const refreshToken = await this.authService.setRefreshToken(tokenDto)
            const accessToken = await this.authService.setAccessToken(tokenDto)
            res.cookie('refreshToken', refreshToken, {
                host:'https://beggars-front.vercel.app',
                sameSite : 'none',
                secure : 'true',
                httpOnly : 'false'
            })

            res.cookie('accessToken', accessToken, {
                host:'https://beggars-front.vercel.app',
                sameSite : 'none',
                secure : 'true',
                httpOnly : 'false'
            })
            res.setHeader('userId', user.userId)
            
            const nickname : string = await this.userService.encodeNick(user.userNickname)
            res.setHeader('userNickname', nickname)
            return res.redirect(`https://beggars-front.vercel.app`)
        } catch(err) {
            throw new Error(err);
        }
    }


}
