import { Controller,Post,Req, Res,Body, HttpCode, UseGuards, Get, Query, Delete, Param } from '@nestjs/common';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard'
import { BoardService } from './board.service';
import { CashbookService } from 'src/Cashlists/cashbook.service';
import { CashDetail } from 'src/Cashlists/entity/cashDetail.entity';
import { PostBoardDto } from './dto/postBoard.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ListBoard } from './dto/listBoard.dto';
import { AuthGuard } from '@nestjs/passport';
import {Response, Request} from 'express'
import { UserService } from 'src/Users/user.service';
import { CommentService } from 'src/Comments/comment.service';
import { AuthService } from 'src/Users/oauth2.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('api/board')
export class BoardController {
    constructor(
        private readonly boardService : BoardService,
        private readonly cashbookService : CashbookService,
        private readonly userService : UserService,
        private readonly commentService : CommentService,
        private readonly jwtService : JwtService,
        private readonly configService : ConfigService
    ){}

    @Get('noway')
    async nowayList(@Query() paginationDto : PaginationDto) {
    
        paginationDto.boardTypes = 1
        const result = this.boardService.getListAll(paginationDto)
        return result
    }

    @Get('goodjob')
    async goodjobList(@Query() paginationDto : PaginationDto) {
        paginationDto.boardTypes = 0
        const result = await this.boardService.getListAll(paginationDto)
        return result
    }

    @Post(':cashbookId')
    @UseGuards(AccessAuthenticationGuard)
    async boardInput(@Param() postBoardDto : PostBoardDto, @Body() body : PostBoardDto) {

        let boardTypes : number;
        let message : string;
        const cashbook  = await this.cashbookService.getcashbookAndDetail(Number(postBoardDto.cashbookId))
        cashbook.cashbookNowValue > cashbook.cashbookGoalValue ? boardTypes = 1 : boardTypes = 0
        postBoardDto.boardText = body.boardText
        postBoardDto.userId = cashbook.userId
        postBoardDto.boardTypes = boardTypes
        await this.boardService.postBoard(postBoardDto)

        cashbook.cashbookNowValue > cashbook.cashbookGoalValue ? 
        await this.userService.pointInput(3,Number(cashbook.userId)) :
        await this.userService.pointInput(20,Number(cashbook.userId))
        
        boardTypes==0 ? message=`자랑하기 등록이 완료됐습니다` : message=`혼나러가기 등록이 완료됐습니다`
        return message;
    }

    @Get('detail/:boardId')
    async boardDetail(@Param() params : any, @Req() req : Request) {
        let token = req.headers['set-cookie'][0]
        if(token) {
            token = token.split(',')[1]
            token = token.split('=')[1]
            token = token.split(' ')[0]
            token = token.replace(';','')
        } 
        console.log(token)
        const user = this.jwtService.verify(token,{secret : this.configService.get('SECRET_KEY')})
        

        const result : any = await this.boardService.getBoardDetail(params.boardId)
        const like = result.comments.map(comment => comment.commentId)
        const likeList = await this.commentService.getLikeList(like)
        console.log(likeList)
        let likeCheck = {}
        
        user ? likeCheck = await this.commentService.getLikeCheck(like,user.userId) : {}
        console.log(likeCheck)
        for(let i=0; result.comments.length>i; i++) {
            result.comments[i].likeCount = Number(likeList[result.comments[i].commentId]) || 0
            result.comments[i].likeCheck = likeCheck[result.comments[i].commentId] || 0
        }

        const detail = await this.boardService.getDetailByBoardId(params.boardId)
        result['cashbookDetail'] = detail
        return result
    }

    
    @Delete(':boardId')
    @UseGuards(AccessAuthenticationGuard)
    async boardDelete(@Param() params : any) {
        const result = await this.boardService.deleteByboardId(params.boardId)
        if(result) {
            return `삭제에 성공하였습니다`
        } else {
            throw new Error('존재하지 않는 게시글입니다')
        }
        
    }
}