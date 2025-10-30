var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller.js';
import { VideosService } from './videos.service.js';
import { StreamsController } from './streams.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from '../storage/storage.service.js';
import { TranscodeService } from '../transcode/transcode.service.js';
let VideosModule = class VideosModule {
};
VideosModule = __decorate([
    Module({
        controllers: [VideosController, StreamsController],
        providers: [VideosService, PrismaService, StorageService, TranscodeService],
        exports: [VideosService]
    })
], VideosModule);
export { VideosModule };
