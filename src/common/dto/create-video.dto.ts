import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDtoVideo {
    @IsString()
    @MaxLength(200)
    title!: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string;
}