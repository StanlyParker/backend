export const prismaMock = {
    video: {
        create: jest.fn().mockResolvedValue({ id: 'mock-id', title: 'mock-title' }),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({ id: 'mock-id', title: 'updated-title' }),
    },
    transcodeJob: {
        create: jest.fn().mockResolvedValue({ id: 'job-id' }),
    },
};

