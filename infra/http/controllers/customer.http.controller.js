import { BillingUseCase } from "../../../app/use-cases/billing.use-case.js";

export class CustomerHttpController {
    constructor(billingUseCase = new BillingUseCase()) {
        this.billingUseCase = billingUseCase
    }

    async processBilling(req, res, paramId) {
        try {
            const response = await this.billingUseCase.execute(paramId);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
}