import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard';
import { BoardService } from './board.service';
import { CashbookService } from 'src/Cashlists/cashbook.service';
import { CashDetail } from 'src/Cashlists/entity/cashDetail.entity';
import { PostBoardDto } from './dto/postBoard.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ListBoard } from './dto/listBoard.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { UserService } from 'src/Users/service/user.service';
import { CommentService } from 'src/Comments/comment.service';
import { AuthService } from 'src/Users/service/oauth2.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ApiQuery,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { BoardResDto } from './dto/boardRes.dto';
import { BoardDetailDTO } from './dto/boardDetail.dto';
import { BoardDetailResDto } from './dto/boarDetailRes.dto';
import { GetByCashbookIdDto } from 'src/Cashlists/dto/getByCashbookId.dto';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import { GetByBoardIdDto } from './dto/getByBoardId.dto';

@Controller('api/board')
@ApiTags('게시물 API')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly cashbookService: CashbookService,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get('noway')
  @ApiResponse({
    status: 200,
    type: [BoardResDto],
    description: '혼나러가기 게시물 목록',
  })
  async nowayList(@Query() paginationDto: PaginationDto) {
    paginationDto.boardTypes = 1;
    const result: BoardResDto[] = await this.boardService.getListAll(
      paginationDto,
    );
    return {
      data: result,
    };
  }

  @Get('goodjob')
  @ApiResponse({
    status: 200,
    type: [BoardResDto],
    description: '자랑하기 게시물 정보',
  })
  async goodjobList(@Query() paginationDto: PaginationDto) {
    paginationDto.boardTypes = 0;
    const result: BoardResDto[] = await this.boardService.getListAll(
      paginationDto,
    );
    return {
      data: result,
    };
  }

  //NAME 추가
  @Post(':cashbookId')
  @UseGuards(AccessAuthenticationGuard)
  @ApiBody({
    type: PostBoardDto,
  })
  @ApiResponse({
    status: 201,
    type: String,
    description:
      '자랑하기 등록이 완료됐습니다 || 혼나러가기 등록이 완료됐습니다',
  })
  async boardInput(
    @Param() getByCashbookIdDto: GetByCashbookIdDto,
    @Body() postBoardDto: PostBoardDto,
    @Req() req: any,
  ) {
    try {
      let boardTypes: number;
      let message: string;
      let { user } = req;
      const cashbook = await this.cashbookService.getcashbookAndDetail(
        getByCashbookIdDto,
      );
      console.log(cashbook);
      cashbook.cashbookNowValue > cashbook.cashbookGoalValue
        ? (boardTypes = 1)
        : (boardTypes = 0);
      postBoardDto.userId = user.userId;
      postBoardDto.boardTypes = boardTypes;
      postBoardDto.cashbookId = cashbook;
      await this.boardService.postBoard(postBoardDto);
      cashbook.cashbookNowValue > cashbook.cashbookGoalValue
        ? await this.userService.pointInput(user.userId, 3)
        : await this.userService.pointInput(user.userId, 20);
      boardTypes == 0
        ? (message = `자랑하기 등록이 완료됐습니다`)
        : (message = `혼나러가기 등록이 완료됐습니다`);
      return { message };
    } catch (e) {
      throw new Error(e);
    }
  }

  @ApiResponse({
    type: BoardDetailResDto,
  })
  @Get('detail/:boardId')
  async boardDetail(
    @Param() getByBoardIdDto: GetByBoardIdDto,
    @Req() req: Request,
  ) {
    let result: any = await this.boardService.getBoardDetail(getByBoardIdDto);
    let token = req.headers.cookie;
    if (token) {
      token = token.split(';')[1];
      token = token.split('=')[1];
    }

    //commentId 배열에 저장
    console.log(result);
    let likeCheck = {};
    //댓글이 있을 경우
    if (result.comments.length > 0) {
      const like = result.comments.map((comment) => comment.commentId);
      //토큰에서 유저정보 추출
      //좋아요 개수
      const likeList = await this.commentService.getLikeList(like);

      if (token) {
        const user = this.jwtService.verify(token, {
          secret: this.configService.get('SECRET_KEY'),
        });
        user
          ? (likeCheck = await this.commentService.getLikeCheck(
              like,
              user.userId,
            ))
          : {};
      }

      for (let i = 0; result.comments.length > i; i++) {
        result.comments[i].likeCount =
          Number(likeList[result.comments[i].commentId]) || 0;
        result.comments[i].likeCheck =
          likeCheck[result.comments[i].commentId] || 0;
      }
    }
    const detail = await this.boardService.getDetailByBoardId(getByBoardIdDto);
    result['cashbookDetail'] = detail;
    return {
      data: result,
    };
  }

  @ApiResponse({ type: String })
  @Delete(':boardId')
  @UseGuards(AccessAuthenticationGuard)
  async boardDelete(@Param() GetByBoardIdDto: GetByBoardIdDto) {
    const result = await this.boardService.deleteByboardId(
      GetByBoardIdDto.boardId,
    );
    if (result) {
      return `삭제에 성공하였습니다`;
    } else {
      throw new Error('존재하지 않는 게시글입니다');
    }
  }
}
