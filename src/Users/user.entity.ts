import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn()
    public userId : number;
    
    @Column({ unique: true })
    public userName? : string;

    @Column({ unique: true })
    public userNickname: string;

    @Column({nullable:true})
    public userPwd?: string;

    @Column({default:0})
    public userAuth: number;

    @Column({default:'normal'})
    public userLoginType: string;
    
    @Column({default:0})
    public userType: number;
    
    @Column({nullable:true})
    public userPoint: number;

    @Column({nullable:true})
    public userImage: string;

    @CreateDateColumn({ type: 'timestamp' })
    public userCreatedAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public userUpdatedAt: Date;

}   

export default UserEntity;