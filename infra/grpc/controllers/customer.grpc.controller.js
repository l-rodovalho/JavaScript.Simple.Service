import * as grpc from '@grpc/grpc-js';

export class CustomerGrpcController {
    constructor(billingUseCase) {
        this.billingUseCase = billingUseCase;
    }

    async processBilling(call, callback) {
        try {
            const customerId = call.request.customer_id;
            const result = await this.billingUseCase.execute(customerId);

            callback(null, result);
        } catch (error) {
            callback({
                code: error.message === 'Customer not found' ? grpc.status.NOT_FOUND : grpc.status.INTERNAL,
                message: error.message
            });
        }
    }
}