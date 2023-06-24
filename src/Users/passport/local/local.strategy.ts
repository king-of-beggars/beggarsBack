import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../oauth2.service';
import { UserEntity} from '../../user.entity'
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService : AuthService) {
        super({
            usernameField : 'userName',
            passwordField : 'userPwd'
        })
    }

        async validate(userName: string, userPwd: string): Promise<UserEntity> {
            return this.authService.userCheck(userName,userPwd);
        }
}