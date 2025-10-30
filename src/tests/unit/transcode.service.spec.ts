import { TranscodeService } from "../../transcode/transcode.service.js";
import { PrismaService } from '../../prisma/prisma.service.js';
import { StorageService } from "../../storage/storage.service.js";

describe('TrancodeService', () => {
    test('transcodeToHls for missing video should create failed job', async () => {
        const prismaMock = {
            video: { findUnique: jest.fn().mockResolvedValue(null) },
            transcodeJob: { create: jest.fn().mockResolvedValue({}) },
            video_update: {},
        } as unknown as PrismaService;

        const storage = new StorageService();
        const svc = new TranscodeService(prismaMock, storage);
        await svc.transcodeToHls('nonexistent').catch(() => {});
        expect(prismaMock.transcodeJob.create).toHaveBeenCalled();
    });
});