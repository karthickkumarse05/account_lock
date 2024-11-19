const { validateRegister, validateLogin } = require('../utils/validator');

exports.validateRegistration = (req, res, next) => {
    const valid = validateRegister(req.body);
    if (!valid) {
        const errors = validateRegister.errors.map((err) => `${err.property} ${err.message}`).join(', ');
        return res.status(400).json({ message: errors });
    }
    next();
};


exports.validateLogin = (req, res, next) => {
    const valid = validateLogin(req.body);
    if (!valid) {
        const errors = validateLogin.errors.map((err) => `${err.property} ${err.message}`).join(', ');
        return res.status(400).json({ message: errors });
    }
    next();
};
