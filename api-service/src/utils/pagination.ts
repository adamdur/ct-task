import { Request } from 'express';

interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

export interface PaginationResult {
  limit: number;
  offset: number;
  page: number;
}

export function getPagination(req: Request, options: PaginationOptions = {}): PaginationResult {
  const defaultLimit = options.defaultLimit || 100;
  const maxLimit = options.maxLimit || 1000;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limitInput = parseInt(req.query.limit as string);
  const limit = Math.min(isNaN(limitInput) || limitInput < 1 ? defaultLimit : limitInput, maxLimit);
  const offset = (page - 1) * limit;
  return { limit, offset, page };
}
