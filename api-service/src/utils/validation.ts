import Joi from 'joi';

export const reviewCreateSchema = Joi.object({
  productId: Joi.number().integer().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().allow(null, ''),
  reviewText: Joi.string().allow(null, ''),
  rating: Joi.number().integer().min(0).max(5).required(),
});

export const reviewUpdateSchema = Joi.object({
  productId: Joi.number().integer(),
  firstName: Joi.string(),
  lastName: Joi.string().allow(null, ''),
  reviewText: Joi.string().allow(null, ''),
  rating: Joi.number().integer().min(0).max(5),
});

export const productCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0).required(),
  averageRating: Joi.number().min(0).max(5).default(0),
});

export const productUpdateSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow('', null),
  price: Joi.number().integer().min(0),
  averageRating: Joi.number().min(0).max(5),
});
