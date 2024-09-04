import mongoose from 'mongoose';
import log from '../utils/logger';
import Link from '../models/Link';
import User from '../models/User';
import { generateShortUrl } from '../utils/urlGenerator';
import { detectTargetSite } from '../utils/urlUtils';
import { ILink } from '../interfaces/Link';
import { UserRole } from '../types/enums';
import { getUserById } from '../services/userService';
import { extractLinksFromFile } from '../utils/uploadUtils';
import { BulkLinkData } from '../types/interfaces';
import ValidationError from '../errors/ValidationError';
import NotFoundError from '../errors/NotFoundError';
import AuthorizationError from '../errors/AuthorizationError';
import ConflictError from '../errors/ConflictError';

export const getAllLinksForUser = async (
  userId: string,
  sortBy: string = 'topLinks',
  page: number = 1,
  limit: number = 10
) => {
  try {
    log.info(`Fetching all links for user with id: ${userId}`);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      log.error('Invalid user ID format');
      throw new ValidationError('Invalid user ID format');
    }

    const user = await User.findById(userId);
    if (!user) {
      log.warn(`User with id: ${userId} not found`);
      throw new NotFoundError('User not found');
    }

    const sortOptions: { [key: string]: any } = {
      topLinks: { clicks: -1 },
      newlyAdded: { createdAt: -1 },
      oldLinks: { createdAt: 1 },
      affiliatedLinks: { isAffiliated: -1 },
    };

    const sort = sortOptions[sortBy] || sortOptions['topLinks'];

    const req =
      user.role === UserRole.BrandUser && user.brand
        ? { brand: user.brand }
        : { user: user._id };

    const links = await Link.find(req)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    log.info(`Found ${links.length} links for user ID: ${userId}`);
    return links;
  } catch (error: any) {
    log.error(
      `Error fetching links for user with id: ${userId}: ${error.message}`
    );
    throw error;
  }
};

export const createShortLink = async (
  userId: string,
  originalUrl: string,
  prefixUrl?: string | null,
  suffix?: string | null,
  tagsArray?: string[] | null
): Promise<ILink> => {
  try {
    log.info(`Creating short link for user with id: ${userId}`);
    const user = await User.findById(userId);

    if (!user) {
      log.warn(`User with id: ${userId} not found`);
      throw new NotFoundError('User not found');
    }

    const shortUrl = suffix ?? generateShortUrl();
    const prefix = prefixUrl ?? '';
    const tags = tagsArray ?? [];
    const targetSite = detectTargetSite(originalUrl);

    log.info(`Generated short URL: ${shortUrl}`);

    const newLink = new Link({
      user: user._id,
      originalUrl,
      shortUrl,
      createdBy: user._id,
      targetSite,
      brand: user.brand,
      prefix,
      tags,
    });

    await newLink.save();
    log.info(`Short link created with id: ${newLink._id}`);

    return newLink;
  } catch (error: any) {
    log.error(
      `Error creating short link for user with id: ${userId}: ${error.message}`
    );
    throw error;
  }
};

export const getOriginalUrl = async (shortUrl: string): Promise<ILink> => {
  try {
    log.info(`Searching short link for: ${shortUrl}`);
    const link = await Link.findOne({ shortUrl }).exec();

    if (!link) {
      log.warn(`Link with short url: ${shortUrl} not found`);
      throw new NotFoundError(`Link with short url: ${shortUrl} not found`);
    }

    return link;
  } catch (error: any) {
    log.error(`Error getting original URL for short URL: ${shortUrl}`);
    throw error;
  }
};

export const incrementLinkClicks = async (linkId: string) => {
  try {
    log.info(`Incrementing clicks for link with id: ${linkId}`);
    const link = await Link.findById(linkId);

    if (!link) {
      log.warn(`Link with id: ${linkId} not found`);
      throw new NotFoundError('Link not found');
    }

    link.clickCount += 1;
    await link.save();
    log.info(`Clicks incremented for link with id: ${linkId}`);
  } catch (error: any) {
    log.error(`Error incrementing clicks for link with id: ${linkId}`);
    throw error;
  }
};

export const updateLink = async (
  linkId: string,
  originalUrl?: string,
  shortUrl?: string,
  tags?: string[]
): Promise<ILink> => {
  try {
    log.info(`Updating short link with id: ${linkId}`);
    const link = await Link.findById(linkId);

    if (!link) {
      log.warn(`Link with id: ${linkId} not found`);
      throw new NotFoundError('Link not found');
    }

    if (originalUrl) {
      link.originalUrl = originalUrl;
    }

    if (shortUrl) {
      const existingLink = await Link.findOne({ shortUrl });

      if (existingLink) {
        log.warn(`Short URL: ${shortUrl} is already in use`);
        throw new ConflictError('Short URL already in use');
      }

      link.shortUrl = shortUrl;
    }

    if (tags) {
      link.tags = tags;
    }

    await link.save();
    log.info(
      `Short link with id: ${linkId} updated to new short URL: ${shortUrl}`
    );

    return link;
  } catch (error: any) {
    log.error(`Error updating short link with id: ${linkId}: ${error.message}`);
    throw error;
  }
};

export const updateShortLink = async (
  userId: string,
  linkId: string,
  newShortUrl: string
): Promise<ILink> => {
  try {
    log.info(
      `Updating short link for user with id: ${userId} and link id: ${linkId}`
    );

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(linkId)
    ) {
      log.error('Invalid user ID or link ID format');
      throw new ValidationError('Invalid user ID or link ID format');
    }

    const link = await Link.findById(linkId);
    if (!link) {
      log.warn(`Link with id: ${linkId} not found`);
      throw new NotFoundError('Link not found');
    }

    const user = await getUserById(userId);

    if (
      user &&
      user.role === UserRole.User &&
      link.createdBy.toString() !== userId
    ) {
      log.warn(
        `User with id: ${userId} is not authorized to update link with id: ${linkId}`
      );
      throw new AuthorizationError('Unauthorized');
    }

    if (
      user &&
      user.role === UserRole.BrandUser &&
      link.brand &&
      link.brand !== user.brand
    ) {
      log.warn(
        `User with id: ${userId} is not authorized to update link with id: ${linkId}`
      );
      throw new AuthorizationError('Unauthorized');
    }

    const existingLink = await Link.findOne({ shortUrl: newShortUrl });
    if (existingLink) {
      log.warn(`Short URL: ${newShortUrl} is already in use`);
      throw new ConflictError('Short URL already in use');
    }

    link.shortUrl = newShortUrl;
    await link.save();
    log.info(
      `Short link with id: ${linkId} updated to new short URL: ${newShortUrl}`
    );

    return link;
  } catch (error: any) {
    log.error(
      `Error updating short link for user with id: ${userId}: ${error.message}`
    );
    throw error;
  }
};

export const updateTags = async (linkId: string, tags: string[]) => {
  try {
    log.info(`Updating tags for link with id: ${linkId}`);
    const link = await Link.findById(linkId);

    if (!link) {
      log.warn(`Link with id: ${linkId} not found`);
      throw new NotFoundError('Link not found');
    }

    link.tags = tags;
    await link.save();
    log.info(`Tags updated for link with id: ${linkId}`);
  } catch (error: any) {
    log.error(`Error updating tags for link with id: ${linkId}`);
    throw error;
  }
};

export const bulkCreateShortLinks = async (
  userId: string,
  fileBuffer: Buffer,
  fileName: string
): Promise<void> => {
  const links: BulkLinkData[] = extractLinksFromFile(fileBuffer, fileName);

  if (!Array.isArray(links) || links.length === 0) {
    throw new Error('No links provided');
  }
  try {
    const shortLinkPromises = links.map(link =>
      createShortLink(userId, link.originalUrl, link.prefix, link.suffix, [
        link.linkTag1 ?? '',
        link.linkTag2 ?? '',
        link.linkTag3 ?? '',
        link.linkTag4 ?? '',
        link.linkTag5 ?? '',
      ])
    );

    await Promise.all(shortLinkPromises).then(() => {
      log.info(
        `File successfully uploaded for user ${userId} and filename: ${fileName}`
      );
    });
  } catch (error: any) {
    log.error('Error while uploading bulk');
    throw error;
  }
};

export const deleteLink = async (userId: string, linkId: string) => {
  try {
    log.info(`Deleting link with id: ${linkId} for user with id: ${userId}`);

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(linkId)
    ) {
      log.error('Invalid user ID or link ID format');
      throw new ValidationError('Invalid user ID or link ID format');
    }

    const link = await Link.findById(linkId);

    if (!link) {
      log.warn(`Link with id: ${linkId} not found`);
      throw new NotFoundError('Link not found');
    }

    await link.remove();
    log.info(`Link with id: ${linkId} deleted for user with id: ${userId}`);
  } catch (error: any) {
    log.error(`Error deleting link with id: ${linkId}`);
    throw error;
  }
};

export const deleteMultipleLinks = async (
  userId: string,
  linkIds: string[]
) => {
  try {
    log.info(
      `Deleting multiple links for user with id: ${userId}: ${linkIds.join()}`
    );

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      log.error('Invalid user ID format');
      throw new ValidationError('Invalid user ID format');
    }

    const links = await Link.find({ _id: { $in: linkIds } });

    if (links.length === 0) {
      log.warn('No links found');
      throw new NotFoundError('Links not found');
    }

    await Link.deleteMany({ _id: { $in: linkIds } });
    log.info(
      `Multiple links deleted for user with id: ${userId}: ${linkIds.join()}`
    );
  } catch (error: any) {
    log.error(`Error deleting multiple links for user with id: ${userId}`);
    throw error;
  }
};
