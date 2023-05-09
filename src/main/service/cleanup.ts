import { config, Logger } from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { InstanceRepository } from '../repositories/inctance.js';
import { Scheduler } from '../scheduler/scheduler.js';

export class Cleanup {
    @config({ default: '24' }) INSTANCE_MAX_AGE_IN_HOURS!: number;
    @config({ default: '* * * * *' }) CLEANUP_SCHEDULE_CRON!: string;

    @dep() private instanceRepository!: InstanceRepository;
    @dep() private scheduler!: Scheduler;
    @dep() private logger!: Logger;

    async start() {
        this.scheduler.add(this.CLEANUP_SCHEDULE_CRON, async () =>
            this.cleanup()
        );

        this.logger.info(
            `Cleanup active! scheduled with cron expression: ${this.CLEANUP_SCHEDULE_CRON}`
        );
    }

    async cleanup() {
        try {
            if (this.INSTANCE_MAX_AGE_IN_HOURS < 0) {
                throw new Error("INSTANCE_MAX_AGE_IN_HOURS can't be negative");
            }

            const instances = await this.instanceRepository.getInstancesByAge(
                this.INSTANCE_MAX_AGE_IN_HOURS
            );

            if (instances.length === 0) {
                this.logger.info('no instances to clean up');
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
            this.logger.error(
                'something went wrong during cleanup.',
                err?.message
            );
        }
    }
}
