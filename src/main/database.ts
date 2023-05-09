import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';
import { MongoClient } from 'mongodb';

export abstract class Database {
    abstract start(): Promise<void>;
    abstract stop(): Promise<void>;
    abstract get client(): any;
}

export class MongoDatabase extends Database {
    @dep() private mongodb!: MongoDb;

    async start(): Promise<void> {
        await this.mongodb.client.connect();
    }

    async stop(): Promise<void> {
        await this.mongodb.client.close();
    }

    get client(): MongoClient {
        return this.mongodb.client;
    }
}
