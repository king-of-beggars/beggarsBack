import { Injectable } from "@nestjs/common";
import { Repository, Join } from "typeorm";
import { CashDetailEntity } from "./entity/cashDetail.entity";
import { CashbookEntity } from "./entity/cashbook.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PostDetailDto } from "./dto/postDetail.dto";

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

    async getDetail(cashbookId : number) {

        return await this.cashDetailEntity
        .createQueryBuilder('cashDetail')
        .where('cashDetail.cashbookId=:cashbookId',{cashbookId})
        .orderBy('cashDetail.cashDetailCreatedAt',"DESC")
        .getMany()
    }

    async postDetail(postDetailDto : PostDetailDto) {
        const query = this.cashDetailEntity
        .create(
            postDetailDto
        )
        return await this.cashDetailEntity.save(query)
    }

    async deleteDetail(cashDetailId : number) {
        try {
            return this.cashDetailEntity
            .createQueryBuilder('cashDetail')
            .delete()
            .where('cashDetail.cashDetailId', {cashDetailId})
        } catch(e) {
            throw new Error('DB접속에러')
        }
    }

    async getCashbookByDate() {

    }

}