import { ILogger } from '../types';
import { BaseCache } from './base-cache';
import Redis, { RedisOptions } from 'ioredis';

export interface RedisConfig extends RedisOptions {}

export class RedisCache extends BaseCache {
  private client: Redis;

  constructor(options: RedisOptions, logger: ILogger, ttlSec?: number) {
    super(logger, ttlSec);
    this.client = new Redis(options);
    this.listen();
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (data) {
      this.logger.info(`Cache hit for key ${key} - %s`, data);
      return JSON.parse(data) as T;
    }
    this.logger.info(`Cache miss for key ${key} - %s`, data);
    return null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    const result = await this.client.setex(key, ttl || this.ttlSec, JSON.stringify(value));
    if (result === 'OK') {
      this.logger.info(`Data saved to cache for key ${key} - %s`, JSON.stringify(value));
      return true;
    }
    this.logger.info(`Data not saved to cache for key ${key} - %s`, JSON.stringify(value));
    return false;
  }

  async del(key: string): Promise<boolean> {
    const result = await this.client.del(key);
    if (result > 0) {
      this.logger.info(`Data deleted from cache for key ${key}`);
      return true;
    }
    this.logger.info(`Data not deleted from cache for key ${key}`);
    return false;
  }

  public quit(): void {
    try {
      this.client.quit();
      this.logger.info('Redis connection closed.');
    } catch (e: any) {
      this.logger.error(`Error while trying to quit redis: ${e}`);
    }
  }

  private listen(): void {
    this.client.on('ready', (): void => {
      this.logger.info('Redis Connection Established.');
    });
    this.client.on('error', (err: any): void => {
      // errno -61 = ECONNREFUSED
      if (err.errno === -61) {
        this.logger.debug(`Redis client connection refused, closing connection. Error: ${err}`);
        this.quit();
        return;
      }
      this.logger.debug(`Unexpected redis error. Error: ${err}`);
    });
  }
}
