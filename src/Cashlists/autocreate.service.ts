import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cashbook } from './entity/cashbook.entity';
import { CashbookService } from './cashbook.service';
import { PostCashbookDto } from './dto/postCashbook.dto';
import { CashList } from './entity/cashList.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AutoCreateService {
    constructor(
        private cashbookService : CashbookService,
        @InjectRepository(Cashbook)
        private cashbookEntity : Cashbook
    ){}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async autoCashbook() {
        const list : CashList[] = await this.cashbookService.allCashlist()
        for(let i=0; i<list.length; i++) {
                await this.cashbookService.cashbookCreate(list[i])
            }
        }
    }