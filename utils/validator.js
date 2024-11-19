const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })
require('ajv-formats')(ajv)


exports.registerSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 3, maxLength: 50 },
        email: { type: 'string', format: 'email' },
        password: { 
            type: 'string',
            minLength: 8,
            pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$'
        },
    },
    required: ['name', 'email', 'password'],
    additionalProperties: false,
};


exports.loginSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
    },
    required: ['email', 'password'],
    additionalProperties: false,
};


exports.validateRegister = ajv.compile(exports.registerSchema);
exports.validateLogin = ajv.compile(exports.loginSchema);
