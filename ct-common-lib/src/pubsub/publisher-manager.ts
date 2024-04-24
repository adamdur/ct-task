import { ILogger } from '../types';
import { BrokerInterface } from '../services';

export class PublisherManager {
  private broker: BrokerInterface;
  private logger: ILogger;

  constructor(broker: BrokerInterface, logger: ILogger) {
    this.broker = broker;
    this.logger = logger;
  }

  public async publish(identifier: string, message: Buffer): Promise<void> {
    const channel = await this.broker.createChannel();
    const exchange = `${identifier}--exchange`;
    const routingKey = `${identifier}--routing-key`;
    try {
      await channel.assertExchange(exchange, 'direct', { durable: true });
      channel.publish(exchange, routingKey, message);
      this.logger.info(`Message published to exchange ${exchange} with routing key ${routingKey}`);
    } catch (error) {
      this.logger.error('Failed to publish message:', error);
    } finally {
      await channel.close();
    }
  }
}
