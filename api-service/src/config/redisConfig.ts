import { RedisConfig } from 'ct-common-lib';
require('dotenv').config();

const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

export default redisConfig;
