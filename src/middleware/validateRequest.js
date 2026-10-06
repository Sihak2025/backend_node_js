
const validateRequest = (schema) => (req, res, next) => {
  try {
    // Parse and validate the incoming request body
    // You can also validate req.query or req.params here if needed
    schema.parse(req.body);
    next();
  } catch (error) {
    // Zod returns structured error arrays inside error.errors
    return res.status(400).json({
      status: 'fail',
      errors: error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }
};

export { validateRequest };
