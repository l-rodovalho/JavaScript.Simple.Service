import * as grpc from '@grpc/grpc-js';

export class CustomerGrpcController {
    constructor(billingUseCase) {
        this.billingUseCase = billingUseCase;
    }

    async processBilling(call, callback) {
        try {
            const customerId = call.request.customer_id;

            if (!customerId) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: "Missing 'customer_id' in request"
                });
            }

            const result = await this.billingUseCase.execute(customerId);

            callback(null, result);

        } catch (error) {
            if (error.message === 'Customer not found') {
                return callback({
                    code: grpc.status.NOT_FOUND,
                    message: error.message
                });
            }

            console.error('gRPC CustomerController Error:', error);
            return callback({
                code: grpc.status.INTERNAL,
                message: "Internal server error"
            });
        }
    }
}