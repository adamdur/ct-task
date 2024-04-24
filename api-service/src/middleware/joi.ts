import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export function joi(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    next();
  };
}
