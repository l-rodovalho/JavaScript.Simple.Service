import * as http from 'node:http';
import { env } from '../config/configuration.js';
import { getHttpRoutes } from './routes.js';

export const startHttpServer = (billingUseCase) => {
    const PORT = env.PORT;

    const routes = getHttpRoutes(billingUseCase);

    const server = http.createServer(async (req, res) => {
        const method = req.method || 'GET';
        const url = (req.url || '/').split('?')[0];

        const segments = url.split('/').filter(Boolean);
        const basePath = segments.length > 0 ? `/${segments[0]}` : '/';
        const paramId = segments.length > 1 ? segments[1] : null;

        const routeKey = `${method}:${basePath}`;

        const handler = routes[routeKey] ?? routes['default'];

        return handler(req, res, paramId);
    });

    server.listen(PORT, () => {
        console.log(`HTTP server listening on port ${PORT}`);
    });
};