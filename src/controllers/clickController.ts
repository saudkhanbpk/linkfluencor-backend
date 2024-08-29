import { Request, Response, NextFunction } from 'express';
import { handleClick } from '../services/clickService';

export const handleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const originalUrl = await handleClick(req);

    res.redirect(originalUrl);
  } catch (err) {
    next(err);
  }
};
