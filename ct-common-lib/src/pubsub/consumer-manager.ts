import amqp from 'amqplib';
import { ILogger } from '../types';
import { BrokerInterface } from '../services';

export interface ConsumerHandlerInterface {
  handle(message: amqp.ConsumeMessage | null): Promise<void>;
}

export class ConsumerManager {
  private broker: BrokerInterface;
  private consumers: Map<string, { channel: amqp.Channel; tag: string }> = new Map();
  private logger: ILogger;

  constructor(broker: BrokerInterface, logger: ILogger) {
    this.broker = broker;
    this.logger = logger;
  }

  public async setupConsumer(queueName: string, handler: ConsumerHandlerInterface): Promise<void> {
    if (this.consumers.has(queueName)) {
      throw new Error(`Consumer for ${queueName} is already set up.`);
    }
    const exchange = `${queueName}--exchange`;
    const routingKey = `${queueName}--routing-key`;

    const channel = await this.broker.createChannel();
    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchange, routingKey);
    await channel.prefetch(1);

    const response = await channel.consume(
      queueName,
      (message) => {
        try {
          if (!message) return;
          handler.handle(message);
          channel.ack(message);
        } catch (error) {
          this.logger.error('Failed to process message:', error);
          if (message) channel.nack(message, false, true);
        }
      },
      { noAck: false },
    );

    this.consumers.set(queueName, { channel, tag: response.consumerTag });
    this.logger.info(`Consumer set up on queue ${queueName} with routing key ${routingKey}`);
  }

  public async cancelConsumer(queueName: string): Promise<void> {
    const consumer = this.consumers.get(queueName);
    if (consumer) {
      await consumer.channel.cancel(consumer.tag);
      await consumer.channel.close();
      this.consumers.delete(queueName);
      this.logger.info(`Consumer for ${queueName} canceled and channel closed.`);
    }
  }
}
