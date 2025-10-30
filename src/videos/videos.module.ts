import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller.js';
import { VideosService } from './videos.service.js';
import { StreamsController } from './streams.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from '../storage/storage.service.js';
import { TranscodeService } from '../transcode/transcode.service.js';

@Module({
    controllers: [VideosController, StreamsController],
    providers: [VideosService, PrismaService, StorageService, TranscodeService],
    exports: [VideosService]
})
export class VideosModule {}