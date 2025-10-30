var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { PrismaService } from '../prisma/prisma.service.js';
let StreamsController = class StreamsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async masterPlaylist(videoId, res) {
        const video = await this.prisma.video.findUnique({ where: { id: videoId } });
        if (!video || !video.hlsPath)
            throw new NotFoundException('Video not found or not processed yet');
        const masterPath = path.resolve(video.hlsPath);
        if (!fs.existsSync(masterPath))
            throw new NotFoundException('Master playlist missing');
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        const stream = fs.createReadStream(masterPath);
        stream.pipe(res);
    }
    async segment(videoId, segment, res) {
        const video = await this.prisma.video.findUnique({ where: { id: videoId } });
        if (!video || !video.hlsPath)
            throw new NotFoundException();
        const segPath = path.join(video.hlsPath, segment);
        if (!fs.existsSync(segPath))
            throw new NotFoundException('Segment not found');
        res.setHeader('Content-Type', 'video/MP2T');
        const stream = fs.createReadStream(segPath);
        stream.pipe(res);
    }
};
__decorate([
    Get('hls/:videoId/master.m3u8'),
    __param(0, Param('video')),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "masterPlaylist", null);
__decorate([
    Get('hls/:video/:segment'),
    __param(0, Param('videoId')),
    __param(1, Param('segment')),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "segment", null);
StreamsController = __decorate([
    Controller('streams'),
    __metadata("design:paramtypes", [PrismaService])
], StreamsController);
export { StreamsController };
