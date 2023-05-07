import { config, Logger } from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { InstanceRepository } from '../repositories/inctance.js';
import { Scheduler } from '../scheduler/scheduler.js';

export class Cleanup {
    @config({ default: '24' }) CLEANUP_INSTANCE_AGE_IN_HOURS!: number;
    @config({ default: '* * * * *' }) CLEANUP_INTERVAL_CRON!: string;

    @dep() private instanceRepository!: InstanceRepository;
    @dep() private scheduler!: Scheduler;
    @dep() private logger!: Logger;

    async start() {
        this.scheduler.add(this.CLEANUP_INTERVAL_CRON, async () =>
            this.cleanup()
        );

        this.logger.info(
            `Cleanup active! scheduled with cron expression: ${this.CLEANUP_INTERVAL_CRON}`
        );
    }

    async cleanup() {
        try {
            const instances = await this.instanceRepository.getInstancesByAge(
                this.CLEANUP_INSTANCE_AGE_IN_HOURS
            );

            if (instances.length === 0) {
                return;
            }

            await this.instanceRepository.deleteManyInstancesByIds(
                instances.map(instance => instance.id)
            );

            this.logger.info(
                `Cleaned up ${
                    instances.length
                } instances, at ${new Date().toUTCString()}`
            );
        } catch (err: any) {
            this.logger.error('something went wrong during cleanup.');
        }
    }
}
