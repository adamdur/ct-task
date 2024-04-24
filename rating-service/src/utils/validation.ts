import Joi from 'joi';
import { ReviewType } from 'ct-common-lib/lib/models/Review';

export const reviewSchema = Joi.object<ReviewType>({
  id: Joi.number().integer().required(),
  productId: Joi.number().integer().required(),
  firstName: Joi.string().allow(null, ''),
  lastName: Joi.string().allow(null, ''),
  reviewText: Joi.string().allow(null, ''),
  rating: Joi.number().integer().min(0).max(5).required(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

export const productIdSchema = Joi.object<{ productId: number }>({
  productId: Joi.number().integer().required(),
});
