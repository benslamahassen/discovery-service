import * as dotenv from 'dotenv';

import { App } from '../main/app.js';

dotenv.config();
const app = new App();

try {
    await app.start();
} catch (error: any) {
    app.logger.error('Oops, something went wrong!', error);
    process.exit(1);
}
