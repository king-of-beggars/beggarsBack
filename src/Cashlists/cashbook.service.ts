import { Injectable } from "@nestjs/common";
import { Repository, Join ,EntityManager , QueryBuilder } from "typeorm";
import { CashDetail } from "./entity/cashDetail.entity";
import { Cashbook } from "./entity/cashbook.entity";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { PostDetailDto } from "./dto/postDetail.dto";
import User from "src/Users/user.entity";
import { ValueUpdateDto } from "./dto/valueUpdate.dto";
import { FrameDto } from "./dto/frame.dto";
import { CashList } from "./entity/cashList.entity";
import { CashActivity } from "./entity/cashactivity.entity";
import { ListBoard } from "src/Boards/dto/listBoard.dto";
import { CashbookCreateDto } from "./dto/cashbookCreate.dto";
import { GetByCashbookId } from "./dto/getByCashbookId.dto";
//import * as moment from 'moment-timezone';
const moment = require('moment-timezone')

@Injectable()
export class CashbookService {
    constructor(
        @InjectRepository(CashDetail)
        private readonly cashDetailEntity : Repository<CashDetail>,
        @InjectRepository(Cashbook)
        private readonly cashbookEntity : Repository<Cashbook>,
        @InjectRepository(CashList)
        private readonly cashListEntity : Repository<CashList>,
        @InjectRepository(CashActivity)
        private readonly cashactivityEntity : Repository<CashActivity>,
        @InjectEntityManager()
        private entityManager : EntityManager
    ){}

    async getcashbookAndDetail(cashbookId : number) : Promise<Cashbook> {

        return await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .innerJoinAndSelect('cashbook.detail','cashDetail')
        .innerJoinAndSelect('cashbook.userId','user.userId')
        .where('cashbook.cashbookId=:cashbookId', {cashbookId})
        .getOne()
        
    }

    async getDetail(cashbookId : unknown) : Promise<CashDetail[]> {
        return await this.cashDetailEntity
        .createQueryBuilder('cashDetail')
        .where('cashDetail.cashbookId=:cashbookId',{cashbookId : cashbookId})
        .orderBy('cashDetail.cashDetailCreatedAt',"ASC")
        .getMany()
    }

    async postDetail(postDetailDto : PostDetailDto) : Promise<any> {
        console.log(postDetailDto, 'postDetail')
        const query = this.cashDetailEntity
        .create(
            postDetailDto
        )

        let valueUpdateDto = new ValueUpdateDto()
        valueUpdateDto = {
            cashbookId : postDetailDto.cashbookId,
            cashDetailValue : Number(postDetailDto.cashDetailValue)
        }
        return await this.cashDetailEntity.save(query)
    }

    async deleteDetail(cashDetailId : CashDetail) : Promise<any> {
        console.log(cashDetailId)
        try {
            return await this.cashDetailEntity
            .createQueryBuilder('cashDetail')
            .delete()
            .where('cashDetail.cashDetailId=:cashDetailId', cashDetailId)
            .execute()
        } catch(e) {
            
        }
    }

    async getCashbookByDate(date : Date, userId : Number) : Promise<Cashbook[]> {
    
        const result : Promise<Cashbook[]> = await this.cashbookEntity.query(
            `SELECT cashbookId, cashbookName, cashbookCategory, cashbookNowValue, cashbookGoalValue 
             FROM Cashbook 
             WHERE DATE(cashbookCreatedAt) = DATE(?) 
             AND userId = ? 
             GROUP BY cashbookCategory 
             ORDER BY cashbookCreatedAt DESC`,[date, userId]);  
        return result
    }

    async addValue(valueUpdate : ValueUpdateDto) : Promise<any> {
        console.log(valueUpdate)
         const result = await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .update()
        .set({cashbookNowValue : () => `cashbookNowValue + ${valueUpdate.cashDetailValue}`})
        .where('cashbookId=:cashbookId',{cashbookId : valueUpdate.cashbookId})
        .execute()

    }

    async getCashbookDuringDate(endDate : Date, userId : User) : Promise<any> {
        console.log(userId)
        const day : number = endDate.getDay() + 7 + 1
        let startDate = new Date();
        startDate.setDate(endDate.getDate() - day)
        endDate.setDate(endDate.getDate() + 2)
        const query = await this.cashbookEntity
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
        
        let thisSaturday = moment().endOf('week');
        
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

    async getOneDetail(cashDetail : CashDetail) : Promise<CashDetail> {
        return await this.cashDetailEntity
        .query(
            `SELECT cashbookId, cashDetailValue
             FROM cashDetail
             WHERE cashDetailId = ?
             `, [cashDetail.cashDetailId]
        )
    }
    
    async frameActivityCreate(cashEntity : CashList) {
        let date = new Date()

        const query =  this.cashactivityEntity.create({
            cashListId : cashEntity,
            cashRestartDate : date,
            cashUpdateDate : date
        })

        return await this.cashactivityEntity.save(query)
    }

    async cashbookCreate(cashbookList : any) {
        if(cashbookList.length>=0) {
            for(let i =0; cashbookList.length>i; i++) {
                const query = this.cashbookEntity.create({
                    cashbookCategory : cashbookList[i].cashCategory,
                    cashbookName : cashbookList[i].cashName,
                    cashbookGoalValue : cashbookList[i].cashListGoalValue,
                    userId : cashbookList[i].userId,
                    cashListId : cashbookList[i]
                })
                await this.cashbookEntity.save(query)
            }
        } else {
            const query = this.cashbookEntity.create({
                cashbookCategory : cashbookList.cashbookCategory,
                cashbookName : cashbookList.cashbookName,
                cashbookGoalValue : cashbookList.cashbookGoalValue,
                userId : cashbookList.userId,
                cashListId : cashbookList
            })
            await this.cashbookEntity.save(query)
        }

    }

    async frameCreate(frameDto : FrameDto) {
        if(!frameDto) {
            throw new Error('서비스 단으로 데이터가 넘어오지 않음')
        }

        const frame  = this.cashListEntity.create(
            frameDto
        )
        const query : any = await this.cashListEntity.save(frame)

        if(!frame) {
            throw new Error('프레임 생성 에러')
        }

        const activity = await this.frameActivityCreate(query)
        if(!activity) {
            throw new Error('액티비티 생성 에러')
        }
        let cashbookCreateDto = new CashbookCreateDto()
        cashbookCreateDto = {
            cashbookCategory : frameDto.cashCategory,
            cashbookName : frameDto.cashName,
            cashbookGoalValue : frameDto.cashListGoalValue,
            userId : frameDto.userId,
            cashListId : query.cashListId
        }
        console.log(cashbookCreateDto)
        const cashbook = await this.cashbookCreate(cashbookCreateDto)
        return frame
    }

    async frameUpdate(cashbook : GetByCashbookId, frameDto : FrameDto) {
        console.log(typeof cashbook)
        const cashList = await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .leftJoinAndSelect('cashbook.cashListId', 'cashList')
        .where('cashbookId=:cashbookId',{cashbookId : Number(cashbook.cashbookId)})
        .getOne()
        const cashListId = cashList.cashListId.cashListId

        await this.cashListEntity
        .createQueryBuilder('cashList')
        .update()
        .set({
            'cashListGoalValue':frameDto.cashListGoalValue,
            'cashCategory':frameDto.cashCategory,
            'cashName':frameDto.cashName})
        .where('cashListId=:cashListId',{cashListId})
        .execute()

        const result = await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .update()
        .set({'cashbookGoalValue':frameDto.cashListGoalValue, 'cashbookCategory':frameDto.cashCategory, 'cashbookName':frameDto.cashName})
        .where('cashbookId=:cashbookId',{cashbookId : Number(cashbook.cashbookId)})
        .execute()

        return result
    } 
    
    async frameDelete(cashbook : GetByCashbookId) {
        const cashList = await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .leftJoinAndSelect('cashbook.cashListId', 'cashList')
        .where('cashbookId=:cashbookId',{cashbookId : Number(cashbook.cashbookId)})
        .getOne()
        const cashListId = cashList.cashListId.cashListId

        const result = await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .delete()
        .where('cashbookId=:cashbookId',{cashbookId : Number(cashbook.cashbookId)})
        .execute()
        
        await this.cashListEntity
        .createQueryBuilder('cashList')
        .delete()
        .where('cashListId=:cashListId',{cashListId})
        .execute()
       

        return result

    }

    async allCashlist() : Promise<CashList[]> {
        return await this.cashListEntity
        .createQueryBuilder('cashList')
        .leftJoinAndSelect('cashList.userId','user')
        .select()
        .getMany()
    }


    async cashbookById(cashbookId : Cashbook) : Promise<Cashbook> {
        return await this.cashbookEntity
        .createQueryBuilder()
        .select()
        .where('cashbookId=:cashbookId',{cashbookId : cashbookId.cashbookId})
        .getOne()

    }

    async inputConsume(cashbookId : Cashbook) {
        const cashbook = await this.cashbookById(cashbookId)
        let { cashbookNowValue } = cashbook

        if(cashbookNowValue===0) {
            cashbookNowValue=null
        } else {
            cashbookNowValue=0
        }
        return await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .update()
        .set({'cashbookNowValue':cashbookNowValue})
        .where('cashbookId=:cashbookId', {cashbookId : cashbookId.cashbookId})
        .execute()

    }

}