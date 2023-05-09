import { Database } from '../../main/database.js';

export class MockDatabase<T> extends Database {
    async start() {}
    async stop() {}

    client() {
        return { db: new Array<T>() };
    }
}
