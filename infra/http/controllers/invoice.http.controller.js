import { InvalidRequestError } from '../../../app/errors.js';

export class InvoiceHttpController {
    constructor(calculateInvoicesUseCase) {
        this.calculateInvoicesUseCase = calculateInvoicesUseCase;
    }

    calculate(request, reply) {
        try {
            const body = request.body;

            const result = this.calculateInvoicesUseCase.execute({
                invoices: body?.invoices,
                rounds: body?.rounds === undefined ? 1 : body.rounds
            });

            return reply.status(200).send(result);

        } catch (error) {
            if (error instanceof InvalidRequestError) {
                return reply.status(400).send({ error: error.message });
            }

            console.error(error);
            return reply.status(500).send({ error: "Internal server error" });
        }
    }
}
