import { createPublicKey } from 'crypto'
import UserEntity from 'src/Users/user.entity'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm'
import { CashActivityEntity } from './cashActivity.entity'

@Entity('CashList')
export class CashListEntity {
    @PrimaryGeneratedColumn()
    @OneToOne(()=> CashActivityEntity, {
        cascade:true
    })
    public cashListId : number

    @Column()
    public cashCategory : string

    @Column()
    public cashName : string

    @Column()
    public cashListGoalValue : number;

    @CreateDateColumn({ type: 'timestamp' })
    public cashListCreatedAt : Date

    @UpdateDateColumn({ type: 'timestamp' })
    public cashListUpdatedAt : Date

    @ManyToOne(()=>UserEntity, (user : UserEntity)=> user.userId)
    @JoinColumn({name:'userId'})
    public userId : UserEntity
}
