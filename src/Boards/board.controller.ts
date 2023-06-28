import { Controller,Post,Req, Res,Body, HttpCode, UseGuards, Get, Query, Delete, Param } from '@nestjs/common';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard'
import { BoardService } from './board.service';
import { CashbookService } from 'src/Cashlists/cashbook.service';
import { CashDetailEntity } from 'src/Cashlists/entity/cashDetail.entity';
import { PostBoardDto } from './dto/postBoard.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ListBoard } from './dto/listBoard.dto';
import { AuthGuard } from '@nestjs/passport';
import {Response, Request} from 'express'
import { UserService } from 'src/Users/user.service';

@Controller('api/board')
export class BoardController {
    constructor(
        private readonly boardService : BoardService,
        private readonly cashbookService : CashbookService,
        private readonly userService : UserService
    ){}

    @Get('noway')
    async nowayList(@Query() paginationDto : PaginationDto) {
    
        paginationDto.boardTypes = 1
        this.boardService.getListAll(paginationDto)
        .then((result)=>{
            return `data: ${result}`})
        .catch((e)=>{throw new Error('잘못된 요청(페이지,리미트) 입니다')})
    }

    @Get('goodjob')
    async goodjobList(@Query() paginationDto : PaginationDto) {
        paginationDto.boardTypes = 0
        this.boardService.getListAll(paginationDto)
        .then((result)=>{
            return `data: ${result}`})
        .catch((e)=>{throw new Error('잘못된 요청(페이지,리미트) 입니다')})
    }

    @Post(':cashbookId')
    async boardInput(@Param() postBoardDto : PostBoardDto, @Body() body : PostBoardDto) {

        let boardTypes : number;
        let message : string;
        let point;
        const cashbook  = await this.cashbookService.getcashbookAndDetail(postBoardDto.cashbookId)
        cashbook.cashbookNowValue > cashbook.cashbookGoalValue ? boardTypes = 1 : boardTypes = 0
        postBoardDto.boardText = body.boardText
        postBoardDto.userId = cashbook.userId
        postBoardDto.boardTypes = boardTypes
        await this.boardService.postBoard(postBoardDto)

        cashbook.cashbookNowValue > cashbook.cashbookGoalValue ? 
        await this.userService.pointInput(3) :
        await this.userService.pointInput(20)
        
        boardTypes==0 ? message=`자랑하기 등록이 완료됐습니다` : message=`혼나러가기 등록이 완료됐습니다`
        return message;
    }

    @Get(':boardId')
    @UseGuards(AccessAuthenticationGuard)
    async boardDetail(@Param() params : any) {
        //주요정보
        const result = await this.boardService.getBoardDetail(params.boardId)
        console.log(result)
        //디테일
        const detail = await this.boardService.getDetailByBoardId(params.boardId)
        result['cashbookDetail'] = detail
        return `
        data : ${result}
        `
    }

    //@UseGuards(AccessAuthenticationGuard)
    @Delete(':boardId')
    async boardDelete(@Param() params : any) {
        const result = await this.boardService.deleteByboardId(params.boardId)
        if(result) {
            return `삭제에 성공하였습니다`
        } else {
            throw new Error('존재하지 않는 게시글입니다')
        }
        
    }
}