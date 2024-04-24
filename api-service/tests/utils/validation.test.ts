import {productCreateSchema, reviewCreateSchema} from "../../src/utils/validation";

describe('Schema Validations', () => {
  describe('Review Schema', () => {
    it('should validate a correct review object', () => {
      const result = reviewCreateSchema.validate({
        productId: 1,
        firstName: 'John',
        lastName: 'Doe',
        reviewText: 'Great product!',
        rating: 5,
      });
      expect(result.error).toBeUndefined();
      expect(result.value).toEqual({
        productId: 1,
        firstName: 'John',
        lastName: 'Doe',
        reviewText: 'Great product!',
        rating: 5,
      });
    });

    it('should report an error for invalid rating', () => {
      const result = reviewCreateSchema.validate({
        productId: 1,
        firstName: 'John',
        lastName: 'Doe',
        reviewText: 'Great product!',
        rating: 6,
      });
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].message).toContain('"rating" must be less than or equal to');
    });
  });

  describe('Product Schema', () => {
    it('should validate a correct product object', () => {
      const result = productCreateSchema.validate({
        name: 'New Product',
        description: 'A description of the new product',
        price: 100,
        averageRating: 4.5,
      });
      expect(result.error).toBeUndefined();
      expect(result.value).toEqual({
        name: 'New Product',
        description: 'A description of the new product',
        price: 100,
        averageRating: 4.5,
      });
    });

    it('should report an error for missing required fields', () => {
      const result = productCreateSchema.validate({
        description: 'Some description',
      });
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].message).toContain('"name" is required');
    });
  });
});
