import { TranscodeService } from "../../transcode/transcode.service.js";
import { StorageService } from "../../storage/storage.service.js";
describe('TrancodeService', () => {
    test('transcodeToHls for missing video should create failed job', async () => {
        const prismaMock = {
            video: { findUnique: jest.fn().mockResolvedValue(null) },
            transcodeJob: { create: jest.fn().mockResolvedValue({}) },
            video_update: {},
        };
        const storage = new StorageService();
        const svc = new TranscodeService(prismaMock, storage);
        await svc.transcodeToHls('nonexistent').catch(() => { });
        expect(prismaMock.transcodeJob.create).toHaveBeenCalled();
    });
});
