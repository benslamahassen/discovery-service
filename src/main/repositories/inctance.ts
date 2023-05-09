import { dep } from 'mesh-ioc';

import { MongoDatabase } from '../database.js';
import { Group } from '../schema/group.js';
import { Instance } from '../schema/instance.js';

export abstract class InstanceRepository {
    abstract createOrUpdate(
        group: string,
        id: string,
        meta?: Record<string, any>
    ): Promise<Instance>;
    abstract delete(group: string, id: string): Promise<void>;
    abstract getInctancesByGroup(group: string): Promise<Instance[]>;
    abstract getGroups(): Promise<Group[]>;
    abstract getInstancesByAge(maxAgeInHours: number): Promise<Instance[]>;
    abstract deleteManyInstancesByIds(ids: string[]): Promise<void>;
}

export class MongoInstanceRepository extends InstanceRepository {
    @dep() private db!: MongoDatabase;

    private get collection() {
        return this.db.client.db().collection('instances');
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
        await this.collection.findOneAndDelete({
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

        return instances.map((_: any) => Instance.decode(_));
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

        return groups.map((_: any) => Group.decode(_));
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
