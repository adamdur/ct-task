import { Product } from '../models/Product';
import { BaseRepository } from './base-repository';
import { ICache } from '../types';

export class ProductRepository extends BaseRepository<Product> {
  constructor(cache: ICache) {
    super(Product, cache);
  }
}
