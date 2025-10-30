import { 
    Controller,
    Get,
    Param,
    Res,
    NotFoundException
} from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { type Response } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('streams')
export class StreamsController {
    constructor(private readonly prisma: PrismaService) {}

    @Get('hls/:videoId/master.m3u8')
    async masterPlaylist(@Param('video') videoId: string, @Res() res: Response): Promise<void> {
        const video = await this.prisma.video.findUnique({ where: { id: videoId } });
        if (!video || !video.hlsPath) throw new NotFoundException('Video not found or not processed yet');

        const masterPath = path.resolve(video.hlsPath);
        if (!fs.existsSync(masterPath)) throw new NotFoundException('Master playlist missing');

        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        const stream = fs.createReadStream(masterPath);
        stream.pipe(res);
    }

    @Get('hls/:video/:segment')
    async segment(@Param('videoId') videoId: string, @Param('segment') segment: string, @Res() res: Response): Promise<void> {
        const video = await this.prisma.video.findUnique({ where: { id: videoId } });
        if (!video || !video.hlsPath) throw new NotFoundException();
        const segPath = path.join(video.hlsPath, segment);
        if (!fs.existsSync(segPath)) throw new NotFoundException('Segment not found');
        res.setHeader('Content-Type', 'video/MP2T');
        const stream = fs.createReadStream(segPath);
        stream.pipe(res);
    }
}