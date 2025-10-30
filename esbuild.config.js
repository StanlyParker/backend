import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import path from 'path';
import pino from 'pino';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    try {
        await build({
            entryPoints: [path.resolve(__dirname, 'src/main.ts')],
            bundle: true,
            platform: 'node',
            target: ['node22'],
            outfile: path.resolve(__dirname, 'dist', 'main.js'),
            external: [
                'stream', 'crypto', 'fs', 'path', 'url', 'util',
                '@prismaclient', 
                '@nestjs/microservices',
                '@nestjs/microservices/microservices-module',
                '@nestjs/websockets/socket-module',
                '@nestjs/websockets',
                '@nestjs/platform-socket.io',
                '@nestjs/platform-ws',
            ],
            sourcemap: true,
            format: 'esm',
            logLevel: 'info'
        });
    } catch (err) {
        logger.info('esbuild failed', err);
        process.exit(1);
    }
})();