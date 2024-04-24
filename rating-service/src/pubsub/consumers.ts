import { ConsumerManager, ProductRepository } from 'ct-common-lib';
import rabbit from '../services/rabbit';
import logger from '../logger';
import { ReviewCreatedHandler } from './handlers/review-created';
import { ReviewUpdatedHandler } from './handlers/review-updated';
import { ReviewDeletedHandler } from './handlers/review-deleted';
import redis from '../services/redis';

export async function setupConsumers() {
  try {
    const repo = new ProductRepository(redis);
    const manager = new ConsumerManager(rabbit, logger);
    await manager.setupConsumer('review-created', new ReviewCreatedHandler(repo));
    await manager.setupConsumer('review-updated', new ReviewUpdatedHandler(repo));
    await manager.setupConsumer('review-deleted', new ReviewDeletedHandler(repo));
  } catch (e: any) {
    logger.error(`Error while setting up consumers: ${e}`);
  }
}
