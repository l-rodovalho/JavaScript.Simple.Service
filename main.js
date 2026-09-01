import * as http from 'node:http';
import { env } from './infra/config/configuration.js';
import { routes } from './infra/http/routes.js';

const PORT = env.PORT;

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