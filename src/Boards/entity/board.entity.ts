import { ApiProperty } from '@nestjs/swagger';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import { Comment } from 'src/Comments/entity/comment.entity';
import User from 'src/Users/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity('Board')
export class Board {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public boardId: number;

  @ApiProperty()
  @Column()
  public boardText: string;

  @ApiProperty()
  @Column()
  public boardTypes: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  public boardCreatedAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  public boardUpdatedAt: Date;

  @ManyToOne(() => User, (user: User) => user.userId)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({ type: () => User })
  public userId: User;

  @OneToMany(() => Comment, (comment: Comment) => comment.boardId, {
    cascade: true,
  })
  @ApiProperty({ type: () => Comment })
  public comments?: Comment[];

  @OneToOne(() => Cashbook, (cashbook: Cashbook) => cashbook.cashbookId)
  @JoinColumn({ name: 'cashbookId' })
  @ApiProperty({ type: () => Cashbook })
  public cashbookId: Cashbook;
}
