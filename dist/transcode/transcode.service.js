var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from '../storage/storage.service.js';
let TranscodeService = class TranscodeService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    ffmpegPath() {
        return process.env.FFMPEG_PATH ?? 'ffmpeg';
    }
    async transcodeToHls(videoId) {
        const video = await this.prisma.video.findUnique({ where: { id: videoId } });
        if (!video) {
            await this.prisma.transcodeJob.create({ data: { videoId, type: 'hls', status: 'failed' } });
            return;
        }
        const raw = video.rawPath;
        const outDir = this.storage.getVideoDir(videoId);
        const hlsDir = path.join(outDir, 'hls');
        if (!fs.existsSync(hlsDir))
            fs.mkdirSync(hlsDir, { recursive: true });
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
        await new Promise((resolve, reject) => {
            ffmpeg.on('close', (code) => {
                (async () => {
                    if (code === 0) {
                        await this.prisma.video.update({ where: { id: videoId }, data: { hlsPath: hlsDir, status: 'ready' } });
                        await this.prisma.transcodeJob.create({ data: { videoId, type: 'hls', status: 'done', output: hlsDir } });
                        resolve();
                    }
                    else {
                        await this.prisma.video.update({ where: { id: videoId }, data: { status: 'failed' } });
                        await this.prisma.transcodeJob.create({ data: { videoId, type: 'hls', status: 'failed' } });
                        reject(new Error(`ffmpeg exited with code ${code}`));
                    }
                })().catch(reject);
            });
            ffmpeg.on('error', (err) => {
                (async () => {
                    await this.prisma.video.update({ where: { id: videoId }, data: { status: 'failed' } });
                    await this.prisma.transcodeJob.create({ data: { videoId, type: 'hls', status: 'failed' } });
                    reject(err);
                })().catch(reject);
            });
        });
    }
};
TranscodeService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService, StorageService])
], TranscodeService);
export { TranscodeService };
