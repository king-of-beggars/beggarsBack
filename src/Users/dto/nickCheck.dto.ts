import { PickType } from "@nestjs/swagger";
import { SignupDto } from "./signup.dto";

export class NickCheckDto extends PickType(SignupDto, ['userNickname'] as const) {
}