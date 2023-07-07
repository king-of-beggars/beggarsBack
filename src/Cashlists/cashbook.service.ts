import { Injectable } from '@nestjs/common';
import { Repository, Join } from 'typeorm';
import { CashDetailEntity } from './entity/cashDetail.entity';
import { CashbookEntity } from './entity/cashbook.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostDetailDto } from './dto/postDetail.dto';
import UserEntity from 'src/Users/user.entity';
import { ValueUpdateDto } from './dto/valueUpdate.dto';
import { FrameDto } from './dto/frame.dto';
import { CashListEntity } from './entity/cashList.entity';
import { CashActivityEntity } from './entity/cashactivity.entity';

@Injectable()
export class CashbookService {
  constructor(
    @InjectRepository(CashDetailEntity)
    private readonly cashDetailEntity: Repository<CashDetailEntity>,
    @InjectRepository(CashbookEntity)
    private readonly cashbookEntity: Repository<CashbookEntity>,
    @InjectRepository(CashListEntity)
    private readonly cashListEntity: Repository<CashListEntity>,
    @InjectRepository(CashActivityEntity)
    private readonly cashactivityEntity: Repository<CashActivityEntity>,
  ) {}

  async getcashbookAndDetail(cashbookId: unknown): Promise<CashbookEntity> {
    return await this.cashbookEntity
      .createQueryBuilder('cashbook')
      .innerJoinAndSelect('cashbook.detail', 'cashDetail')
      .innerJoinAndSelect('cashbook.userId', 'user.userId')
      .where('cashbook.cashbookId=:cashbookId', { cashbookId })
      .getOne();
  }

  async getDetail(cashbookId: number): Promise<CashDetailEntity[]> {
    return await this.cashDetailEntity
      .createQueryBuilder('cashDetail')
      .where('cashDetail.cashbookId=:cashbookId', { cashbookId })
      .orderBy('cashDetail.cashDetailCreatedAt', 'DESC')
      .getMany();
  }

  async postDetail(postDetailDto: PostDetailDto): Promise<any> {
    const query = this.cashDetailEntity.create(postDetailDto);

    let valueUpdateDto = new ValueUpdateDto();
    valueUpdateDto = {
      cashbookId: postDetailDto.cashbookId,
      cashDetailValue: postDetailDto.cashDetailValue,
    };
    await this.addValue(valueUpdateDto);
    return await this.cashDetailEntity.save(query);
  }

  async deleteDetail(cashDetailId: CashDetailEntity): Promise<any> {
    try {
      return this.cashDetailEntity
        .createQueryBuilder('cashDetail')
        .delete()
        .where('cashDetail.cashDetailId', { cashDetailId });
    } catch (e) {
      throw new Error('DB접속에러');
    }
  }

  async getCashbookByDate(
    date: Date,
    userId: UserEntity,
  ): Promise<CashbookEntity[]> {
    return await this.cashbookEntity
      .createQueryBuilder('cashbook')
      .select()
      .where('DATE(cashbook.cashbookCreatedAt)=DATE(:date)', { date })
      .andWhere('cashbook.userId=:userId', { userId })
      .orderBy('cashbook.cashbookCreatedAt', 'DESC')
      .getMany();
  }

  async addValue(valueUpdate: ValueUpdateDto): Promise<any> {
    return await this.cashbookEntity
      .createQueryBuilder('cashbook')
      .update()
      .set({
        cashbookNowValue: () =>
          `cashbookNowValue + ${valueUpdate.cashDetailValue}`,
      })
      .where('cashbookId=:cashbookId', { cashbookId: valueUpdate.cashbookId })
      .execute();
  }

  async getCashbookDuringDate(
    endDate: Date,
    userId: UserEntity,
  ): Promise<CashDetailEntity[]> {
    const day: number = endDate.getDay() + 7 + 1;
    let startDate = new Date();
    startDate.setDate(endDate.getDate() - day);
    const query = await this.cashbookEntity
      .createQueryBuilder('cashbook')
      .select([
        'date(cashbookCreatedAt) as cashbookCreatedAt',
        'cashbookCategory',
        'SUM(cashbookNowValue) as cashbookNowValue',
        'SUM(cashbookGoalValue) as cashbookGoalValue',
      ])
      .where('cashbookCreatedAt > :startDate', { startDate })
      .andWhere('cashbookCreatedAt <= :endDate', { endDate })
      .andWhere('userId=:userId', { userId })
      .groupBy('date(cashbookCreatedAt)')
      .addGroupBy('cashbookCategory')
      .getMany();
    console.log(`####${query}`);
    let array = new Array(14).fill(null);
    let result = array.map((_, e) => {
      let date = new Date();
      date.setDate(date.getDate() - e);
      let string = date.toISOString().split('T')[0];
      let obj = {};
      obj[string] = null;
      return obj;
    });
    result = result.reverse();
    let trueResult = Object.assign({}, ...result);
    for (let i = 0; i < query.length; i++) {
      const querydate = query[i].cashbookCreatedAt.toISOString().split('T')[0];
      console.log(querydate);
      query[i].cashbookGoalValue >= query[i].cashbookNowValue
        ? (trueResult[querydate] = true)
        : (trueResult[querydate] = false);
    }
    return trueResult;
  }

  async getOneDetail(
    cashDetailId: CashDetailEntity,
  ): Promise<CashDetailEntity> {
    return await this.cashDetailEntity
      .createQueryBuilder('cashDetail')
      .select()
      .where('cashDetailId=:cashDetailId', { cashDetailId })
      .getOne();
  }

  async frameActivityCreate(cashEntity: CashListEntity) {
    let date = new Date();

    const query = this.cashactivityEntity.create({
      cashListId: cashEntity,
      cashRestartDate: date,
      cashUpdateDate: date,
    });

    return await this.cashactivityEntity.save(query);
  }

  async cashbookCreate(frameDto: FrameDto) {
    const query = this.cashbookEntity.create({
      cashbookCategory: frameDto.cashCategory,
      cashbookName: frameDto.cashName,
      cashbookGoalValue: frameDto.cashListGoalValue,
    });
    return await this.cashbookEntity.save(query);
  }

  async frameCreate(frameDto: FrameDto) {
    if (!frameDto) {
      throw new Error('서비스 단으로 데이터가 넘어오지 않음');
    }

    const frame = this.cashListEntity.create(frameDto);

    const query: CashListEntity = await this.cashListEntity.save(frame);

    if (!frame) {
      throw new Error('프레임 생성 에러');
    }

    const activity = await this.frameActivityCreate(query);
    if (!activity) {
      throw new Error('액티비티 생성 에러');
    }
    const cashbook = await this.cashbookCreate(frameDto);
    if (!cashbook) {
      throw new Error('캐시북 생성 에러');
    }
    return frame;
  }

  async allCashlist(): Promise<CashListEntity[]> {
    return await this.cashListEntity
      .createQueryBuilder('cashlist')
      .select()
      .getMany();
  }

  /**
   * @description frameModify
   * @param frameDto
   * @returns
   */
  async frameModify(frameDto: FrameDto) {
    if (!frameDto) {
      throw new Error('서비스 단으로 데이터가 넘어오지 않음');
    }
    try {
      //카테고리 정보 검색
      const cashactivity = await this.cashactivityEntity
        .createQueryBuilder('cashactivity')
        .innerJoin('cashactivity.cashListId', 'CashList')
        .where('cashactivity.cashListId = :cashListId', {
          cashListId: frameDto.cashListId,
        })
        .getOne();

      if (
        (await cashactivity.cashStopDate) > (await cashactivity.cashRestartDate)
      ) {
        throw new Error('비활성화');
      }

      const frame = await this.cashListEntity
        .createQueryBuilder('CashList')
        .update()
        .set({
          cashCategory: frameDto.cashCategory,
          cashName: frameDto.cashName,
          cashListGoalValue: frameDto.cashListGoalValue,
        })
        .where('cashListId=:cashListId', {
          cashListId: frameDto.cashListId,
        })
        .execute();
      return frame;
    } catch (error) {
      throw new Error('예기치 못한 에러로 수정 불가');
    }
  }
}
