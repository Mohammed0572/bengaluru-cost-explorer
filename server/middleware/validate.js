const { ZodError } = require('zod');

const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Parse and sanitize the request body against the Zod schema
      const parsedData = schema.parse(req.body);
      // Replace req.body with the perfectly typed and stripped data
      req.body = parsedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Input Validation Failed',
          errors: error.errors
        });
      }
      next(error);
    }
  };
};

module.exports = validate;
