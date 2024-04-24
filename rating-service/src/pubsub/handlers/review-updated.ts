import { ReviewAbstractHandlerBase } from './review-abstract-base';
import { reviewSchema } from '../../utils/validation';

export class ReviewUpdatedHandler extends ReviewAbstractHandlerBase {
  validateData(data: any) {
    return reviewSchema.validate(data);
  }
  getOperationType() {
    return 'review-updated';
  }
}
