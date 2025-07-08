export const validateRequest = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      status: 'fail',
      message: detail.message,
    }));
    return res.status(400).json({ errors });
  }

  req.body = value; // sanitized/cleaned
  next();
};
