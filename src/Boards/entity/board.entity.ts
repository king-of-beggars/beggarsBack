import { CashbookEntity } from 'src/Cashlists/entity/cashbook.entity'
import { CommentEntity } from 'src/Comments/entity/comment.entity'
import UserEntity from 'src/Users/user.entity'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm'

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

    @ManyToOne(()=> UserEntity, (user : UserEntity)=> user.userId)
    @JoinColumn({name:'userId'})
    public userId : UserEntity

    @OneToMany(()=>CommentEntity,
    (comment : CommentEntity) => comment.boardId, 
        {
        cascade:true
    })
    public comments? : CommentEntity[]

    @OneToOne(()=>CashbookEntity,
              (cashbook : CashbookEntity) => cashbook.cashbookId)
    @JoinColumn({name : 'cashbookId'})
    public cashbookId : CashbookEntity

}
