import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Delete, Param, Put} from '@nestjs/common';
import { CashbookService } from './cashbook.service';
import {Cronjob} from 'cron'
import { PostDetailDto } from './dto/postDetail.dto';
import { CashbookEntity } from './entity/cashbook.entity';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard';
import { UserService } from 'src/Users/user.service';
import { ValueUpdateDto } from './dto/valueUpdate.dto';
import { CashDetailEntity } from './entity/cashDetail.entity';

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
        const date : string = new Date().toISOString().split('T')[0]
        const nowdate : Date = new Date(date)
        //1. 몇 일 째 되는 날
        const dateValue : number = await this.userService.userSignupDate(user.userId)
        //2. 2주 데이터, 남은 날은 null 처리
        const twoweek = this.cashbookService.getCashbookDuringDate(nowdate,user.userId)
        //3. 당일 유저 별 총합목표, 총합소비
        const moneyValue = await this.cashbookService.getCashbookByDate(nowdate,user.userId)
        console.log(moneyValue)
        return `data : {
            ${dateValue},
            ${twoweek},
        }`
    }



    //디폴트는 오늘로
    @Get('/')
    @UseGuards(AccessAuthenticationGuard)
    async cashList(@Query() query, @Req() req : any) {
        const { user } = req
        const date : Date = query.date
        const result = this.cashbookService.getCashbookByDate(date,user.userId)
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

        let valueUpdateDto = new ValueUpdateDto()
        valueUpdateDto = {
            cashbookId : params,
            cashDetailValue : body.cashDetailValue
        }
        const result = await this.cashbookService.postDetail(postDetailDto);
        await this.cashbookService.addValue(valueUpdateDto)
        if(!result) {
            throw new Error('정상적으로 입력되지 않았습니다')
        }
        return `입력 성공`
    }

    @Delete(":cashDetailId")
    @UseGuards(AccessAuthenticationGuard)
    async deleteDetail(@Param() cashDetailId : CashDetailEntity, @Req() req : any) {
        const { user } = req
        if(!cashDetailId) {
            throw new Error('정상적으로 요청되지 않았습니다')
        }
        const detail = await this.cashbookService.getOneDetail(cashDetailId)
        let valueUpdateDto = new ValueUpdateDto()
        valueUpdateDto = {
            cashbookId : detail.cashbookId,
            cashDetailValue : -Number(detail.cashDetailValue)
        }

        await this.cashbookService.addValue(valueUpdateDto)
        await this.cashbookService.deleteDetail(cashDetailId)

        return `삭제 성공`
    }
    
}