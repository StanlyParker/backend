import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service.js';
import { TranscodeService } from '../transcode/transcode.service.js';
import { type Video as VideoModel } from '@prisma/client';

@Injectable()
export class VideosService {
    constructor(private readonly prisma: PrismaService, private readonly transcodeService: TranscodeService) {}

    async createVideo(params: { title: string; description?: string; rawPath: string }): Promise<VideoModel> {
        const v = await this.prisma.video.create({
            data: {
                title: params.title,
                description: params.description,
                rawPath: params.rawPath,
                status: 'uploaded',
                uploaderId: 'anonymous'
            }
        });
        return v;
    }

    async enqueueTranscode(videoId: string): Promise<void> {
        await this.prisma.video.update({ where: { id: videoId }, data: { status: 'transcoding' } });
        await this.transcodeService.transcodeToHls(videoId);
    }

    async list(): Promise<VideoModel[]> {
        return this.prisma.video.findMany({ orderBy: { createdAt: 'desc' } });
    }
}
