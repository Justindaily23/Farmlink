import Joi from 'joi';

const STATUS = ['Instock', 'sold_out'];

export const createProduceSchema = Joi.object({
  farmerId: Joi.string().uuid({ version: 'uuidv4' }).required().messages({
    'string.empty': 'farmerId is required',
    'string.guid': 'farmerId must be a valid UUID',
  }),

  produce_name: Joi.string().trim().required().messages({
    'string.empty': 'produce_name is required',
  }),

  category: Joi.string().trim().required().messages({
    'string.empty': 'category is required',
  }),

  quantity: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'quantity must be a number',
    'number.min': 'quantity must be at least 1',
  }),

  unit: Joi.string().trim().default('unit').messages({
    'string.base': 'unit must be a string',
  }),

  price: Joi.number().precision(2).required().messages({
    'number.base': 'price must be a number',
    'any.required': 'price is required',
  }),

  harvest_date: Joi.date().iso().required().messages({
    'date.base': 'harvest_date must be a valid date',
    'any.required': 'harvest_date is required',
  }),

  location: Joi.string().trim().optional(),

  description: Joi.string().trim().required().messages({
    'string.empty': 'description is required',
  }),

  image_url: Joi.string().uri().required().messages({
    'string.empty': 'image_url is required',
    'string.uri': 'image_url must be a valid URL',
  }),

  status: Joi.string()
    .valid(...STATUS)
    .default('Instock')
    .messages({
      'any.only': `status must be one of [${STATUS.join(', ')}]`,
    }),
});
