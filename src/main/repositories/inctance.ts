import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

import { Group } from '../schema/group.js';
import { Instance } from '../schema/instance.js';

export class InstanceRepository {
    @dep() private mongodb!: MongoDb;

    protected get collection() {
        return this.mongodb.db.collection('instances');
    }

    async createOrUpdate(
        group: string,
        id: string,
        meta?: Record<string, any>
    ) {
        const now = new Date().toISOString();
        const { value } = await this.collection.findOneAndUpdate(
            { group, id },
            {
                $set: {
                    group,
                    id,
                    meta,
                    updatedAt: now,
                },
                $setOnInsert: {
                    createdAt: now,
                },
            },
            { upsert: true, returnDocument: 'after' }
        );
        return Instance.decode(value);
    }

    async delete(group: string, id: string) {
        return this.collection.findOneAndDelete({
            group,
            id,
        });
    }

    async getInctancesByGroup(group: string) {
        const instances = await this.collection
            .find({
                group,
            })
            .toArray();
        return {
            entities: instances.map((_: any) => Instance.decode(_)),
            count: instances.length,
        };
    }

    async getGroups() {
        const groups = await this.collection
            .aggregate([
                {
                    $group: {
                        _id: '$group',
                        instances: { $sum: 1 },
                        createdAt: { $min: '$createdAt' },
                        lastUpdatedAt: { $max: '$updatedAt' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        group: '$_id',
                        instances: 1,
                        createdAt: 1,
                        lastUpdatedAt: 1,
                    },
                },
            ])
            .toArray();

        return {
            entities: groups.map((_: any) => Group.decode(_)),
            count: groups.length,
        };
    }

    async getInstancesByAge(maxAgeInHours: number) {
        const now = new Date();
        const maxAge = new Date(now.getTime() - maxAgeInHours * 60 * 60 * 1000);
        const instances = await this.collection
            .find({
                updatedAt: {
                    $lte: maxAge.toISOString(),
                },
            })
            .toArray();

        return instances.map((_: any) => Instance.decode(_));
    }

    async deleteManyInstancesByIds(ids: string[]) {
        await this.collection.deleteMany({
            id: {
                $in: ids,
            },
        });
    }
}
