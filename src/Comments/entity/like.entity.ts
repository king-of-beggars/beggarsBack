import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Timestamp, JoinColumn } from 'typeorm'
import { CommentEntity } from './comment.entity'
import UserEntity from 'src/Users/user.entity'

@Entity('Like')
export class LikeEntity {

    @PrimaryGeneratedColumn()
    public likeId : string

    @ManyToOne(()=>CommentEntity, (comment:CommentEntity)=>comment.commentId)
    @JoinColumn({name:'commentId'})
    public commentId : CommentEntity

    @ManyToOne(()=>UserEntity, (user:UserEntity)=>user.userId)
    @JoinColumn({name:'userId'})
    public userId : UserEntity

    @Column({default:1})
    public likeCheck : number

    @CreateDateColumn({type:'timestamp'})
    public likeCreatedAt : Date

    @UpdateDateColumn({type:'timestamp'})
    public likeUpdatedAt : Date
    
}