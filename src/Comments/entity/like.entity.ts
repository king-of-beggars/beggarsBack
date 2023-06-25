import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Timestamp, JoinColumn } from 'typeorm'
import { CommentEntity } from './comment.entity'
import UserEntity from 'src/Users/user.entity'

@Entity('Like')
export class LikeEntity {

    @PrimaryGeneratedColumn()
    public likeId : string

    @ManyToOne(()=>CommentEntity, (comment:CommentEntity)=>comment.commentId)
    @JoinColumn({name:'commentId'})
    public comments : CommentEntity

    @ManyToOne(()=>UserEntity, (user:UserEntity)=>user.userId)
    @JoinColumn({name:'userId'})
    public users : UserEntity

    @Column({default:true})
    public lickCheck : number

    @Column({type:'timestamp'})
    public likeCreatedAt : Date

    @Column({type:'timestamp'})
    public likeUpdatedAt : Date
    
}