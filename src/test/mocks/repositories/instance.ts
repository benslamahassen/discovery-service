import { InstanceRepository } from '../../../main/repositories/inctance.js';
import { Group } from '../../../main/schema/group.js';
import { Instance } from '../../../main/schema/instance.js';
import { MockDatabase } from '../database.js';

export class MockInstanceRepository extends InstanceRepository {
    private mockDb: MockDatabase<Instance> = new MockDatabase();

    async createOrUpdate(
        group: string,
        id: string,
        meta?: Record<string, any>
    ) {
        const now = new Date().toISOString();
        const instance = this.mockDb
            .client()
            .db.find(
                instance => instance.group === group && instance.id === id
            );
        if (instance) {
            instance.meta = meta;
            instance.updatedAt = now;
            return instance;
        }
        const newInstance = Instance.create({
            group,
            id,
            createdAt: now,
            updatedAt: now,
            meta,
        });
        this.mockDb.client().db.push(newInstance);

        return newInstance;
    }

    async delete(group: string, id: string) {
        this.mockDb.client().db = this.mockDb
            .client()
            .db.filter(
                instance => instance.group !== group && instance.id !== id
            );
    }

    async getInctancesByGroup(group: string) {
        return this.mockDb
            .client()
            .db.filter(instance => instance.group === group);
    }

    async getGroups() {
        const uniqueGroups = this.mockDb
            .client()
            .db.reduce((acc: Group[], instance) => {
                const group = acc.find(group => group.group === instance.group);
                if (!group) {
                    acc.push(
                        Group.create({
                            group: instance.group,
                            instances: 1,
                            createdAt: instance.createdAt,
                            lastUpdatedAt: instance.updatedAt,
                        })
                    );
                } else {
                    group.instances++;
                    if (instance.createdAt < group.createdAt) {
                        group.createdAt = instance.createdAt;
                    }
                    if (instance.updatedAt > group.lastUpdatedAt) {
                        group.lastUpdatedAt = instance.updatedAt;
                    }
                }
                return acc;
            }, []);
        return uniqueGroups;
    }

    async getInstancesByAge(maxAgeInHours: number) {
        if (maxAgeInHours <= 0) {
            throw new Error('maxAgeInHours must be greater than 0');
        }
        const now = new Date();
        const maxAge = new Date(now.getTime() - maxAgeInHours * 60 * 60 * 1000);
        return this.mockDb
            .client()
            .db.filter(
                (instance: any) => new Date(instance.updatedAt) <= maxAge
            );
    }

    async deleteManyInstancesByIds(ids: string[]) {
        this.mockDb.client().db = this.mockDb
            .client()
            .db.filter((instance: any) => !ids.includes(instance.id));
    }
}
