import { env } from './infra/config/configuration.js';
import { connectDB } from './infra/database/database.config.js';
import { startHttpServer } from './infra/http/http.server.js';
import { startGrpcServer } from './infra/grpc/grpc.server.js';
import { CustomerRepository } from './infra/database/repositories/customer.repository.js';
import { BillingUseCase } from './app/use-cases/billing.use-case.js';
import { CalculateInvoicesUseCase } from './app/use-cases/calculate-invoices.use-case.js';

const start = async () => {
    try {
        await connectDB();

        const useCases = {
            billingUseCase: new BillingUseCase(new CustomerRepository()),
            calculateInvoicesUseCase: new CalculateInvoicesUseCase({ maxInvoices: 100000 })
        };
        const protocol = env.PROTOCOL;

        if (protocol === 'HTTP') {
            await startHttpServer(useCases);
        } else if (protocol === 'GRPC') {
            await startGrpcServer(useCases);
        } else {
            throw new Error('PROTOCOL must be HTTP or GRPC');
        }

    } catch (error) {
        console.error('Error on trying to start server:', error);
        process.exit(1);
    }
};

start();