import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    Get,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import { type Express } from 'express';
import { VideosService } from './videos.service.js';
import { UploadVideoDto } from './dto/upload-video.dto.js';
import { VideoStatus, Video } from '@prisma/client';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const dir = process.env.STORAGE_PATH ?? path.resolve(process.cwd(), 'storage',  'uploads');
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        const safe = `${Date.now()}${file.originalname.replace(/\s+/g, '_')}`;
        cb(null, safe);
    }
});

const limits = { fileSize: 1024 * 1024 * 1024 };

    
@Controller('videos')
export class VideosController {
    constructor(private readonly videosService: VideosService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { storage: storage, limits: limits }))
    async upload(@UploadedFile() file: Express.Multer.File, @Body() body:UploadVideoDto): Promise<{ id: string; status: VideoStatus }> {
        if (!file) throw new BadRequestException('File is required');
        const created = await this.videosService.createVideo({
            title: body.title ?? file.originalname,
            description: body.description,
            rawPath: file.path
        });
        await this.videosService.enqueueTranscode(created.id);
        return { id: created.id, status: created.status };
    }

    @Get()
    async list(): Promise<Video[]> {
        return this.videosService.list();
    }
}