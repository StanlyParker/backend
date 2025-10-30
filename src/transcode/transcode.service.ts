import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from '../storage/storage.service.js';

@Injectable()
export class TranscodeService {
    constructor(private readonly prisma: PrismaService, private readonly storage: StorageService) {}

    private ffmpegPath(): string {
        return process.env.FFMPEG_PATH ?? 'ffmpeg';
    }

    async transcodeToHls(videoId: string): Promise<void> {
        const video = await this.prisma.video.findUnique({ where: { id: videoId } });
        if (!video) {
            await this.prisma.transcodeJob.create({ data: { videoId, type: 'hls', status: 'failed' } });
            return;
        }

        const raw = video.rawPath;
        const outDir = this.storage.getVideoDir(videoId);
        const hlsDir = path.join(outDir, 'hls');
        if (!fs.existsSync(hlsDir)) fs.mkdirSync(hlsDir, { recursive: true });

        const masterPlaylist = path.join(hlsDir, 'master.m3u8');

        const ffmpeg = spawn(this.ffmpegPath(), [
            '-y',
            '-i',
            raw,
            '-hide_banner',
            '-loglevel',
            'error',
            '-preset',
            'veryfast',
            '-g',
            '48',
            '-sc_threshold',
            '0',
            '-map',
            '0:v',
            '-map',
            '0:a',
            '-c:v',
            'libx264',
            '-c:a',
            'aac',
            '-b:v',
            '1200k',
            '-maxrate',
            '1280k',
            '-bufsize',
            '2400k',
            '-hls_time',
            '6',
            '-hls_playlist_type',
            'vod',
            '-hls_segment_file',
            path.join(hlsDir, 'seg_%03d.ts'),
            masterPlaylist
        ]);

        await new Promise<void>((resolve, reject) => {
            ffmpeg.on('close', (code) => {
                (async (): Promise<void> => {
                    if (code === 0) {
                        await this.prisma.video.update({ where: { id: videoId }, data: {hlsPath: hlsDir, status: 'ready' } });
                        await this.prisma.transcodeJob.create({ data: { videoId, type: 'hls', status: 'done', output: hlsDir } });
                        resolve();
                    } else {
                        await this.prisma.video.update({ where: { id: videoId }, data: { status: 'failed' } });
                        await this.prisma.transcodeJob.create({ data: { videoId, type: 'hls', status: 'failed' } });
                        reject(new Error(`ffmpeg exited with code ${code}`));
                    } 
                })().catch(reject);
            });

            ffmpeg.on('error', (err) => {
                (async (): Promise<void> => {
                    await this.prisma.video.update({ where: { id: videoId}, data: { status: 'failed' } });
                    await this.prisma.transcodeJob.create({ data: { videoId, type: 'hls', status: 'failed' } });
                    reject(err);
                })().catch(reject);
            });
        });
    }
}