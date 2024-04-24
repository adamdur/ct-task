import pino, { LoggerOptions } from 'pino';
import { ILogger } from '../types';

export class PinoLogger implements ILogger {
  private readonly logger;

  constructor(pinoOptions: LoggerOptions) {
    this.logger = pino(pinoOptions);
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, ...interpolationValues: Array<any>) {
    this.logger[level](message, ...interpolationValues);
  }

  debug(message: string, ...interpolationValues: Array<any>) {
    this.log('debug', message, ...interpolationValues);
  }

  info(message: string, ...interpolationValues: Array<any>) {
    this.log('info', message, ...interpolationValues);
  }

  warn(message: string, ...interpolationValues: Array<any>) {
    this.log('warn', message, ...interpolationValues);
  }

  error(message: string, ...interpolationValues: Array<any>) {
    this.log('error', message, ...interpolationValues);
  }
}

const pinoPretty = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: false,
    },
  },
};

export const getDefaultPinoLoggerOptions = (level: 'info' | 'debug' = 'info'): LoggerOptions => {
  return {
    level,
    formatters: {
      level: (level: any) => ({ level }),
    },
    messageKey: 'message',
    timestamp: () => `,"time": "${new Date().toISOString()}"`,
    ...(level === 'debug' ? pinoPretty : {}),
  };
};
