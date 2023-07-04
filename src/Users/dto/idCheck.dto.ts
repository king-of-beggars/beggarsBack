import { PickType } from "@nestjs/swagger";
import { SignupDto } from "./signup.dto";

export class IdCheckDto extends PickType(SignupDto, ['userName'] as const) {}