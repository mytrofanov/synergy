import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import App from './src/app';
import config from './ormconfig';
import PostController from './src/controllers';
import validateEnv from './utils/validateEnv';

validateEnv();

(async () => {
    try {
        await createConnection(config);
    } catch (error) {
        console.log('Error while connecting to the database', error);
        return error;
    }
    const app = new App(
        [
            new PostController(),
        ],
    );
    app.listen();
})();