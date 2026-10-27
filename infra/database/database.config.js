import { Pool } from 'pg';
import { env } from '../config/configuration.js';

export const pool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    max: env.DB_POOL_MAX,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    query_timeout: 30000,
});

export const dbPool = pool;

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL successfully on port', env.DB_PORT);
        client.release();
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
        throw err;
    }
};