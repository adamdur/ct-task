import { Product } from './Product';
import { Review } from './Review';
import { Sequelize } from 'sequelize';

export function initializeModels(sequelize: Sequelize) {
  const productModel = Product.initModel(sequelize);
  const reviewModel = Review.initModel(sequelize);

  productModel.hasMany(Review, { foreignKey: 'productId' });
  reviewModel.belongsTo(Product, { foreignKey: 'productId' });

  return { Product: productModel, Review: reviewModel };
}
