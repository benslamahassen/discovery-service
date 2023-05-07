import { Schema } from '@ubio/framework';

export interface Instance {
    id: string;
    group: string;
    meta?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export const Instance = new Schema<Instance>({
    schema: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            group: { type: 'string' },
            meta: {
                type: 'object',
                properties: {
                    ip: { type: 'string', optional: true, nullable: true },
                    region: { type: 'string', optional: true, nullable: true },
                },
                optional: true,
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    defaults: () => ({
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }),
});
