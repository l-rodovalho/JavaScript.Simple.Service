import { HealthController } from "./controllers/health.controller.js";

const healthController = new HealthController();

export const routes = {
    'GET:/health': (req, res) => healthController.getHealth(req, res),
    default: (req, res) => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
};