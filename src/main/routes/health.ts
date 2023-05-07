import { Get, Router } from '@ubio/framework';

export class HealthRouter extends Router {
    @Get({
        path: '/health',
        responses: {
            200: {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                    },
                },
            },
        },
    })
    async health() {
        return { status: 'up' };
    }
}
