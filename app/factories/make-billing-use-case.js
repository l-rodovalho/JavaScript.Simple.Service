import { CustomerRepository } from '../../infra/database/repositories/customer.repository.js';
import { BillingUseCase } from '../use-cases/billing.use-case.js';

export const makeBillingUseCase = () => {
    const customerRepository = new CustomerRepository();

    return new BillingUseCase(customerRepository);
};