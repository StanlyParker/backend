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
import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import { VideosService } from './videos.service.js';
import { UploadVideoDto } from './dto/upload-video.dto.js';
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const dir = process.env.STORAGE_PATH ?? path.resolve(process.cwd(), 'storage', 'uploads');
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        const safe = `${Date.now()}${file.originalname.replace(/\s+/g, '_')}`;
        cb(null, safe);
    }
});
const limits = { fileSize: 1024 * 1024 * 1024 };
let VideosController = class VideosController {
    videosService;
    constructor(videosService) {
        this.videosService = videosService;
    }
    async upload(file, body) {
        if (!file)
            throw new BadRequestException('File is required');
        const created = await this.videosService.createVideo({
            title: body.title ?? file.originalname,
            description: body.description,
            rawPath: file.path
        });
        await this.videosService.enqueueTranscode(created.id);
        return { id: created.id, status: created.status };
    }
    async list() {
        return this.videosService.list();
    }
};
__decorate([
    Post('upload'),
    UseInterceptors(FileInterceptor('file', { storage: storage, limits: limits })),
    __param(0, UploadedFile()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UploadVideoDto]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "upload", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "list", null);
VideosController = __decorate([
    Controller('videos'),
    __metadata("design:paramtypes", [VideosService])
], VideosController);
export { VideosController };
