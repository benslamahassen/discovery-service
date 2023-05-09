import { Application, config } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';

import { MongoDatabase } from './database.js';
import {
    InstanceRepository,
    MongoInstanceRepository,
} from './repositories/inctance.js';
import { HealthRouter } from './routes/health.js';
import { InstanceRouter } from './routes/instance.js';
import { Scheduler } from './scheduler/scheduler.js';
import { Cleanup } from './service/cleanup.js';

export class App extends Application {
    @config({ default: false }) CLEANUP!: boolean;

    override createGlobalScope() {
        const mesh = super.createGlobalScope();
        mesh.service(MongoDb);
        mesh.service(MongoDatabase);
        mesh.service(InstanceRepository, MongoInstanceRepository);
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
        await this.mesh.resolve(MongoDatabase).start();
        await this.httpServer.startServer();
        if (this.CLEANUP) {
            this.mesh.resolve(Scheduler).start();
            this.mesh.resolve(Cleanup).start();
        }
    }

    override async afterStop() {
        await this.httpServer.stopServer();
        this.mesh.resolve(MongoDatabase).stop();
        if (this.CLEANUP) {
            this.mesh.resolve(Scheduler).stop();
        }
    }
}
