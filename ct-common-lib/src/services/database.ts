import { Sequelize } from 'sequelize';

export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  driver: 'mysql' | 'postgres' | 'sqlite' | 'mssql';
};

const defaultConfig: DatabaseConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'string',
  database: 'ct-products',
  driver: 'postgres',
};

export class DatabaseConnector {
  private static instance: Sequelize;

  public static getInstance(config: Partial<DatabaseConfig> = {}): Sequelize {
    if (!DatabaseConnector.instance) {
      const { host, port, user, password, database, driver } = { ...defaultConfig, ...config };
      DatabaseConnector.instance = new Sequelize(database, user, password, {
        host: host,
        port: port,
        dialect: driver,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });
    }
    return DatabaseConnector.instance;
  }
}
