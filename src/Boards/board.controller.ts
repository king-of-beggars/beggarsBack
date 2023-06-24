import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Delete, Param } from '@nestjs/common';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard'
import { BoardService } from './board.service';

@Controller('api/board')
export class BoardController {
    constructor(
        private readonly boardService : BoardService
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
        this.boardService.getByCashlistId(cashbookId)
    }

    @Get(':boardId')
    async boardDetail() {

    }

    @Delete(':boardId')
    @UseGuards(AccessAuthenticationGuard)
    async boardDelete() {
        
    }
}