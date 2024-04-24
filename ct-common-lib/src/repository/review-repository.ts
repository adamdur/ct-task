import { BaseRepository } from './base-repository';
import { ICache } from '../types';
import { Review } from '../models/Review';

export class ReviewRepository extends BaseRepository<Review> {
  constructor(cache: ICache) {
    super(Review, cache);
  }
}
