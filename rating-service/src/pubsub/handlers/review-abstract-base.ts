import { ConsumerHandlerInterface, ProductRepository, PublisherManager } from 'ct-common-lib';
import amqp from 'amqplib';
import logger from '../../logger';
import rabbit from '../../services/rabbit';
import { getProductReviewStats } from '../../utils/reviews';
import Joi from 'joi';

export abstract class ReviewAbstractHandlerBase implements ConsumerHandlerInterface {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  abstract validateData(msgJson: any): { error: Joi.ValidationError | undefined; value: any };
  abstract getOperationType(): string;

  public handle = async (msg: amqp.ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const msgJson = JSON.parse(msg.content.toString());
      logger.info(`${this.getOperationType()} handler: Received message: %o`, msgJson);

      const { error, value } = this.validateData(msgJson);
      if (error) throw error;

      const { count, sum } = await getProductReviewStats(value.productId);
      const average = parseFloat((sum / count).toFixed(1));
      const updated = await this.productRepository.update(value.productId, {
        averageRating: average,
      });
      if (!updated) {
        logger.error(`Product with id ${value.productId} not found. Average rating not updated.`);
        return;
      }

      const manager = new PublisherManager(rabbit, logger);
      await manager.publish(
        'rating-updated',
        Buffer.from(
          JSON.stringify({
            productId: value.productId,
            average,
            operation: this.getOperationType(),
          }),
        ),
      );
    } catch (e: any) {
      logger.error(`Error while processing message in ${this.getOperationType()} handler: ${e}`);
    }
  };
}
