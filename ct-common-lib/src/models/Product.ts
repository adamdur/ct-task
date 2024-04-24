import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

export interface ProductType {
  id: number;
  name: string;
  description: string | null;
  price: number;
  averageRating: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

interface ProductCreationAttributes extends Optional<ProductType, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}

export class Product extends Model<ProductType, ProductCreationAttributes> implements ProductType {
  declare id: number;
  declare name: string;
  declare description: string | null;
  declare price: number;
  declare averageRating: number;
  declare createdAt: Date | null;
  declare updatedAt: Date | null;
  static initModel(sequelize: Sequelize): typeof Product {
    Product.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        averageRating: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
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
        modelName: 'product',
        timestamps: true,
      },
    );
    return Product;
  }
}
