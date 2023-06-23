import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('Comment')
export class CommentEntity {
    @PrimaryGeneratedColumn()
    public commentId : number

    @Column()
    public commentText : string

    @CreateDateColumn({ type: 'timestamp' })
    public commentCreatedAt : Date
}