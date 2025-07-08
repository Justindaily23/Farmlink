import { createProduceSchema } from '../farmLink/requests/produce.request.js';
import { BadRequestException } from '../lib/error-definitions.js';

// Validate inputs from user on products
const validateProduce = (req, res, next) => {
  const { error } = createProduceSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    throw new BadRequestException(`Validation Error: ${errors.join(', ')}`);
  }

  // Validate image manually since Joi doesn't handle file uploads
  if (!req.file) {
    throw new BadRequestException('Image is required');
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    throw new BadRequestException(
      'Invalid image format. Only JPEG and PNG are allowed.'
    );
  }

  next(); // Continue to controller
};

export default validateProduce;
