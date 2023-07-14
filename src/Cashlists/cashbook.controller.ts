import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Delete, Param, Put, ConsoleLogger, UseFilters} from '@nestjs/common';
import { CashbookService } from './cashbook.service';
import {Cronjob} from 'cron'
import { PostDetailDto } from './dto/postDetail.dto';
import { Cashbook } from './entity/cashbook.entity';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard';
import { UserService } from 'src/Users/service/user.service';
import { ValueUpdateDto } from './dto/valueUpdate.dto';
import { CashDetail } from './entity/cashDetail.entity';
import { FrameDto } from './dto/frame.dto';
//import * as moment from 'moment-timezone';
const moment = require('moment-timezone')
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GetCategory } from './dto/getCategory.dto';
import { BoardService } from 'src/Boards/board.service';
import { MainPageDto } from './dto/mainPageRes.dto';
import { ByDateResDto } from './dto/byDateRes.dto';
import { DetailResDto } from './dto/detailRes.dto';
import { CashList } from './entity/cashList.entity';
import { GetByCashbookIdDto } from './dto/getByCashbookId.dto';
import { GetByCashDetailIdDto } from './dto/getByCashDetailId.dto';
import { PaginationDto } from 'src/Boards/dto/pagination.dto';
import { QueryDate } from './dto/queryDate.dto';
import { ErrorService, ReadFail } from 'src/Utils/exception.service';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';

@Controller('api/cashbook')
@ApiTags('가계부 관련 API')
export class CashbookContoller {
    constructor(
        private readonly cashbookService : CashbookService,
        private readonly userService : UserService,
        private readonly boardService : BoardService
    ){}

    @Get('/main')
    @HttpCode(200)
    @UseGuards(AccessAuthenticationGuard)
    @ApiResponse({type: MainPageDto, description : 'data 객체 내부에 생성' })
    @ApiOperation({ summary: '메인 api', description: '몇일째 되는 날, 2주치 데이터, 당일 유저 지출 총합, 섹션별 소비' })
    async mainPage(@Req() req : any) {
        try {
            const { user } = req
            let tempdate = moment().tz("Asia/Seoul")
            let nowdate = tempdate.toDate()
            let nowdate2 = new Date()
            nowdate2.setHours(nowdate.getHours() + 9)
            //1. 몇 일 째 되는 날
            const dateValue : number = await this.userService.userSignupDate(user.userId)
            
            //2. 2주 데이터, 남은 날은 null 처리
            const twoweek = await this.cashbookService.getCashbookDuringDate(nowdate,user.userId)
        
            //3. 당일 유저 별, 섹션 별 총합목표, 총합소비
            let query = new QueryDate()
            query = {
                date : nowdate2
            }
            const totalValue : GetCategory[] = await this.cashbookService.getCashbookByDate(query,user.userId)
            
            let total = {
                cashbookNowValue : 0,
                cashbookGoalValue : 0
            } 
            for(let i=0; totalValue.length>i; i++) {
                console.log(totalValue[i].cashbookGoalValue)
                total.cashbookNowValue += totalValue[i].cashbookNowValue
                total.cashbookGoalValue += totalValue[i].cashbookGoalValue
            }

            let mainPageDto = new MainPageDto()
            mainPageDto = {
                signupDay : dateValue,
                twoweek : twoweek,
                groupByCategory : totalValue,
                total : total
            }
            return {
                data : mainPageDto
            }

        } catch(e) {
            console.log(e.stack)
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    @Post('frame')
    @HttpCode(201)
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '프레임 생성', description: '프레임 생성 및 가계부 섹션 오늘치 생성' })
    @ApiBody({type:FrameDto})
    async cashFrameCreate (@Body() body : FrameDto, @Req() req : any) {
        try {
            const { user } = req
            let frameDto = new FrameDto()
            frameDto = {
                cashCategory : body.cashCategory,
                cashName : body.cashName,
                cashListGoalValue : body.cashListGoalValue,
                userId : user.userId
            }
            //이 부분 트랜잭션 해야하는데 어떡하지
            await this.cashbookService.frameCreate(frameDto)
            return {messsage : '프레임 생성이 완료되었습니다'}
        } catch(e) {
            console.log(e.stack)
            throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //카태고리 수정
    //당일 날짜의 cashbook과 cashlist를 수정
    @Put('frame/:cashbookId')
    @HttpCode(200)
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '프레임 수정', description: '프레임 수정 및 캐시북 아이디 값에 맞는 캐시북 수정' })
    @ApiBody({type:FrameDto})
    async cashFrameUpdate(@Param() cashbookId : GetByCashbookIdDto, @Body() body: FrameDto, @Req() req: any) {
      try {
        const { user } = req
        let frameDto = new FrameDto()
        frameDto = {
                cashCategory : body.cashCategory,
                cashName : body.cashName,
                cashListGoalValue : body.cashListGoalValue,
                userId : user.userId
        } 
        await this.cashbookService.frameUpdate(cashbookId, frameDto)
        return '프레임 수정 완료';
    } catch(e) {
        console.log(e.stack)
        throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR)
    }
    }

    //딜리트
    @Delete('frame/:cashbookId')
    @HttpCode(200)
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '프레임 삭제', description: '프레임 삭제 및 부모 row 전부 삭제' })
    async frameDelete(@Param() cashbookId : GetByCashbookIdDto) {
        try {
            await this.cashbookService.frameDelete(cashbookId)
            return '프레임 삭제 완료'
        } catch(e) {

        }
    }   

    //디폴트는 오늘로 전달해주시길 프론트엔드 2023-05-24 형식으로
    @Get('/')
    @UseGuards(AccessAuthenticationGuard)
    @ApiResponse({type:[ByDateResDto], description : 'data 객체 내부에 생성'})
    @ApiOperation({ summary: '특정 날짜 가계부 get', description: '2022-04-05 형식으로 쿼리스트링 하여 request 요구' })
    async cashList(@Query() date : QueryDate, @Req() req : any) {
            const regex = /\d{4}-\d{2}-\d{2}/;
            if(!regex.test(date.toString())) {
                console.log('dfgdfg')
            } 
            const { user } = req
            console.log(date) 
            let result : any = await this.cashbookService.getCashbookByDate(date,user.userId)
            const createCheck = result.map((e)=>{
                return e.cashbookId
            })
            const Checkdate = await this.boardService.BoardCheck(createCheck)
            for(let i=0; result.length>i; i++) {
                result[i].writeCheck = Number(Checkdate[result[i].cashbookId]) || 0
            }
            let byDateResDto : ByDateResDto[]
            byDateResDto = result 
            return {
                data :byDateResDto
            }
        // } catch(e) {
        //     console.log(e.stack)
        //     throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        // }
    }

    @Get(':cashbookId')
    @UseGuards(AccessAuthenticationGuard)
    @ApiResponse({type:DetailResDto, description : 'data 객체 내부에 생성'})
    @ApiOperation({ summary: '특정 카드의 디테일 정보', description: '카드이름, 카드카테고리, 디테일정보// 무지출 consumption : false' })
    async cashDetail(@Param() getByCashbookIdDto : GetByCashbookIdDto) {
        const detail = await this.cashbookService.getDetail(getByCashbookIdDto)
        if(!detail) {
            throw new HttpException('디테일 데이터가 없습니다',HttpStatus.BAD_REQUEST)
        }
        let result2 = await this.cashbookService.cashbookById(getByCashbookIdDto)
        const {cashbookName, cashbookCategory, cashbookNowValue, cashbookGoalValue} = result2
        if(detail.length===0) {
            const result = {}
            cashbookNowValue===0 ? result['consumption'] = true : result['consumption']=false
            let detailResDto = new DetailResDto()
            detailResDto = {
                cashbookGoalValue : cashbookGoalValue,
                cashbookName : cashbookName,
                cashbookCategory : cashbookCategory
            }
            return { data : {
                result,
                detailResDto
            }
            }
        } else {
        const result : DetailResDto = {
            cashbookName,
            cashbookCategory,
            cashbookGoalValue,
            detail
        }
        return {data : {
            result
        }}
    }}
 
    @Post(":cashbookId")
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '디테일 정보 입력', description: 'cashbookId, text, value 입력' })
    @ApiBody({type:PostDetailDto})
    async postDetail(@Param() cashbookId : GetByCashbookIdDto, @Body() body : PostDetailDto) {

        let postDetailDto = new PostDetailDto();
        const cashbook = await this.cashbookService.cashbookById(cashbookId)
        
        postDetailDto = {
            cashbookId : cashbook, 
            cashDetailText : body.cashDetailText,
            cashDetailValue : body.cashDetailValue
        };

        const result = await this.cashbookService.postDetail(postDetailDto);
  
        let valueUpdate = new ValueUpdateDto();
        valueUpdate = {
            cashbookId : cashbook,
            cashDetailValue : body.cashDetailValue
        }
        await this.cashbookService.addValue(valueUpdate)
        if(!result) {
            throw new Error('정상적으로 입력되지 않았습니다')
        }
        return `입력 성공`
    }

    @Delete(":cashDetailId")
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '디테일 삭제', description: '디테일 삭제 API' })
    async deleteDetail(@Param() getByCashDetailId : GetByCashDetailIdDto) {
        if(!getByCashDetailId) {
            throw new Error('정상적으로 요청되지 않았습니다')
        }
        const detail = await this.cashbookService.getOneDetail(getByCashDetailId)
        console.log(detail)
        if(!detail.cashbookId) {
            throw new Error('dfgdfg')
        }
        let valueUpdateDto = new ValueUpdateDto()
        const cashbook = await this.cashbookService.cashbookById(detail.cashbookId)
        console.log(cashbook)
        valueUpdateDto = { 
            cashbookId : cashbook,
            cashDetailValue : -Number(detail.cashDetailValue)
        }

        await this.cashbookService.addValue(valueUpdateDto)
        await this.cashbookService.deleteDetail(getByCashDetailId)

        return `삭제 성공`
    }

    @Put(":cashbookId")
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '무지출 전환 API', description: '무지출 전환시 DB데이터 NULL, 활성화 시 0' })
    async checkConsume(@Param() cashbookId) {
        try {
            await this.cashbookService.inputConsume(cashbookId)
            return '무지출 지출 전환 완료'
        } catch(e) {

        }
    }
    
}