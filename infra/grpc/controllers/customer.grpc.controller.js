import * as grpc from '@grpc/grpc-js';
import { CustomerNotFoundError, InvalidCustomerIdError } from '../../../app/errors.js';

export class CustomerGrpcController {
    constructor(billingUseCase) {
        this.billingUseCase = billingUseCase;
    }

    async processBilling(call, callback) {
        let result;

        try {
            result = await this.billingUseCase.execute(call.request.customer_id);
        } catch (error) {
            if (error instanceof InvalidCustomerIdError) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: error.message
                });
            }

            if (error instanceof CustomerNotFoundError) {
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

        callback(null, result);
    }
}