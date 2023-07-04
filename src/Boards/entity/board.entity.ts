import { Cashbook } from 'src/Cashlists/entity/cashbook.entity'
import { Comment } from 'src/Comments/entity/comment.entity'
import User from 'src/Users/user.entity'
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm'

@Entity('Board')
export class Board {
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

    @ManyToOne(()=> User, (user : User)=> user.userId)
    @JoinColumn({name:'userId'})
    public userId : User

    @OneToMany(()=>Comment,
    (comment : Comment) => comment.boardId, 
        {
        cascade:true
    })
    public comments? : Comment[]

    @OneToOne(()=>Cashbook,
              (cashbook : Cashbook) => cashbook.cashbookId)
    @JoinColumn({name : 'cashbookId'})
    public cashbookId : Cashbook

}
