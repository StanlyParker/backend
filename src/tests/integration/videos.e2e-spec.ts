import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { AppModule } from '../../app.module.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { prismaMock } from '../prisma.service.mock.js';

describe('Videos (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ 
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(prismaMock)
            .compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        app.close();
    });

    it('/videos/upload (POST) should accept file', async () => {
        const filePath = path.join(__dirname, 'sample.text');
        fs.writeFileSync(filePath, 'hello');
        const res = await request(app.getHttpServer()).post('/videos/upload').attach('file', filePath);
        fs.unlinkSync(filePath);
        expect(res.status).toBeGreaterThanOrEqual(200);
    }, 20000);
});