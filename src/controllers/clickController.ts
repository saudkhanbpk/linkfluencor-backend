import { Request, Response, NextFunction } from 'express';
import { handleClick } from '../services/clickService';



export const handleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const redirectUrl = await handleClick(req);
    res.status(200).json(redirectUrl);
  } catch (err) {
    next(err);
  }
};
