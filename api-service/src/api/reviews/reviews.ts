import { Router, Request, Response } from 'express';
import { joi } from '../../middleware/joi';
import { reviewCreateSchema, reviewUpdateSchema } from '../../utils/validation';
import rabbit from '../../services/rabbit';
import { PublisherManager, ReviewRepository } from 'ct-common-lib';
import logger from '../../logger';
import redis from '../../services/redis';

const router = Router();
const repo = new ReviewRepository(redis);

// POST /reviews - Create review
router.post('/', joi(reviewCreateSchema), async (req: Request, res: Response) => {
  try {
    const review = await repo.create(req.body);
    const manager = new PublisherManager(rabbit, logger);
    await manager.publish('review-created', Buffer.from(JSON.stringify(review)));
    return res.status(201).json(review);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// PUT /reviews/:id - Update review
router.put('/:id', joi(reviewUpdateSchema), async (req: Request, res: Response) => {
  try {
    const updatedReview = await repo.update(parseInt(req.params.id), req.body);
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const manager = new PublisherManager(rabbit, logger);
    await manager.publish('review-updated', Buffer.from(JSON.stringify(updatedReview)));
    return res.status(200).json(updatedReview);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /reviews/:id - Delete review
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const review = await repo.findById(parseInt(req.params.id));
    const productId = review?.productId;
    const deleted = await repo.delete(parseInt(req.params.id));
    if (deleted && productId) {
      const manager = new PublisherManager(rabbit, logger);
      await manager.publish('review-deleted', Buffer.from(JSON.stringify({ productId: productId })));
      return res.status(204).send();
    }
    return res.status(404).json({ message: 'Review not found' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
