import { connectDB } from './infra/database/database.config.js';
import { startHttpServer } from './infra/http/http.server.js';
import { startGrpcServer } from './infra/grpc/grpc.server.js';
import { makeBillingUseCase } from './app/factories/make-billing-use-case.js';

const start = async () => {
    try {
        await connectDB();

        const billingUseCase = makeBillingUseCase();

        startHttpServer(billingUseCase);
        startGrpcServer(billingUseCase);

    } catch (error) {
        console.error('Error on trying to start server:', error);
        process.exit(1);
    }
};

start();