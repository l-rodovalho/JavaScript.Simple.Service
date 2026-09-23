import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { CustomerGrpcController } from './controllers/customer.grpc.controller.js';
import { HealthGrpcController } from './controllers/health.grpc.controller.js';
import { env } from '../config/configuration.js';

const PROTO_PATHS = [
    './infra/grpc/proto/billing.proto',
    './infra/grpc/proto/health.proto'
];
const GRPC_PORT = env.GRPC_PORT;

export const startGrpcServer = (billingUseCase) => {
    const customerGrpcController = new CustomerGrpcController(billingUseCase);
    const healthGrpcController = new HealthGrpcController();

    const packageDefinition = protoLoader.loadSync(PROTO_PATHS, {
        keepCase: true, longs: String, enums: String, defaults: true, oneofs: true
    });

    const grpcObject = grpc.loadPackageDefinition(packageDefinition);

    const server = new grpc.Server();

    server.addService(grpcObject.billing.BillingService.service, {
        ProcessBilling: (call, callback) => customerGrpcController.processBilling(call, callback)
    });

    server.addService(grpcObject.health.HealthService.service, {
        Check: (call, callback) => healthGrpcController.check(call, callback)
    });

    server.bindAsync(
        `0.0.0.0:${GRPC_PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
            if (error) throw error;
            console.log(`gRPC server listening on port ${port}`);
        }
    );
};