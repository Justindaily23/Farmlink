import Joi from 'joi';

// Buyer Registration Schema
export const registerBuyerSchema = Joi.object({
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

  produce_preferences: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Produce preferences must be an array',
    'string.base': 'Each preference must be a string',
  }),

  password: Joi.string().trim().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),

  confirm_password: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your password',
  }),

  location: Joi.string().trim().optional(),
});

// Buyer Login schema
export const loginBuyerSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Must be a valid email',
  }),
  password: Joi.string().trim().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

export const requestBuyerPasswordResetSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email',
    }),
});

export const resetBuyerPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Reset token is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  confirm_password: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your password',
  }),
});
