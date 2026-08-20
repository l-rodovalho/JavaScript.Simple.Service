import * as http from 'node:http';
import { env } from './infra/config/configuration.js';
import { HealthController } from './infra/http/controllers/health.controller.js';

const PORT = env.PORT;

const healthController = new HealthController();

const routes = {
    'GET:/health': (req, res) => healthController.getHealth(req, res),
    default: (req, res) => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
};

const server = http.createServer(async (req, res) => {
    const method = req.method || 'GET';

    const url = (req.url || '/').split('?')[0];

    const routeKey = `${method}:${url}`;

    const handler = routes[routeKey] ?? routes['default'];

    return handler(req, res);
});

const startServer = async () => {
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
};

startServer();