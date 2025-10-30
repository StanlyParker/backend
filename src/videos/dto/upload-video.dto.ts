import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadVideoDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string;
}

