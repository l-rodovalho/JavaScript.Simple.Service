export class CustomerNotFoundError extends Error {
    constructor() {
        super('Customer not found');
        this.name = 'CustomerNotFoundError';
    }
}

export class InvalidCustomerIdError extends Error {
    constructor() {
        super('Invalid customer_id');
        this.name = 'InvalidCustomerIdError';
    }
}

export class InvalidRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidRequestError';
    }
}
