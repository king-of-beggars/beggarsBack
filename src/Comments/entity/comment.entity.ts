import { Board } from 'src/Boards/entity/board.entity'
import User from 'src/Users/user.entity'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { Like } from './like.entity'

@Entity('Comment')
export class Comment {
    @PrimaryGeneratedColumn()
    public commentId : number

    @Column()
    public commentText : string

    @CreateDateColumn({ type: 'timestamp' })
    public commentCreatedAt : Date

    @ManyToOne
    (()=>User, (user : User)=> user.userId)
    @JoinColumn({name:'userId'})
    public userId : User

    @ManyToOne
    (()=>Board, (board : Board)=> board.boardId)
    @JoinColumn({name:'boardId'})
    public boardId : Board

    @OneToMany
    (()=>Like, (like : Like)=> like.commentId)
    public likes? : Like[]
}