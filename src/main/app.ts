import { Application, config } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

import { InstanceRepository } from './repositories/inctance.js';
import { HealthRouter } from './routes/health.js';
import { InstanceRouter } from './routes/instance.js';
import { Scheduler } from './scheduler/scheduler.js';
import { Cleanup } from './service/cleanup.js';

export class App extends Application {
    @config({ default: 8080 }) PORT!: number;
    @config({ default: false }) CLEANUP!: boolean;
    @config() MONGO_URL!: string;

    @dep() private mongodb!: MongoDb;
    @dep() private scheduler!: Scheduler;
    @dep() private instancesCleanup!: Cleanup;

    override createGlobalScope() {
        const mesh = super.createGlobalScope();
        mesh.service(MongoDb);
        mesh.service(InstanceRepository);
        mesh.service(Scheduler);
        mesh.service(Cleanup);
        return mesh;
    }

    override createHttpRequestScope() {
        const mesh = super.createHttpRequestScope();
        mesh.service(HealthRouter);
        mesh.service(InstanceRouter);
        return mesh;
    }

    override async beforeStart() {
        await this.mongodb.client.connect();
        await this.httpServer.startServer();
        if (this.CLEANUP) {
            this.scheduler.start();
            this.instancesCleanup.start();
        }
    }

    override async afterStop() {
        await this.httpServer.stopServer();
        this.mongodb.client.close();
        if (this.CLEANUP) {
            this.scheduler.stop();
        }
    }
}
