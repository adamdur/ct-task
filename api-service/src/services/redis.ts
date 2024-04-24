import { RedisCache } from 'ct-common-lib';
import logger from '../logger';
import redisConfig from '../config/redisConfig';

const redis = new RedisCache(redisConfig, logger, 60);

export default redis;
