import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Delete } from '@nestjs/common';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard'

@Controller('api/board')
export class BoardController {

    @Get('noway')
    async nowayList() {

    }

    @Get('goodjob')
    async goodjobList() {

    }

    @UseGuards(AccessAuthenticationGuard)
    @Post(':cashbookId')
    async boardInput() {

    }

    @Get(':boardId')
    async boardDetail() {

    }

    @Delete(':boardId')
    @UseGuards(AccessAuthenticationGuard)
    async boardDelete() {
        
    }
}