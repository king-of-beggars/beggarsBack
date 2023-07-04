import { createPublicKey } from 'crypto'
import User from 'src/Users/user.entity'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm'
import { CashActivity } from './cashactivity.entity'

@Entity('CashList')
export class CashList {
    @PrimaryGeneratedColumn()
    @OneToOne(()=> CashActivity, {
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

    @ManyToOne(()=>User, (user : User)=> user.userId)
    @JoinColumn({name:'userId'})
    public userId : User
}
