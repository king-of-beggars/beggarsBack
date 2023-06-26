import { Injectable } from "@nestjs/common";
import { Repository, Join } from "typeorm";
import { CashDetailEntity } from "./entity/cashDetail.entity";
import { CashbookEntity } from "./entity/cashbook.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CashbookService {
    constructor(
        @InjectRepository(CashDetailEntity)
        private readonly cashDetailEntity : Repository<CashDetailEntity>,
        @InjectRepository(CashbookEntity)
        private readonly cashbookEntity : Repository<CashbookEntity>
    ){}

    async getcashbookAndDetail(cashbookId : unknown) : Promise<CashbookEntity> {

        return await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .innerJoinAndSelect('cashbook.detail','cashDetail')
        .innerJoinAndSelect('cashbook.userId','user.userId')
        .where('cashbook.cashbookId=:cashbookId', {cashbookId})
        .getOne()
        
    }

}