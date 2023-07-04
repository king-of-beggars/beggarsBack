import {IsNotEmpty} from 'class-validator' 
import { PickType } from "@nestjs/swagger";
import User from "../user.entity";

export class TokenDto  extends PickType(User, ['userId','userName', 'userNickname'] as const ) {
}

export default TokenDto;