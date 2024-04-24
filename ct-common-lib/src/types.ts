export interface ILogger {
  debug: (message: string, ...interpolationValues: Array<any>) => void;
  info: (message: string, ...interpolationValues: Array<any>) => void;
  warn: (message: string, ...interpolationValues: Array<any>) => void;
  error: (message: string, ...interpolationValues: Array<any>) => void;
}

export interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<boolean>;
  del(key: string): Promise<boolean>;
  ttl(): number;
  quit(): void;
}
