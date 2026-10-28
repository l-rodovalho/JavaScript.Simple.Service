import Fastify from 'fastify';
import { env } from '../config/configuration.js';
import { registerRoutes } from './routes.js';

export const startHttpServer = async ({ billingUseCase, calculateInvoicesUseCase }) => {
    const HTTP_PORT = env.HTTP_PORT;

    const server = Fastify({
        logger: false,
        bodyLimit: 16777216
    });

    await server.register(registerRoutes, { billingUseCase, calculateInvoicesUseCase });

    try {
        await server.listen({ port: HTTP_PORT, host: '0.0.0.0' });
        console.log(`HTTP server listening on port ${HTTP_PORT}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

