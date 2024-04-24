import sequelize from '../services/sequelize';
import { initializeModels } from 'ct-common-lib';

const { Product, Review } = initializeModels(sequelize);

export { Product, Review };
