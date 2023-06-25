import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Delete, Param } from '@nestjs/common';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard'
import { BoardService } from './board.service';
import { CashbookService } from 'src/Cashlists/cashbook.service';
import { CashDetailEntity } from 'src/Cashlists/entity/cashDetail.entity';

@Controller('api/board')
export class BoardController {
    constructor(
        private readonly boardService : BoardService,
        private readonly cashbookService : CashbookService
    ){}

    @Get('noway')
    async nowayList() {

    }

    @Get('goodjob')
    async goodjobList() {

    }

    @UseGuards(AccessAuthenticationGuard)
    @Post(':cashbookId')
    async boardInput(@Param() cashbookId : number, @Body() boardText : string) {
        const detail = this.cashbookService.getDetailByCashbookId(cashbookId)
    }

    @Get(':boardId')
    async boardDetail() {

    }

    @Delete(':boardId')
    @UseGuards(AccessAuthenticationGuard)
    async boardDelete() {
        
    }
}