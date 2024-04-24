import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { Product } from './Product';

export interface ReviewType {
  id: number;
  productId: number;
  firstName: string;
  lastName: string | null;
  reviewText: string | null;
  rating: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

interface ReviewCreationAttributes extends Optional<ReviewType, 'id' | 'lastName' | 'reviewText' | 'createdAt' | 'updatedAt'> {}

export class Review extends Model<ReviewType, ReviewCreationAttributes> implements ReviewType {
  declare id: number;
  declare productId: number;
  declare firstName: string;
  declare lastName: string | null;
  declare reviewText: string | null;
  declare rating: number;
  declare createdAt: Date | null;
  declare updatedAt: Date | null;
  static initModel(sequelize: Sequelize): typeof Review {
    Review.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Product,
            key: 'id',
          },
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        reviewText: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
            max: 5,
          },
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'review',
        timestamps: true,
      },
    );
    return Review;
  }
}
