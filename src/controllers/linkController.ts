import { Request, Response, NextFunction } from 'express';
import {
  getAllLinksForUser,
  createShortLink,
  updateShortLink,
  bulkCreateShortLinks,
} from '../services/linkService';

export const getAllLinksForUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const links = await getAllLinksForUser(userId);
    res.json(links);
  } catch (error: any) {
    next(error);
  }
};

export const createShortLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { originalUrl } = req.body;
    const userId = req.params.id;

    const newLink = await createShortLink(userId, originalUrl);
    res.status(201).json(newLink);
  } catch (error: any) {
    next(error);
  }
};

export const updateShortLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { linkId } = req.params;
    const { newShortUrl } = req.body;
    const userId = req.params.id;

    const updatedLink = await updateShortLink(userId, linkId, newShortUrl);
    res.status(200).json(updatedLink);
  } catch (error: any) {
    next(error);
  }
};

export const bulkUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const userId = req.params.id;

    await bulkCreateShortLinks(userId, req.file.buffer, req.file.originalname);

    res.status(200).json({
      message: 'Links created successfully',
    });
  } catch (error) {
    next(error);
  }
  return;
};
