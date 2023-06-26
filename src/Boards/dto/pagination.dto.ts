import { IsNotEmpty, Max, IsOptional } from "class-validator";

export class PaginationDto {

    @IsNotEmpty()
    @IsOptional()
    public page : number

    @IsNotEmpty()
    @IsOptional()
    public limit : number

    @IsNotEmpty()
    @IsOptional()
    @Max(1)
    public boardTypes : number;
}