import { CustomerRepository } from "../../infra/database/repositories/customer.repository.js";

export class BillingUseCase {
    constructor(customerRepository = new CustomerRepository()) {
        this.customerRepository = customerRepository;
    }

    async execute(customerId) {
        const customer = await this.customerRepository.findById(customerId);

        if (!customer) {
            throw new Error('Customer not found');
        }

        const endereco = typeof customer.endereco_cobranca === 'string'
            ? JSON.parse(customer.endereco_cobranca)
            : customer.endereco_cobranca;

        return {
            customerId: customer.cd_customer,
            status: "processado",
            dados: endereco
        };
    }
}