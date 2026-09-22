import { HealthHttpController } from "./controllers/health.http.controller.js";
import { CustomerHttpController } from "./controllers/customer.http.controller.js";

const healthHttpController = new HealthHttpController();
const customerHttpController = new CustomerHttpController()

export const routes = {
    'GET:/health': (req, res) => healthHttpController.getHealth(req, res),
    'POST:/billing': (req, res, customerId) => customerHttpController.processBilling(req, res, customerId),
    default: (req, res) => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
};