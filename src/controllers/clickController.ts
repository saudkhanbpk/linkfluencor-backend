import { Request, Response, NextFunction } from 'express';
import { handleClick } from '../services/clickService';

export const handleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const redirectUrl = await handleClick(req);

    res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
};
