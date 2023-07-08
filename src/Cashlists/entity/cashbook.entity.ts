import User from 'src/Users/user.entity'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm'
import { CashDetail } from './cashDetail.entity'
import { Board } from 'src/Boards/entity/board.entity'

@Entity('Cashbook')
export class Cashbook {
    @PrimaryGeneratedColumn()
    @OneToOne(()=> Board, {
        cascade:true
    })
    public cashbookId : number

    @Column()
    public cashbookCategory : string

    @Column()
    public cashbookName : string

    @Column({default:0})
    public cashbookNowValue : number;

    @Column({default:0})
    public cashbookGoalValue : number;

    @Column({
        type: 'timestamp'
    })
    public cashbookCreatedAt : Date

    @Column({
        type: 'timestamp'
    })
    public cashbookUpdatedAt : Date

    @ManyToOne(()=>User, (user : User)=>user.userId)
    @JoinColumn({name:'userId'})
    public userId : User

    @OneToMany(()=>CashDetail, (detail : CashDetail)=> detail.cashbookId)
    public detail? : CashDetail[]; 

    @BeforeInsert()
    updateCreatedAt() {
        this.cashbookCreatedAt = new Date();
    }

    @BeforeUpdate()
    updateUpdatedAt() {
        this.cashbookUpdatedAt = new Date();
    }
    

}