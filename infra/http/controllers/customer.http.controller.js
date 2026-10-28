import { CustomerNotFoundError, InvalidCustomerIdError } from '../../../app/errors.js';

export class CustomerHttpController {
    constructor(billingUseCase) {
        this.billingUseCase = billingUseCase;
    }

    async processBilling(request, reply) {
        try {
            const response = await this.billingUseCase.execute(request.params?.customerId);

            return reply.status(200).send(response);

        } catch (error) {
            if (error instanceof InvalidCustomerIdError) {
                return reply.status(400).send({ error: error.message });
            }

            if (error instanceof CustomerNotFoundError) {
                return reply.status(404).send({ error: error.message });
            }

            console.error(error);
            return reply.status(500).send({ error: "Internal server error" });
        }
    }
}