import { createPublicKey } from 'crypto'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm'

import { Cashbook } from './cashbook.entity'
import { Board } from 'src/Boards/entity/board.entity'
@Entity('cashDetail')
export class CashDetail {
    @PrimaryGeneratedColumn()
    public cashDetailId : number

    @Column()
    public cashDetailText : string

    @Column()
    public cashDetailValue : number

    @Column({
        type: 'timestamp'
    })
    public cashDetailCreatedAt : Date

    @Column({
        type: 'timestamp'
    })
    public cashDetailUpdatedAt : Date

    @ManyToOne(()=>Cashbook, (cashbook:Cashbook)=>cashbook.cashbookId)
    @JoinColumn({name:'cashbookId'})
    public cashbookId : Cashbook

    @BeforeInsert()
    updateCreatedAt() {
        this.cashDetailCreatedAt = new Date();
    }

    @BeforeUpdate()
    updateUpdatedAt() {
        this.cashDetailUpdatedAt = new Date();
    }

}
