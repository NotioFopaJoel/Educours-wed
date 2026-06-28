const ApiError = require('../utils/ApiError');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map((d) => d.message.replace(/"/g, ''));
      throw new ApiError(400, 'Validation failed', details);
    }
    next();
  };
};

module.exports = { validate };
