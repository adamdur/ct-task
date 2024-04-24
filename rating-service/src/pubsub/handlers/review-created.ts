import { ReviewAbstractHandlerBase } from './review-abstract-base';
import { reviewSchema } from '../../utils/validation';

export class ReviewCreatedHandler extends ReviewAbstractHandlerBase {
  validateData(data: any) {
    return reviewSchema.validate(data);
  }
  getOperationType() {
    return 'review-created';
  }
}
