import { HealthController } from "./controllers/health.controller.js";
import { CustomerController } from "./controllers/customer.controller.js";

const healthController = new HealthController();
const customerController = new CustomerController()

export const routes = {
    'GET:/health': (req, res) => healthController.getHealth(req, res),
    'POST:/billing': (req, res, customerId) => customerController.processBilling(req, res, customerId),
    default: (req, res) => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
};