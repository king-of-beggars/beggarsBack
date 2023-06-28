import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Exclude } from 'class-transformer';
import { BoardEntity } from 'src/Boards/entity/board.entity';
import { CashListEntity } from 'src/Cashlists/entity/cashList.entity';
import { CommentEntity } from 'src/Comments/entity/comment.entity';
import { CashbookEntity } from 'src/Cashlists/entity/cashbook.entity';
import { LikeEntity } from 'src/Comments/entity/like.entity';

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn()
    public userId : number;
    
    @Column({ unique: true })
    public userName? : string;

    @Column({ unique: true })
    public userNickname: string;

    @Column({nullable:true})
    @Exclude()
    public userPwd?: string;

    @Column({default:0})
    public userAuth: number;

    @Column({default:'normal'})
    public userLoginType: string;
    
    @Column({default:0})
    public userType: number;
    
    @Column({nullable:true, default:0})
    public userPoint: number;

    @Column({nullable:true})
    public userImage: string;

    @CreateDateColumn({ type: 'timestamp' })
    public userCreatedAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public userUpdatedAt: Date;

    @OneToMany(()=>CashListEntity, 
    (cashlist : CashListEntity) => cashlist.userId, {
       cascade:true 
    })
    public cashlists? : CashListEntity[];

    @OneToMany(()=>CashbookEntity,
    (cashbook : CashbookEntity) => cashbook.userId, {
        cascade:true
    })
    public cashbooks? : CashbookEntity[];

    @OneToMany(()=>BoardEntity,
    (board : BoardEntity) => board.userId, {
        cascade:true
    })
    public boards? : BoardEntity[];

    @OneToMany(()=>CommentEntity,
    (comment : CommentEntity) => comment.userId, {
        cascade:true
    })
    public comments? : CommentEntity[]

    @OneToMany(()=>LikeEntity, (like : LikeEntity)=>like.users, {
        cascade:true
    })
    public likes? : LikeEntity[]

    
}   

export default UserEntity;