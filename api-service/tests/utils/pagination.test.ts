import { Request } from 'express';
import {getPagination} from "../../src/utils/pagination";

const createMockRequest = (query: any): Partial<Request> => ({
  query,
});

describe('getPagination', () => {
  it('should return default pagination when no query parameters are provided', () => {
    const req = createMockRequest({});
    const result = getPagination(req as Request);
    expect(result).toEqual({
      limit: 100,
      offset: 0,
      page: 1
    });
  });

  it('should respect page and limit query parameters', () => {
    const req = createMockRequest({ page: '2', limit: '150' });
    const result = getPagination(req as Request, { defaultLimit: 100, maxLimit: 1000 });
    expect(result).toEqual({
      limit: 150,
      offset: 150,
      page: 2
    });
  });

  it('should not exceed the max limit if provided', () => {
    const req = createMockRequest({ limit: '1200' });
    const result = getPagination(req as Request, { defaultLimit: 100, maxLimit: 500 });
    expect(result).toEqual({
      limit: 500,
      offset: 0,
      page: 1
    });
  });

  it('should handle non-integer and negative inputs gracefully', () => {
    const req = createMockRequest({ page: 'abc', limit: '-100' });
    const result = getPagination(req as Request, { defaultLimit: 100, maxLimit: 500 });
    expect(result).toEqual({
      limit: 100,
      offset: 0,
      page: 1,
    });
  });
});
