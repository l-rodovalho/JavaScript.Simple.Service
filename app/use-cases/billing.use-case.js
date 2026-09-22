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

        const addressData = customer.endereco_cobranca;

        const bills = addressData.billingHistory || [];

        let totalDebt = 0;
        let totalPaid = 0;

        for (let i = 0; i < bills.length; i++) {
            const bill = bills[i];

            if (bill.paid) {
                totalPaid += bill.amount;
                continue;
            }

            let totalDebtWithInterest = bill.amount;
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