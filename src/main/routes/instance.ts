import {
    BodyParam,
    Delete,
    Get,
    PathParam,
    Post,
    Router,
} from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { InstanceRepository } from '../repositories/inctance.js';
import { Group } from '../schema/group.js';
import { Instance } from '../schema/instance.js';

export class InstanceRouter extends Router {
    @dep() private instanceRepository!: InstanceRepository;

    @Post({
        path: '/{group}/{id}',
        responses: {
            200: {
                schema: Instance.schema,
            },
        },
    })
    async register(
        @PathParam('group', { schema: { type: 'string' } })
        group: string,
        @PathParam('id', { schema: { type: 'string', format: 'uuid' } })
        id: string,
        @BodyParam('meta', { schema: { type: 'object' }, required: false })
        meta?: Record<string, any>
    ) {
        const instance = await this.instanceRepository.createOrUpdate(
            group,
            id,
            meta
        );
        return {
            type: 'instance',
            data: instance,
        };
    }

    @Delete({
        path: '/{group}/{id}',
        responses: {
            200: {},
        },
    })
    async unregister(
        @PathParam('group', { schema: { type: 'string' } })
        group: string,
        @PathParam('id', { schema: { type: 'string', format: 'uuid' } })
        id: string
    ) {
        await this.instanceRepository.delete(group, id);
    }

    @Get({
        path: '/',
        responses: {
            200: {
                schema: {
                    type: 'array',
                    items: Group.schema,
                },
            },
        },
    })
    async getRegisteredGroups() {
        const { count, entities } = await this.instanceRepository.getGroups();
        return {
            type: 'array',
            count,
            data: entities,
        };
    }

    @Get({
        path: '/{group}',
        responses: {
            200: {
                schema: {
                    type: 'array',
                    items: Instance.schema,
                },
            },
        },
    })
    async getInstancesByGroup(
        @PathParam('group', { schema: { type: 'string' } })
        group: string
    ) {
        const { count, entities } =
            await this.instanceRepository.getInctancesByGroup(group);
        return {
            type: 'array',
            count,
            data: entities,
        };
    }
}
