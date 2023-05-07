import { App } from '../main/app.js';

const app = new App();

try {
    await app.start();
} catch (error: any) {
    app.logger.error('Oops, something went wrong!');
    process.exit(1);
}
