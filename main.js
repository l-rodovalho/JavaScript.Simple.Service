import { env } from './infra/config/configuration.js';
import { connectDB } from './infra/database/database.config.js';
import { startHttpServer } from './infra/http/http.server.js';
import { startGrpcServer } from './infra/grpc/grpc.server.js';
import { makeBillingUseCase } from './app/factories/make-billing-use-case.js';

const start = async () => {
    try {
        await connectDB();

        const billingUseCase = makeBillingUseCase();
        const protocol = env.PROTOCOL;

        if (protocol === 'HTTP') {
            await startHttpServer(billingUseCase);
        } else if (protocol === 'GRPC') {
            await startGrpcServer(billingUseCase);
        }

    } catch (error) {
        console.error('Error on trying to start server:', error);
        process.exit(1);
    }
};

start();