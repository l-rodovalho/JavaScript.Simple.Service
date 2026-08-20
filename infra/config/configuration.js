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
    get PORT() {
        return validator('PORT', 'number', process.env.PORT);
    }
};