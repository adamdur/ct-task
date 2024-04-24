import { Review } from '../models';

export async function getProductReviewsCount(productId: number) {
  return (await Review.aggregate('id', 'count', {
    where: { productId: productId },
  })) as number;
}

export async function getProductReviewsRatingSum(productId: number) {
  return (await Review.aggregate('rating', 'sum', {
    where: { productId: productId },
  })) as number;
}

export async function getProductReviewStats(productId: number) {
  const [count, sum] = await Promise.all([getProductReviewsCount(productId), getProductReviewsRatingSum(productId)]);
  return {
    count,
    sum,
  };
}
