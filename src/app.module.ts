import { Module } from '@nestjs/common';
import { VideosModule } from './videos/videos.module.js';
import { PrismaService } from './prisma/prisma.service.js';
import { AppService } from './app.service.js';

@Module({
    imports: [VideosModule],
    providers: [PrismaService, AppService]
})
export class AppModule {}