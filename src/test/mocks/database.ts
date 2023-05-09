import { Database } from '../../main/database.js';

export class MockDatabase<T> extends Database {
    private _client: () => { db: T[] } = () => ({
        db: [],
    });
    async start() {}
    async stop() {}

    get client() {
        return this._client;
    }
}
