import { Controller, Post, Delete, UseGuards, Param, Body, Req ,Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('핫딜 API')
@Controller('api/hotdeal')
export class HotdealController {

    @Post(':hotDealId')
    async hotDealApplication() {

    }

    @Post('/')
    async hotDealAdd() {
        
    }

    @Get('/')
    async hotDealList() {

    }


}