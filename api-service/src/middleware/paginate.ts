import { NextFunction, Request, Response } from 'express';
import { getPagination } from '../utils/pagination';

export function paginate() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination = getPagination(req);
      req.paginationOptions = { ...pagination };
      next();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
