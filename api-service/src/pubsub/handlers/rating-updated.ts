import { ConsumerHandlerInterface } from 'ct-common-lib';
import amqp from 'amqplib';
import logger from '../../logger';

export class RatingUpdatedHandler implements ConsumerHandlerInterface {
  public handle = async (msg: amqp.ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const msgJson = JSON.parse(msg.content.toString());
      logger.info(`rating-updated handler: Received message: %o`, msgJson);
      // @TODO do something
    } catch (e: any) {
      logger.error(`Error while processing message in rating-updated handler: ${e}`);
    }
  };
}
