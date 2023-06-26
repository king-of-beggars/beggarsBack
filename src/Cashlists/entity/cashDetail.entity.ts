import { createPublicKey } from 'crypto'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm'

import { CashbookEntity } from './cashbook.entity'
import { BoardEntity } from 'src/Boards/entity/board.entity'
@Entity('cashDetail')
export class CashDetailEntity {
    @PrimaryGeneratedColumn()
    public cashDetailId : number

    @Column()
    public cashDetailText : string

    @Column()
    public cashDetailValue : number

    @CreateDateColumn({ type: 'timestamp' })
    public cashDetailCreatedAt : Date

    @UpdateDateColumn({ type: 'timestamp' })
    public cashDetailUpdatedAt : Date

    @ManyToOne(()=>CashbookEntity, (cashbook:CashbookEntity)=>cashbook.cashbookId)
    @JoinColumn({name:'cashbookId'})
    public cashbookId : CashbookEntity

}
