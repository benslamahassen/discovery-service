import { Schema } from '@ubio/framework';

export interface Group {
    group: string;
    instances: number;
    createdAt: string;
    lastUpdatedAt: string;
}

export const Group = new Schema<Group>({
    schema: {
        type: 'object',
        properties: {
            group: { type: 'string' },
            instances: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            lastUpdatedAt: { type: 'string', format: 'date-time' },
        },
    },
});
