import { Injectable } from "@nestjs/common";
import { Repository, Join ,EntityManager , QueryBuilder } from "typeorm";
import { CashDetailEntity } from "./entity/cashDetail.entity";
import { CashbookEntity } from "./entity/cashbook.entity";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { PostDetailDto } from "./dto/postDetail.dto";
import UserEntity from "src/Users/user.entity";
import { ValueUpdateDto } from "./dto/valueUpdate.dto";
import { FrameDto } from "./dto/frame.dto";
import { CashListEntity } from "./entity/cashList.entity";
import { CashActivityEntity } from "./entity/cashactivity.entity";
import * as moment from 'moment-timezone';

@Injectable()
export class CashbookService {
    constructor(
        @InjectRepository(CashDetailEntity)
        private readonly cashDetailEntity : Repository<CashDetailEntity>,
        @InjectRepository(CashbookEntity)
        private readonly cashbookEntity : Repository<CashbookEntity>,
        @InjectRepository(CashListEntity)
        private readonly cashListEntity : Repository<CashListEntity>,
        @InjectRepository(CashActivityEntity)
        private readonly cashactivityEntity : Repository<CashActivityEntity>,
        @InjectEntityManager()
        private entityManager : EntityManager
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

        let valueUpdateDto = new ValueUpdateDto()
        valueUpdateDto = {
            cashbookId : postDetailDto.cashbookId,
            cashDetailValue : postDetailDto.cashDetailValue
        }
        await this.addValue(valueUpdateDto)
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

    async getCashbookByDate(date : Date, userId : Number) : Promise<CashbookEntity[]> {
    
        const result = await this.cashbookEntity.query(
            `SELECT cashbookCategory, cashbookNowValue, cashbookGoalValue 
             FROM Cashbook 
             WHERE DATE(cashbookCreatedAt) = DATE(?) 
             AND userId = ? 
             GROUP BY cashbookCategory 
             ORDER BY cashbookCreatedAt DESC`,[date, userId]);
        return result
    }

    async addValue(valueUpdate : ValueUpdateDto) : Promise<any> {
         return await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .update()
        .set({cashbookNowValue : () => `cashbookNowValue + ${valueUpdate.cashDetailValue}`})
        .where('cashbookId=:cashbookId',{cashbookId : valueUpdate.cashbookId})
        .execute()
    }

    async getCashbookDuringDate(endDate : Date, userId : UserEntity) : Promise<any> {
        console.log(userId)
        const day : number = endDate.getDay() + 7 + 1
        let startDate = new Date();
        startDate.setDate(endDate.getDate() - day)
        endDate.setDate(endDate.getDate() + 2)
        const query = await this.cashbookEntity
        // .query(
        //     'SELECT Date(cashbookCreatedAt), cashbookCategory, cashbookNowValue, cashbookGoalValue FROM cashbook where userId = ? and\
        //     cashbookCreatedAt > ? and cashbookCreatedAt <= ? group by Date'
        // )
        .query(
            `SELECT DATE(cashbookCreatedAt) AS dt, cashbookCategory, sum(cashbookNowValue) as cashbookNowValue, sum(cashbookGoalValue) as cashbookGoalValue
             FROM Cashbook
             WHERE DATE(cashbookCreatedAt) >= DATE(?)
             AND DATE(cashbookCreatedAt) < DATE(?)
             AND userId = ?
             GROUP BY dt, cashbookCategory
             ORDER BY DATE(cashbookCreatedAt)`,
            [startDate,endDate,userId]
          );
        console.log(query)

        let array = new Array(14).fill(null)
        moment.tz.setDefault("Asia/Seoul");
        let lastSunday = moment().startOf('week');
        lastSunday = lastSunday.clone().subtract(7, 'days');
        console.log(lastSunday)
        let thisSaturday = moment().endOf('week');
        console.log(thisSaturday)
        let result = [];
        for (let m = moment(lastSunday); m.isBefore(thisSaturday) || m.isSame(thisSaturday); m.add(1, 'days')) {
            result.push(m.format('YYYY-MM-DD'));
        }

        let trueResult = result.reduce((result, key, i) => ({...result, [key]: array[i]}), {});
        console.log(trueResult)

        let flag = '';
            for(let a=0; query.length > a; a++) {
                let tostring = query[a]['dt'].toISOString().split('T')[0]
                if(Number(query[a]['cashbookGoalValue']) >= Number(query[a]['cashbookNowValue'])) {

                    flag!=tostring ? trueResult[tostring]=1 : trueResult[tostring]=0

                } else if(Number(query[a]['cashbookGoalValue']) < Number(query[a]['cashbookNowValue'])) {
                    
                    trueResult[tostring] === 1 ? trueResult[tostring] = 0 : trueResult[tostring] = null
                    flag = tostring
                }
            }
        
        return trueResult;
    }

    async getOneDetail(cashDetailId : CashDetailEntity) : Promise<CashDetailEntity> {
        return await this.cashDetailEntity
        .createQueryBuilder('cashDetail')
        .select()
        .where('cashDetailId=:cashDetailId',{cashDetailId})
        .getOne()
    }
    
    async frameActivityCreate(cashEntity : CashListEntity) {
        let date = new Date()

        const query =  this.cashactivityEntity.create({
            cashListId : cashEntity,
            cashRestartDate : date,
            cashUpdateDate : date
        })

        return await this.cashactivityEntity.save(query)
    }

    async cashbookCreate(frameDto : FrameDto) {
        const query = this.cashbookEntity.create({
            cashbookCategory : frameDto.cashCategory,
            cashbookName : frameDto.cashName,
            cashbookGoalValue : frameDto.cashListGoalValue,
            userId : frameDto.userId
        })
        return await this.cashbookEntity.save(query)

    }

    async frameCreate(frameDto : FrameDto) {
        if(!frameDto) {
            throw new Error('서비스 단으로 데이터가 넘어오지 않음')
        }

        const frame  = this.cashListEntity.create(
            frameDto
        )
        const query : CashListEntity = await this.cashListEntity.save(frame)

        if(!frame) {
            throw new Error('프레임 생성 에러')
        }

        const activity = await this.frameActivityCreate(query)
        if(!activity) {
            throw new Error('액티비티 생성 에러')
        }
        const cashbook = await this.cashbookCreate(frameDto)
        if(!cashbook) {
            throw new Error('캐시북 생성 에러')
        }
        return frame
    }

    async allCashlist() : Promise<CashListEntity[]> {
        return await this.cashListEntity
        .createQueryBuilder()
        .select()
        .getMany()
    }
}