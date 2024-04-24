import { Router, Request, Response } from 'express';
import { Product, Review } from '../../models';
import { joi } from '../../middleware/joi';
import { productCreateSchema, productUpdateSchema } from '../../utils/validation';
import { paginate } from '../../middleware/paginate';
import { ProductRepository } from 'ct-common-lib';
import redis from '../../services/redis';

const router = Router();
const repo = new ProductRepository(redis);

// POST /products - Create product
router.post('/', joi(productCreateSchema), async (req: Request, res: Response) => {
  try {
    const product = await repo.create(req.body);
    return res.status(201).json(product);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /products - Get all products
router.get('/', paginate(), async (req: Request, res: Response) => {
  const paginationOptions = req.paginationOptions!;
  try {
    const products = await Product.findAndCountAll({ ...paginationOptions });
    return res.status(200).json({
      data: products.rows,
      totalPages: Math.ceil(products.count / paginationOptions.limit),
      currentPage: paginationOptions?.page,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /products/:id - Get product by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await repo.findById(parseInt(req.params.id));
    if (product) {
      return res.status(200).json(product);
    }
    return res.status(404).json({ message: 'Product not found' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /products/:id - Update product
router.put('/:id', joi(productUpdateSchema), async (req: Request, res: Response) => {
  try {
    const updatedProduct = await repo.update(parseInt(req.params.id), req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(updatedProduct);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /products/:id - Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await repo.delete(parseInt(req.params.id));
    if (deleted) {
      return res.status(204).send();
    }
    return res.status(404).json({ message: 'Product not found' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /products/:id/reviews - Get all reviews for product
router.get('/:id/reviews', paginate(), async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id, 10);
  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  const paginationOptions = req.paginationOptions!;

  try {
    const reviews = await Review.findAndCountAll({
      where: { productId: productId },
      ...paginationOptions,
    });
    return res.status(200).json({
      data: reviews.rows,
      totalPages: Math.ceil(reviews.count / paginationOptions.limit),
      currentPage: paginationOptions?.page,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
