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
import { UserService } from 'src/Users/service/user.service';
import { CommentService } from 'src/Comments/comment.service';
import { AuthService } from 'src/Users/service/oauth2.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiQuery, ApiResponse, ApiParam, ApiBody ,ApiTags } from '@nestjs/swagger';
import { BoardResponseDTO } from './dto/boardResponse.dto';
import { BoardDetailDTO } from './dto/boardDetail.dto';
import { BoardDetailReponseDTO } from './dto/boarDetailResponse.dto';

@Controller('api/board')
@ApiTags('게시물 API')
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
    @ApiQuery({
      name: '혼나러가기 페이지 정보',
      required: true,
      type: PaginationDto,
    })
    @ApiResponse({
      status: 200,
      type: BoardResponseDTO,
      description: '혼나러가기 게시물 목록',
    })
    async nowayList(@Query() paginationDto : PaginationDto) {
        paginationDto.boardTypes = 1
        const result = this.boardService.getListAll(paginationDto)
        return {
            data : result
        }
    }

    @Get('goodjob')
    @ApiQuery({
      name: '자랑하기 페이지 정보',
      required: true,
      type: PaginationDto,
    })
    @ApiResponse({
      status: 200,
      type: BoardResponseDTO,
      description: '자랑하기 게시물 정보',
    })
    async goodjobList(@Query() paginationDto : PaginationDto) {
        paginationDto.boardTypes = 0
        const result = await this.boardService.getListAll(paginationDto)
        return {
            data : result
        }
    }

    @Get('detail/:boardId')
    // @ApiParam({
    //   name: '칭찬, 훈수 상세조회',
    //   type: BoardDetailDTO,
    // })
    @ApiResponse({
      type: BoardDetailDTO,
    })
    @Post(':cashbookId')
    @UseGuards(AccessAuthenticationGuard)
    @ApiParam({
      name: '칭찬, 훈수 작성',
      required: true,
      type: PostBoardDto,
    })
    @ApiBody({
      type: PostBoardDto,
    })
    @ApiResponse({
      status: 200,
      type: String,
      description:
        '자랑하기 등록이 완료됐습니다 || 혼나러가기 등록이 완료됐습니다',
    })
    @Post(':cashbookId')
    @UseGuards(AccessAuthenticationGuard)
    async boardInput(@Param() postBoardDto : PostBoardDto, @Body() body : PostBoardDto) {
    try {
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
        return {message};
    } catch(e) {
        throw new Error('에러러')
    }
    }
    @ApiResponse({
      type: BoardDetailReponseDTO,
    })
    @Get('detail/:boardId')
    async boardDetail(@Param() params : any, @Req() req : Request) {
        let token = req.headers.cookie
            if(token) {
                token = token.split(';')[1]
                token = token.split('=')[1]
            } 
        const user = this.jwtService.verify(token,{secret : this.configService.get('SECRET_KEY')})
        

        const result : any = await this.boardService.getBoardDetail(params.boardId)
        const like = result.comments.map(comment => comment.commentId)
        const likeList = await this.commentService.getLikeList(like)
        let likeCheck = {}
        
        user ? likeCheck = await this.commentService.getLikeCheck(like,user.userId) : {}
    
        for(let i=0; result.comments.length>i; i++) {
            result.comments[i].likeCount = Number(likeList[result.comments[i].commentId]) || 0
            result.comments[i].likeCheck = likeCheck[result.comments[i].commentId] || 0
        }

        const detail = await this.boardService.getDetailByBoardId(params.boardId)
        result['cashbookDetail'] = detail
        return {
            data : result
        }
    }


    @ApiResponse({ type: String })
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