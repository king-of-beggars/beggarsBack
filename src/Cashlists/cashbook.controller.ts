import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Delete, Param, Put} from '@nestjs/common';
import { CashbookService } from './cashbook.service';
import {Cronjob} from 'cron'
import { PostDetailDto } from './dto/postDetail.dto';
import { Cashbook } from './entity/cashbook.entity';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard';
import { UserService } from 'src/Users/user.service';
import { ValueUpdateDto } from './dto/valueUpdate.dto';
import { CashDetail } from './entity/cashDetail.entity';
import { FrameDto } from './dto/frame.dto';
//import * as moment from 'moment-timezone';
const moment = require('moment-timezone')
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { GetCategory } from './dto/getCategory.dto';

@Controller('api/cashbook')
@ApiTags('가계부 관련 API')
export class CashbookContoller {
    constructor(
        private readonly cashbookService : CashbookService,
        private readonly userService : UserService
    ){}

    @Get('/main')
    @HttpCode(200)
    @UseGuards(AccessAuthenticationGuard)
    @ApiResponse({type:[GetCategory]})
    @ApiOperation({ summary: '메인 api', description: '몇일째 되는 날, 2주치 데이터, 당일 유저 지출 총합, 섹션별 소비' })
    async mainPage(@Req() req : any) {
        const { user } = req
        console.log(user)
        let tempdate = moment().tz("Asia/Seoul")
        console.log(tempdate)
        let nowdate = tempdate.toDate()
        let nowdate2 = new Date()
        nowdate2.setHours(nowdate.getHours() + 9)
        //1. 몇 일 째 되는 날
        const dateValue : number = await this.userService.userSignupDate(user.userId)
        console.log(dateValue)
        //2. 2주 데이터, 남은 날은 null 처리
        const twoweek = await this.cashbookService.getCashbookDuringDate(nowdate,user.userId)
        console.log(twoweek)
        //3. 당일 유저 별, 섹션 별 총합목표, 총합소비
        const totalValue : GetCategory[] = await this.cashbookService.getCashbookByDate(nowdate2,user.userId)
        console.log(nowdate2)
        let total = {
            cashbookNowValue : 0,
            cashbookGoalValue : 0
        } 
        for(let i=0; totalValue.length>i; i++) {
            console.log(totalValue[i].cashbookGoalValue)
            total.cashbookNowValue += totalValue[i].cashbookNowValue
            total.cashbookGoalValue += totalValue[i].cashbookGoalValue
        }
        console.log(total)
        return `
            signupDay : ${dateValue},
            twoweek : ${twoweek},
            groupByCategory : ${totalValue},
            total : ${total}
        `
    }


    @Post('frame')
    @HttpCode(201)
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '프레임 생성', description: '프레임 생성 및 가계부 섹션 오늘치 생성' })
    async cashFrameCreate (@Body() body : FrameDto, @Req() req : any) {
        const { user } = req
        let frameDto = new FrameDto()
        console.log(user);
        frameDto = {
            cashCategory : body.cashCategory,
            cashName : body.cashName,
            cashListGoalValue : body.cashListGoalValue,
            userId : user.userId
        }


        //이 부분 트랜잭션 해야하는데 어떡하지
        const frame = await this.cashbookService.frameCreate(frameDto)
        
        return `프레임 생성 완료`
    }

    @Put('frame/:cashListId')
    async cashFrameUpdate (@Req() req : any) {
        const { user } = req

    }

    //디폴트는 오늘로 전달해주시길 프론트엔드 2023-05-24 형식으로
    @Get('/')
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '특정 날짜 가계부 get', description: '2022-04-05 형식으로 쿼리스트링 하여 request 요구' })
    async cashList(@Query() query, @Req() req : any) {
        const { user } = req
        const date : Date = query.date
        console.log(date)
        const result = await this.cashbookService.getCashbookByDate(date,user.userId)
        const createCheck = result.map((e)=>{
            return e.cashbookId
        })
        const Checkeddate = await this.cashbookService.getCreateCheck(createCheck)
        
        return result
    }

    @Get(':cashbookId')
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '특정 카드의 디테일 정보', description: '카드이름, 카드카테고리, 디테일정보// 무지출 consumption : false' })
    async cashDetail(@Param() params : CashDetail) {
        console.log(params)
        const cashbookId = params.cashbookId
        console.log('니가호출되고있니')
        const detail = await this.cashbookService.getDetail(cashbookId)
        if(!detail) {

            throw new Error('디테일 데이터가 없습니다')
        }
        let result2 = await this.cashbookService.cashbookById(cashbookId)
        const {cashbookName, cashbookCategory, cashbookNowValue} = result2
        if(detail.length===0) {
            let consumption =true
            cashbookNowValue===0 ? consumption=true : consumption=false
            return consumption;
        } else {
        return `${cashbookName},
                ${cashbookCategory},
                ${detail}`
        }
    }
 
    @Post(":cashbookId")
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '디테일 정보 입력', description: 'cashbookId, text, value 입력' })
    async postDetail(@Param() params : Cashbook, @Body() body : PostDetailDto) {

        let postDetailDto = new PostDetailDto();
        postDetailDto = {
            cashbookId : params,
            cashDetailText : body.cashDetailText,
            cashDetailValue : body.cashDetailValue
        };

        const result = await this.cashbookService.postDetail(postDetailDto);
        if(!result) {
            throw new Error('정상적으로 입력되지 않았습니다')
        }
        return `입력 성공`
    }

    @Delete(":cashDetailId")
    @UseGuards(AccessAuthenticationGuard)
    async deleteDetail(@Param() cashDetailId : CashDetail) {
        if(!cashDetailId) {
            throw new Error('정상적으로 요청되지 않았습니다')
        }
        const detail = await this.cashbookService.getOneDetail(cashDetailId)
        let valueUpdateDto = new ValueUpdateDto()
        valueUpdateDto = {
            cashbookId : detail.cashbookId,
            cashDetailValue : -Number(detail.cashDetailValue)
        }

        await this.cashbookService.addValue(valueUpdateDto)
        await this.cashbookService.deleteDetail(cashDetailId)

        return `삭제 성공`
    }

    @Put(":cashbookId")
    @UseGuards(AccessAuthenticationGuard)
    async checkConsume(@Param() cashbookId) {
        await this.cashbookService.inputConsume(cashbookId)
        return '무지출 지출 전환 완료'
    }
    
}