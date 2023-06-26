import { IsNotEmpty, Max, IsNumber, IsOptional } from "class-validator";

export class PaginationDto {

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    public page : number

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    public limit : number

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    @Max(1)
    public boardTypes : number;
}