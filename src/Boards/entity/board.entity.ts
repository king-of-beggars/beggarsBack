import { createPublicKey } from 'crypto'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('Board')
export class BoardEntity {
    @PrimaryGeneratedColumn()
    public boardId : number

    @Column()
    public boardText : string

    @Column()
    public boardTypes : number

    @CreateDateColumn({ type: 'timestamp' })
    public boardCreatedAt : Date

    @UpdateDateColumn({ type: 'timestamp' })
    public boardUpdatedAt : Date


}