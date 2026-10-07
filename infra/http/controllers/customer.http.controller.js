export class CustomerHttpController {
    constructor(billingUseCase) {
        this.billingUseCase = billingUseCase;
    }

    async processBilling(request, reply) {
        try {
            const customerId = request.params?.customerId;

            if (!customerId) {
                return reply.status(400).send({ error: "Missing customerId parameter" });
            }

            const response = await this.billingUseCase.execute(customerId);

            return reply.status(200).send(response);

        } catch (error) {
            if (error.message === 'Customer not found') {
                return reply.status(404).send({ error: "Customer not found" });
            }

            request.log.error(error);
            return reply.status(500).send({ error: "Internal server error" });
        }
    }
}