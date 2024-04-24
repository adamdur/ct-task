import amqp from 'amqplib';
import { ILogger } from '../types';

export interface BrokerConfig {
  url: string;
}

export interface BrokerInterface {
  getConnection: () => Promise<amqp.Connection | null>;
  createChannel: () => Promise<amqp.Channel>;
}

export class Broker implements BrokerInterface {
  private static instance: Broker;
  private connection: amqp.Connection | null = null;
  private readonly config: BrokerConfig;
  private logger: ILogger;

  private constructor(config: BrokerConfig, logger: ILogger) {
    this.config = config;
    this.logger = logger;
  }

  public static getInstance(config: BrokerConfig, logger: ILogger): Broker {
    if (!Broker.instance) {
      Broker.instance = new Broker(config, logger);
    }
    return Broker.instance;
  }

  public async getConnection(): Promise<amqp.Connection | null> {
    if (!this.connection) {
      try {
        this.connection = await amqp.connect(this.config.url);
        this.connection.on('error', (err) => {
          this.logger.error(`RabbitMQ Connection Error: ${err}`);
          this.connection = null;
        });
        this.connection.on('close', () => {
          this.logger.info('RabbitMQ Connection Closed');
          this.connection = null;
        });
        this.logger.info('RabbitMQ Connection Established');
      } catch (error) {
        this.logger.error(`Failed to establish RabbitMQ Connection: ${error}`);
        this.reconnect();
      }
    }
    return this.connection;
  }

  async createChannel(): Promise<amqp.Channel> {
    const conn = await this.getConnection();
    if (!conn) throw new Error('Unable to get RabbitMQ connection.');

    const channel = await conn.createChannel();
    channel.on('error', (err) => {
      this.logger.error(`RabbitMQ Channel Error: ${err}`);
    });
    channel.on('close', () => {
      this.logger.info('RabbitMQ Channel Closed');
    });
    return channel;
  }

  private reconnect() {
    setTimeout(() => this.getConnection(), 10000);
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}
