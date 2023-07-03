import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CashbookEntity } from './entity/cashbook.entity';
import { CashbookService } from './cashbook.service';
import { PostCashbookDto } from './dto/postCashbook.dto';
import { CashListEntity } from './entity/cashList.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AutoCreateService {
    constructor(
        private cashbookService : CashbookService,
        @InjectRepository(CashbookEntity)
        private cashbookEntity : CashbookEntity
    ){}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async autoCashbook() {
        const list : CashListEntity[] = await this.cashbookService.allCashlist()
        for(let i=0; i<list.length; i++) {
                console.log(list[i])
                await this.cashbookService.cashbookCreate(list[i])
            }
        }
    }