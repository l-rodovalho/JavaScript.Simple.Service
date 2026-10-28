import { InvalidRequestError } from '../errors.js';

const BASE_DAILY_RATE = 0.0033;
const TIER_DISCOUNT = [0.0, 0.02, 0.05, 0.10];
const TIER_RATE_MULT = [1.0, 0.9, 0.75, 0.6];

export class CalculateInvoicesUseCase {
    constructor({ maxInvoices = 100000 } = {}) {
        this.maxInvoices = maxInvoices;
    }

    execute({ invoices, rounds = 1 }) {
        if (!Array.isArray(invoices) || invoices.length > this.maxInvoices) {
            throw new InvalidRequestError(`invoices must be an array with at most ${this.maxInvoices} items`);
        }
        if (!Number.isInteger(rounds) || rounds < 1 || rounds > 1000) {
            throw new InvalidRequestError('rounds must be an integer between 1 and 1000');
        }

        let totalPaid = 0;
        let totalDiscount = 0;
        let totalDue = 0;

        for (let i = 0; i < invoices.length; i++) {
            const inv = invoices[i];
            if (inv === null || typeof inv !== 'object') {
                throw new InvalidRequestError(`invoices[${i}] must be an object`);
            }
            const amount = inv.amount;
            const days = inv.days_overdue;
            const paid = inv.paid;
            const tier = inv.tier;
            if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
                throw new InvalidRequestError(`invoices[${i}].amount must be a finite number >= 0`);
            }
            if (!Number.isInteger(days) || days < 0 || days > 365) {
                throw new InvalidRequestError(`invoices[${i}].days_overdue must be an integer between 0 and 365`);
            }
            if (typeof paid !== 'boolean') {
                throw new InvalidRequestError(`invoices[${i}].paid must be a boolean`);
            }
            if (!Number.isInteger(tier) || tier < 0 || tier > 3) {
                throw new InvalidRequestError(`invoices[${i}].tier must be an integer between 0 and 3`);
            }

            if (paid) {
                const discount = amount * TIER_DISCOUNT[tier];
                totalDiscount += discount;
                totalPaid += amount - discount;
                continue;
            }

            const rate = BASE_DAILY_RATE * TIER_RATE_MULT[tier] * (1.0 + Math.log1p(amount / 1000.0));
            let acc = 0;
            for (let r = 0; r < rounds; r++) {
                const d = days + (r % 7);
                const factor = Math.pow(1.0 + rate, d);
                const decay = Math.exp(-d / 90.0);
                const interest = amount * (factor - 1.0) * (1.0 + 0.5 * decay);
                const penalty = d > 30 ? amount * 0.02 : 0.0;
                acc += amount + interest + penalty;
            }
            totalDue += acc / rounds;
        }

        return {
            invoices_processed: invoices.length,
            total_paid: totalPaid.toFixed(2),
            total_discount: totalDiscount.toFixed(2),
            total_due_with_interest: totalDue.toFixed(2)
        };
    }
}
