import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { json, urlencoded } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import pino from 'pino';
dotenv.config();
const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard'
        }
    }
});
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
    const storagePath = process.env.STORAGE_PATH ?? path.resolve(process.cwd(), 'storage');
    if (!fs.existsSync(storagePath))
        fs.mkdirSync(storagePath, { recursive: true });
    const port = Number(process.env.PORT ?? 4000);
    await app.listen(port, '0.0.0.0');
    logger.info(`Server started on port ${port}`);
}
bootstrap().catch((err) => {
    logger.error('Failed to bootstrap', err);
    process.exit(1);
});
