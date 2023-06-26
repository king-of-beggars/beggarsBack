import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Delete, Param } from '@nestjs/common';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard'
import { BoardService } from './board.service';
import { CashbookService } from 'src/Cashlists/cashbook.service';
import { CashDetailEntity } from 'src/Cashlists/entity/cashDetail.entity';
import { PostBoardDto } from './dto/postBoard.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ListBoard } from './dto/listBoard.dto';

@Controller('api/board')
export class BoardController {
    constructor(
        private readonly boardService : BoardService,
        private readonly cashbookService : CashbookService,
    ){}

    @Get('noway')
    async nowayList(@Query() paginationDto : PaginationDto) {
        paginationDto.boardTypes = 1
        this.boardService.getListAll(paginationDto)
        .then((result)=>{
            return result})
        .catch((e)=>{throw new Error('잘못된 요청(페이지,리미트) 입니다')})
    }

    @Get('goodjob')
    async goodjobList(@Query() paginationDto : PaginationDto) {
        paginationDto.boardTypes = 0
        this.boardService.getListAll(paginationDto)
        .then((result)=>{
            return result})
        .catch((e)=>{throw new Error('잘못된 요청(페이지,리미트) 입니다')})
    }

    //@UseGuards(AccessAuthenticationGuard)
    @Post(':cashbookId')
    async boardInput(@Param() postBoardDto : PostBoardDto, @Body() body : PostBoardDto) {

        let boardTypes : number;
        let message : string;

        const cashbook  = await this.cashbookService.getcashbookAndDetail(postBoardDto.cashbookId)
        cashbook.cashbookNowValue > cashbook.cashbookGoalValue ? boardTypes = 1 : boardTypes = 0
        postBoardDto.boardText = body.boardText
        postBoardDto.userId = cashbook.userId
        postBoardDto.boardTypes = boardTypes

        await this.boardService.postBoard(postBoardDto)
        boardTypes==0 ? message=`자랑하기 등록이 완료됐습니다` : message=`혼나러가기 등록이 완료됐습니다`
        return message;
    }

    @Get(':boardId')
    async boardDetail(@Param() params : any) {
        const result = await this.boardService.getBoardDetail(params.boardId)
        const detail = await this.boardService.getDetailByBoardId(params.boardId)
        console.log(result)
        console.log(detail)
    }

    //@UseGuards(AccessAuthenticationGuard)
    @Delete(':boardId')
    async boardDelete() {
        
    }
}