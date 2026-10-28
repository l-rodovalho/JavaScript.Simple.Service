import { HealthHttpController } from "./controllers/health.http.controller.js";
import { CustomerHttpController } from "./controllers/customer.http.controller.js";
import { InvoiceHttpController } from "./controllers/invoice.http.controller.js";

export const registerRoutes = async (fastify, options) => {
    const { billingUseCase, calculateInvoicesUseCase } = options;

    const healthHttpController = new HealthHttpController();
    const customerHttpController = new CustomerHttpController(billingUseCase);
    const invoiceHttpController = new InvoiceHttpController(calculateInvoicesUseCase);

    fastify.get('/health', (request, reply) => healthHttpController.getHealth(request, reply));

    fastify.post('/billing/:customerId', (request, reply) => customerHttpController.processBilling(request, reply));

    fastify.post('/invoices/calculate', (request, reply) => invoiceHttpController.calculate(request, reply));
};