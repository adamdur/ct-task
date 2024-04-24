import { PaginationResult } from './utils/pagination';

declare global {
  namespace Express {
    interface Request {
      paginationOptions?: PaginationResult;
    }
  }
}
