import * as grpc from '@grpc/grpc-js';
import { InvalidRequestError } from '../../../app/errors.js';

export class InvoiceGrpcController {
    constructor(calculateInvoicesUseCase) {
        this.calculateInvoicesUseCase = calculateInvoicesUseCase;
    }

    calculate(call, callback) {
        let result;

        try {
            result = this.calculateInvoicesUseCase.execute({
                invoices: call.request.invoices,
                rounds: call.request.rounds || 1
            });
        } catch (error) {
            if (error instanceof InvalidRequestError) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: error.message
                });
            }

            console.error('gRPC InvoiceController Error:', error);
            return callback({
                code: grpc.status.INTERNAL,
                message: "Internal server error"
            });
        }

        callback(null, result);
    }
}
