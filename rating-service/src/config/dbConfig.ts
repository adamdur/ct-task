import { DatabaseConfig } from 'ct-common-lib';
require('dotenv').config();

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ct-products',
  driver: 'postgres',
};

export default dbConfig;
