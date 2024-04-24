import { DatabaseConnector } from 'ct-common-lib';
import dbConfig from '../config/dbConfig';

const sequelize = DatabaseConnector.getInstance(dbConfig);
export default sequelize;
