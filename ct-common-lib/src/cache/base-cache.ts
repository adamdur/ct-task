import { ICache, ILogger } from '../types';

export abstract class BaseCache implements ICache {
  protected logger: ILogger;

  protected ttlSec: number;

  protected constructor(logger: ILogger, ttlSec?: number) {
    this.logger = logger;
    this.ttlSec = ttlSec || 60;
  }

  abstract get<T>(key: string): Promise<T | null>;

  abstract set<T>(key: string, value: T, ttl?: number): Promise<boolean>;

  abstract del(key: string): Promise<boolean>;

  public ttl = () => this.ttlSec;

  public quit(): void {}
}
