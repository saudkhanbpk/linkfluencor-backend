import { Request, Response, NextFunction } from 'express';
import {
  getAllLinksForUser,
  createShortLink,
  updateShortLink,
  bulkCreateShortLinks,
  deleteLink,
  deleteMultipleLinks,
} from '../services/linkService';
import {
  getClicksForLink,
  getLinkClicksTrend,
  getTopCountryByLink,
  getTopCityByLink,
  getBestAverageTimeToEngageByLink,
  getClicksByIntervalAndLinkId,
} from '../services/clickService';
import { TimeInterval } from '../types/types';
import { SortLinksByOptions } from '../types/enums';

export const getAllLinksForUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const sortBy = req.query.sortBy as SortLinksByOptions;
    const page = parseInt(req.query.page as string, 10);
    const limit = parseInt(req.query.limit as string, 10);
    const links = await getAllLinksForUser(userId, sortBy, page, limit);
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
    const { shortUrl, tags } = req.body;
    const userId = req.params.id;

    const updatedLink = await updateShortLink(userId, linkId, shortUrl, tags);
    res.status(200).json(updatedLink);
  } catch (error: any) {
    next(error);
  }
};

export const deleteLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { linkId } = req.params;
    const userId = req.params.id;

    await deleteLink(userId, linkId);
    res.status(204).send();
  } catch (error: any) {
    next(error);
  }
};

export const deleteMultipleLinksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { linkIds } = req.body;
    const userId = req.params.id;

    await deleteMultipleLinks(userId, linkIds);
    res.status(204).send();
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

export const getClicksForLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { linkId } = req.params;
    const clicks = await getClicksForLink(linkId);

    res.json(clicks);
  } catch (error: any) {
    next(error);
  }
};

export const getTotalClicksByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const linkId = req.params.id;
    const totalClicks = await getClicksForLink(linkId);

    res.json(totalClicks.length);
  } catch (error: any) {
    next(error);
  }
};

export const getClicksTrendForLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { linkId } = req.params;
    const clicksTrend = await getLinkClicksTrend(linkId);
    res.json(clicksTrend);
  } catch (error: any) {
    next(error);
  }
};

export const getTopCountryByLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { linkId } = req.params;
    const topCountry = await getTopCountryByLink(linkId);
    res.json(topCountry);
  } catch (error: any) {
    next(error);
  }
};

export const getTopCityByLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { linkId } = req.params;
    const topCity = await getTopCityByLink(linkId);
    res.json(topCity);
  } catch (error: any) {
    next(error);
  }
};

export const getBestAverageTimeToEngageByLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { linkId } = req.params;
    const bestAverageTimeToEngage =
      await getBestAverageTimeToEngageByLink(linkId);
    res.json(bestAverageTimeToEngage);
  } catch (error: any) {
    next(error);
  }
};

export const getClicksByIntervalAndLinkIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { linkId } = req.params;
    const { interval } = req.query;
    const clicks = await getClicksByIntervalAndLinkId(
      interval as TimeInterval,
      linkId
    );
    res.json(clicks);
  } catch (error: any) {
    next(error);
  }
};
