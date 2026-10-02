import { HealthHttpController } from "./controllers/health.http.controller.js";
import { CustomerHttpController } from "./controllers/customer.http.controller.js";

export const registerRoutes = async (fastify, options) => {
    const { billingUseCase } = options;

    const healthHttpController = new HealthHttpController();
    const customerHttpController = new CustomerHttpController(billingUseCase);

    fastify.get('/health', (request, reply) => healthHttpController.getHealth(request, reply));

    fastify.post('/billing/:customerId', (request, reply) => customerHttpController.processBilling(request, reply));
};