import UserEntity from 'src/Users/user.entity'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm'
import { CashDetailEntity } from './cashDetail.entity'

@Entity('Cashbook')
export class CashbookEntity {
    @PrimaryGeneratedColumn()
    @OneToOne(()=> CashDetailEntity, {
        cascade:true
    })
    public cashbookId : number

    @Column()
    public cashbookCategory : string

    @Column()
    public cashbookName : string

    @Column()
    public cashbookNowValue : number;

    @Column()
    public cashbookGoalValue : number;

    @CreateDateColumn({ type: 'timestamp' })
    public cashbookCreatedAt : Date

    @UpdateDateColumn({ type: 'timestamp' })
    public cashbookUpdatedAt : Date

    @ManyToOne(()=>UserEntity, (user : UserEntity)=>user.userId)
    @JoinColumn({name:'userId'})
    public userId : UserEntity
}