import { HealthHttpController } from "./controllers/health.http.controller.js";
import { CustomerHttpController } from "./controllers/customer.http.controller.js";

export const getHttpRoutes = (billingUseCase) => {
    const healthHttpController = new HealthHttpController();
    const customerHttpController = new CustomerHttpController(billingUseCase);

    return {
        'GET:/health': (req, res) => healthHttpController.getHealth(req, res),
        'POST:/billing': (req, res, customerId) => customerHttpController.processBilling(req, res, customerId),
        'default': (req, res) => {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Route not found' }));
        }
    };
};