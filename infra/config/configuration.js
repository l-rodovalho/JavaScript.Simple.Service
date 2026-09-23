function validator(variable, type, value) {
    if (!value) {
        throw new Error(`Variable ${variable} is required!`);
    }

    if (type === 'number') {
        const parsedValue = Number(value);
        if (isNaN(parsedValue)) {
            throw new Error(`Variable ${variable} must be a number!`);
        }
        return parsedValue;
    }

    if (typeof value !== type) {
        throw new Error(`Variable ${variable} must be a ${type}!`);
    }

    return value;
}

export const env = {
    get HTTP_PORT() {
        return validator('HTTP_PORT', 'number', process.env.HTTP_PORT);
    },
    get GRPC_PORT() {
        return validator('GRPC_PORT', 'number', process.env.GRPC_PORT);
    },
    get DB_HOST() {
        return validator('DB_HOST', 'string', process.env.DB_HOST);
    },
    get DB_PORT() {
        return validator('DB_PORT', 'number', process.env.DB_PORT);
    },
    get DB_USER() {
        return validator('DB_USER', 'string', process.env.DB_USER);
    },
    get DB_PASSWORD() {
        return validator('DB_PASSWORD', 'string', process.env.DB_PASSWORD);
    },
    get DB_NAME() {
        return validator('DB_NAME', 'string', process.env.DB_NAME);
    },
    get DB_POOL_MAX() {
        return validator('DB_POOL_MAX', 'number', process.env.DB_POOL_MAX);
    }
};