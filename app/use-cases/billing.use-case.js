import { CustomerNotFoundError, InvalidCustomerIdError } from '../errors.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class BillingUseCase {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }

    async execute(customerId) {
        if (typeof customerId !== 'string' || !UUID_PATTERN.test(customerId)) {
            throw new InvalidCustomerIdError();
        }

        const customer = await this.customerRepository.findById(customerId);

        if (!customer) {
            throw new CustomerNotFoundError();
        }

        const bills = customer.bills;

        let totalDebt = 0;
        let totalPaid = 0;

        for (let i = 0; i < bills.length; i++) {
            const bill = bills[i];

            if (bill.paid) {
                totalPaid += bill.amount;
                continue;
            }

            const daysOverdue = 30;
            const dailyRate = 0.0033;

            const totalDebtWithInterest = bill.amount * ((1 + dailyRate) ** daysOverdue);

            totalDebt += Math.abs(totalDebtWithInterest);
        }

        return {
            customer_id: customer.customerId,
            name: customer.name,
            metrics: {
                invoices_processed: bills.length,
                total_paid: totalPaid.toFixed(2),
                total_due_with_interest: totalDebt.toFixed(2)
            }
        };
    }
}