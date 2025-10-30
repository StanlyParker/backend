var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service.js';
import { TranscodeService } from '../transcode/transcode.service.js';
let VideosService = class VideosService {
    prisma;
    transcodeService;
    constructor(prisma, transcodeService) {
        this.prisma = prisma;
        this.transcodeService = transcodeService;
    }
    async createVideo(params) {
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
    async enqueueTranscode(videoId) {
        await this.prisma.video.update({ where: { id: videoId }, data: { status: 'transcoding' } });
        await this.transcodeService.transcodeToHls(videoId);
    }
    async list() {
        return this.prisma.video.findMany({ orderBy: { createdAt: 'desc' } });
    }
};
VideosService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService, TranscodeService])
], VideosService);
export { VideosService };
