import { ConsumerManager } from 'ct-common-lib';
import rabbit from '../services/rabbit';
import logger from '../logger';
import { RatingUpdatedHandler } from './handlers/rating-updated';

export async function setupConsumers() {
  try {
    const manager = new ConsumerManager(rabbit, logger);
    await manager.setupConsumer('rating-updated', new RatingUpdatedHandler());
  } catch (e: any) {
    logger.error(`Error while setting up consumers: ${e}`);
  }
}
