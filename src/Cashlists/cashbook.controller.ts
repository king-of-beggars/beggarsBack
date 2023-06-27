import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Delete, Param, Put} from '@nestjs/common';
import { CashbookService } from './cashbook.service';
import {Cronjob} from 'cron'
import { PostDetailDto } from './dto/postDetail.dto';
import { CashbookEntity } from './entity/cashbook.entity';

@Controller('api/cashbook')
export class CashbookContoller {
    constructor(
        private readonly cashbookService : CashbookService
    ){}


    //디폴트는 오늘로
    @Get('/')
    async cashList(@Query() query) {
        const date = query.date
        
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