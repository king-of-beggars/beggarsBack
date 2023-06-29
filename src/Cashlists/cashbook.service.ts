import { Injectable } from "@nestjs/common";
import { Repository, Join } from "typeorm";
import { CashDetailEntity } from "./entity/cashDetail.entity";
import { CashbookEntity } from "./entity/cashbook.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PostDetailDto } from "./dto/postDetail.dto";
import UserEntity from "src/Users/user.entity";
import { ValueUpdateDto } from "./dto/valueUpdate.dto";

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

    async getDetail(cashbookId : number) : Promise<CashDetailEntity[]> {

        return await this.cashDetailEntity
        .createQueryBuilder('cashDetail')
        .where('cashDetail.cashbookId=:cashbookId',{cashbookId})
        .orderBy('cashDetail.cashDetailCreatedAt',"DESC")
        .getMany()
    }

    async postDetail(postDetailDto : PostDetailDto) : Promise<any> {
        const query = this.cashDetailEntity
        .create(
            postDetailDto
        )
        return await this.cashDetailEntity.save(query)
    }

    async deleteDetail(cashDetailId : CashDetailEntity) : Promise<any> {
        try {
            return this.cashDetailEntity
            .createQueryBuilder('cashDetail')
            .delete()
            .where('cashDetail.cashDetailId', {cashDetailId})
        } catch(e) {
            throw new Error('DB접속에러')
        }
    }

    async getCashbookByDate(date : Date, userId : UserEntity) : Promise<CashbookEntity[]> {
         return await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .where('DATE(cashbook.cashbookCreatedAt)=:date',{date})
        .andWhere('cashbook.userId=:userId',{userId})
        .orderBy('cashbook.cashbookCreatedAt','DESC')
        .getMany()
        
    }

    async addValue(valueUpdate : ValueUpdateDto) {
         await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .update()
        .set({cashbookNowValue : () => `cashbookNowValue + ${valueUpdate.cashDetailValue}`})
        .where('cashbookId=:cashbookId',{cashbookId : valueUpdate.cashbookId})
        .execute()
    }

    async getCashbookDuringDate(endDate : Date, userId : UserEntity) {
        const day : number = endDate.getDay() + 1 + 7
        const startDate = new Date(endDate.getDate() - day)
        return await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .select()
        .where('cashbookCreatedAt > :startDate',{startDate})
        .andWhere('cashbookCreatedAt <= :endDate',{endDate})
        .andWhere('cashbook.userId=:userId',{userId})
        .getMany()

    }

    async getOneDetail(cashDetailId : CashDetailEntity) {
        return await this.cashDetailEntity
        .createQueryBuilder('cashDetail')
        .select()
        .where('cashDetailId=:cashDetailId',{cashDetailId})
        .getOne()
    }

}