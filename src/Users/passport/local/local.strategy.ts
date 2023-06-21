import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/Users/auth.service';
import { UserEntity} from 'src/Users/user.entity'
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