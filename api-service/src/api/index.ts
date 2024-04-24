import { Router } from 'express';
import products from './products/products';
import reviews from './reviews/reviews';

const router = Router();

router.use('/products', products);
router.use('/reviews', reviews);

export default router;
