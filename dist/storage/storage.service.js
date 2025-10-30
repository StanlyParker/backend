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
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';
const pipeline = promisify(stream.pipeline);
let StorageService = class StorageService {
    base;
    constructor() {
        this.base = process.env.STORAGE_PATH ? path.resolve(process.env.STORAGE_PATH) : path.resolve(process.cwd(), 'storage');
        if (!fs.existsSync(this.base))
            fs.mkdirSync(this.base, { recursive: true });
    }
    getVideoDir(videoId) {
        const dir = path.join(this.base, 'videos', videoId);
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        return dir;
    }
    async saveStream(videoId, fileName, readStream) {
        const dir = this.getVideoDir(videoId);
        const outPath = path.join(dir, fileName);
        const writeStream = fs.createWriteStream(outPath);
        await pipeline(readStream, writeStream);
        return outPath;
    }
    async saveFile(videoId, fileName, readStream) {
        const dir = this.getVideoDir(videoId);
        const outPath = path.join(dir, fileName);
        const writeStream = fs.createWriteStream(outPath);
        await pipeline(readStream, writeStream);
        return outPath;
    }
};
StorageService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], StorageService);
export { StorageService };
