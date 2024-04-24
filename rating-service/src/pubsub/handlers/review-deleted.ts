import { ReviewAbstractHandlerBase } from './review-abstract-base';
import { productIdSchema } from '../../utils/validation';

export class ReviewDeletedHandler extends ReviewAbstractHandlerBase {
  validateData(data: any) {
    return productIdSchema.validate(data);
  }
  getOperationType() {
    return 'review-deleted';
  }
}
