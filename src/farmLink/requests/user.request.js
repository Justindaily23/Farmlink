import Joi from 'joi';

// Registration Schema
export const registerUserSchema = Joi.object({
  username: Joi.string()
    .trim()
    .lowercase()
    .alphanum()
    .min(3)
    .max(15)
    .required()
    .messages({
      'string.empty': 'Username is required',
      'string.alphanum': 'Username must contain only letters and numbers',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must not exceed 20 characters',
    }),

  first_name: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.pattern.base': 'First name must contain only letters',
    }),

  last_name: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.pattern.base': 'Last name must contain only letters',
    }),

  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } }) // disable TLD check if you want to allow test emails like test@mail
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Must be a valid email',
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base':
        'Phone number must be 10 to 15 digits (optionally starts with +)',
    }),

  password: Joi.string().trim().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),

  user_type: Joi.string()
    .lowercase()
    .valid('farmer', 'buyer')
    .required()
    .messages({
      'any.only': 'User type must be either "farmer" or "buyer"',
      'string.empty': 'User type is required',
    }),

  location: Joi.string().trim().optional(),

  profile_picture: Joi.string()
    .trim()
    .uri({ scheme: ['http', 'https'] })
    .optional()
    .messages({
      'string.uri': 'Profile picture must be a valid URL',
    }),
});

// Login schema
export const loginUserSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Must be a valid email',
  }),
  password: Joi.string().trim().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});
