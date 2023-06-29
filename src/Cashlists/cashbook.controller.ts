import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Delete, Param, Put} from '@nestjs/common';
import { CashbookService } from './cashbook.service';
import {Cronjob} from 'cron'
import { PostDetailDto } from './dto/postDetail.dto';
import { CashbookEntity } from './entity/cashbook.entity';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard';
import { UserService } from 'src/Users/user.service';

@Controller('api/cashbook')
export class CashbookContoller {
    constructor(
        private readonly cashbookService : CashbookService,
        private readonly userService : UserService
    ){}

    @Get('/main')
    @UseGuards(AccessAuthenticationGuard)
    async mainPage(@Req() req : any) {
        const { user } = req 

        //1. 몇 일 째 되는 날
        const dateValue = this.userService.userSignupDate(user.userId)
        //2. 2주 데이터, 남은 날은 null 처리
        const twoweek = 1;
        //3. 당일 유저 별 총합목표, 총합소비
        const date : string = new Date().toISOString().split('T')[0]
        const nowdate = new Date(date)
        const moneyValue = this.cashbookService.getCashbookByDate(nowdate)
        console.log(moneyValue)
        return `data : {
            ${dateValue},
            ${twoweek},
        }`
    }



    //디폴트는 오늘로
    @Get('/')
    @UseGuards(AccessAuthenticationGuard)
    async cashList(@Query() query) {
        const date : Date = query.date
        const result = this.cashbookService.getCashbookByDate(date)
        return `data : ${result}`
    }

    @Get(':cashbookId')
    async cashDetail(@Param() params : number) {
        const cashbookId = params
        const result = await this.cashbookService.getDetail(cashbookId)
        if(!result) {

            throw new Error('정상적으로 불러올 수 없습니다')
        }
        return `data : ${result}`
    }

    @Post(":cashDetailId")
    async postDetail(@Param() params : CashbookEntity, @Body() body : PostDetailDto) {
        let postDetailDto = new PostDetailDto();
        postDetailDto = {
            cashbookId : params,
            cashDetailText : body.cashDetailText,
            cashDetailValue : body.cashDetailValue
        };
        const result = await this.cashbookService.postDetail(postDetailDto);
        if(!result) {
            throw new Error('정상적으로 입력되지 않았습니다')
        }
        return `입력 성공`
    }

    @Delete(":cashDetailId")
    async deleteDetail(@Param() cashDetailId : number) {
        if(!cashDetailId) {
            throw new Error('정상적으로 요청되지 않았습니다')
        }

        await this.deleteDetail(cashDetailId)

        return `삭제 성공`
    }
    
}