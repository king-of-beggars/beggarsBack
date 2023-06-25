import { BoardEntity } from 'src/Boards/entity/board.entity'
import UserEntity from 'src/Users/user.entity'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { LikeEntity } from './like.entity'

@Entity('Comment')
export class CommentEntity {
    @PrimaryGeneratedColumn()
    public commentId : number

    @Column()
    public commentText : string

    @CreateDateColumn({ type: 'timestamp' })
    public commentCreatedAt : Date

    @ManyToOne
    (()=>UserEntity, (user : UserEntity)=> user.userId)
    @JoinColumn({name:'userId'})
    public userId : UserEntity

    @ManyToOne
    (()=>BoardEntity, (board : BoardEntity)=> board.boardId)
    @JoinColumn({name:'boardId'})
    public boardId : BoardEntity

    @OneToMany
    (()=>LikeEntity, (like : LikeEntity)=> like.comments)
    public likes? : LikeEntity[]
}