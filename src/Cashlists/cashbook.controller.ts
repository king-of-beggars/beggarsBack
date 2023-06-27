import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Delete, Param, Put} from '@nestjs/common';
import { CashbookService } from './cashbook.service';
import {Cronjob} from 'cron'

@Controller('api/cashbook')
export class CashbookContoller {
    constructor(
        private readonly cashbookService : CashbookService
    ){}


    //디폴트는 오늘로
    @Get('/')
    cashList(@Query() query) {
        
    }

    @Get(':cashbookId')
    cashDetail() {

    }

    @Put(":cashbookDetailId")
    putDetail() {

    }
    
}