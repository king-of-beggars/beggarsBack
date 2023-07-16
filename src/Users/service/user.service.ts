import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import User from '../user.entity';
import { Repository, In, QueryRunner, DataSource } from 'typeorm';
import { SignupDto } from '../dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { SocialSignupDto } from '../dto/socialSignup.dto';
import { GetByUserIdDto } from '../dto/getByUserId.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource
  ) {}

  //회원가입 서비스
  async userSignup(SignupDto: SignupDto): Promise<any> {
    SignupDto.userPwd = await bcrypt.hash(SignupDto.userPwd, 12);
    const query = this.userRepository.create(SignupDto);
    await this.userRepository.save(query);
    return query;
  }

  //소셜 회원가입 서비스
  async socialSignup(SignupDto: SocialSignupDto): Promise<any> {
    const query = this.userRepository.create(SignupDto);
    await this.userRepository.save(query);
    return query;
  }

  //유저아이디로 db체크
  async userByName(userName: string): Promise<User> {
    const query = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.userId', 'user.userName', 'user.userNickname'])
      .where('user.userName=:userName', { userName })
      .getOne();

    return query;
  }

  //유저 아이디로 pwd 반환
  async allListByName(userName: string): Promise<User> {
    if (!userName) {
      throw new Error('아이디가 넘어오지 않음');
    }

    const query = await this.userRepository
      .createQueryBuilder('user')
      .select()
      .where('user.userName=:userName', { userName })
      .getOne();

    return query;
  }

  //유저닉네임으로 db체크
  async userByNickname(userNickname : string): Promise<User> {
    if (!userNickname) {
      throw new Error('닉네임이 넘어오지 않음');
    }
    console.log(userNickname,'dfgdfgdfg');
    const query = await this.userRepository.findOne({
      where: { userNickname },
    }); 

    return query;
  } 

  async pointCheck(getByUserIdDto: GetByUserIdDto): Promise<number> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select(['userPoint'])
      .where('userId = :userId', { userId: getByUserIdDto.userId })
      .getOne(); 
    return Number(result.userPoint);
  }

  async pointInput(getByUserIdDto: GetByUserIdDto, point: number, queryRunner : QueryRunner) {
    return await queryRunner.manager
      .createQueryBuilder()
      .update('User')
      .set({
        userPoint: () =>
          `userPoint + ${point}`,
      })
      .where('userId = :userId', { userId: getByUserIdDto.userId })
      .execute();
  }

  async encodeNick(nickname: string) {
    return encodeURIComponent(nickname);
  }

  async userSignupDate(userId: User) {
    const now: string = new Date().toISOString().split('T')[0];
    const nowdate = new Date(now);
    let date = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.userCreatedAt'])
      .where('user.userId=:userId', { userId })
      .getOne();
    const tempdate: string = new Date(date.userCreatedAt)
      .toISOString()
      .split('T')[0];
    const signupdate: Date = new Date(tempdate);
    const diffDate = nowdate.getTime() - signupdate.getTime();
    return Math.abs(diffDate / (1000 * 60 * 60 * 24));
  }
}
