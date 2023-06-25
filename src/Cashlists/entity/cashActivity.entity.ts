import UserEntity from 'src/Users/user.entity'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm'
import { CashListEntity } from './cashList.entity';

@Entity('CashActivity')
export class CashActivityEntity {
    @PrimaryGeneratedColumn()
    public cashActivityId : number

    @Column()
    public cashListGoalValue : number;

    @Column({ type: 'timestamp' })
    public cashStopDate : Date

    @Column({ type: 'timestamp' })
    public cashRestartDate : Date

    @Column({ type: 'timestamp' })
    public cashUpdateDate : Date

    @OneToOne(()=>CashListEntity,
              (cashList : CashListEntity) => cashList.cashListId)
    @JoinColumn({name : 'cashListId'})
    public cashListId? : CashListEntity
}