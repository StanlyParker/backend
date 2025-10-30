import { Injectable } from "@nestjs/common";
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import stream, { Readable } from 'stream';

const pipeline = promisify(stream.pipeline);

@Injectable()
export class StorageService {
    private base: string;

    constructor() {
        this.base = process.env.STORAGE_PATH ? path.resolve(process.env.STORAGE_PATH) : path.resolve(process.cwd(), 'storage');
        if (!fs.existsSync(this.base)) fs.mkdirSync(this.base, { recursive: true });
    }

    getVideoDir(videoId: string): string {
        const dir = path.join(this.base, 'videos', videoId);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        return dir;
    }

    async saveStream(videoId: string, fileName: string, readStream: Readable): Promise<string> {
        const dir = this.getVideoDir(videoId);
        const outPath = path.join(dir, fileName);
        const writeStream = fs.createWriteStream(outPath);
        await pipeline(readStream, writeStream);
        return outPath;
    }

    async saveFile(videoId: string, fileName: string, readStream: string): Promise<string> {
        const dir = this.getVideoDir(videoId);
        const outPath = path.join(dir, fileName);
        const writeStream = fs.createWriteStream(outPath);
        await pipeline(readStream, writeStream);
        return outPath;
    }
}