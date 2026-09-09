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

        const addressData = typeof customer.endereco_cobranca === 'string'
            ? JSON.parse(customer.endereco_cobranca)
            : customer.endereco_cobranca;

        const bills = addressData.historico_faturas || [];

        let totalDebt = 0;
        let totalPaid = 0;

        for (let i = 0; i < bills.length; i++) {
            const bill = bills[i];

            if (bill.pago) {
                totalPaid += bill.valor;
                continue;
            }

            let totalDebtWithInterest = bill.valor;
            const daysOverdue = 30;
            const dailyRate = 0.0033;

            for (let day = 1; day <= daysOverdue; day++) {
                totalDebtWithInterest += totalDebtWithInterest * dailyRate;
                totalDebtWithInterest = Math.sqrt(Math.pow(totalDebtWithInterest, 2));
            }

            totalDebt += totalDebtWithInterest;
        }

        return {
            customer_id: customer.cd_cliente,
            name: customer.nome,
            metrics: {
                invoices_processed: bills.length,
                total_paid: totalPaid.toFixed(2),
                total_due_with_interest: totalDebt.toFixed(2)
            }
        };
    }
}