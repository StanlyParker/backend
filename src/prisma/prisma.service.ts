import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly client = new PrismaClient();

    async onModuleInit(): Promise<void> {
        await this.client.$connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.client.$disconnect();
    }
}