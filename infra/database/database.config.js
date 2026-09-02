import { Pool } from 'pg';
import { env } from '../config/configuration.js';

export const dbPool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    max: env.DB_POOL_MAX,
});

export const connectDB = async () => {
    try {
        const client = await dbPool.connect();
        console.log('Connected to PostgreSQL successfully on port', env.DB_PORT);
        client.release();
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
        process.exit(1);
    }
}