import mongoose from 'mongoose';
import log from '../utils/logger';
import Link, { ILink } from '../models/Link';
import User from '../models/User';
import { generateShortUrl } from '../utils/urlGenerator';
import { detectTargetSite } from '../utils/urlUtils';
import { extractLinksFromFile } from '../utils/uploadUtils';
import { BulkLinkData } from '../types/interfaces';

export const getAllLinksForUser = async (userId: string) => {
  try {
    log.info(`Fetching all links for user with id: ${userId}`);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      log.error('Invalid user ID format');
      throw new Error('Invalid user ID format');
    }

    const user = await User.findById(userId);
    if (!user) {
      log.warn(`User with id: ${userId} not found`);
      throw new Error('User not found');
    }

    const links = await Link.find({ user: user._id });
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
      throw new Error('User not found');
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
      targetSite,
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
      throw new Error('Invalid user ID or link ID format');
    }

    const link = await Link.findById(linkId);
    if (!link) {
      log.warn(`Link with id: ${linkId} not found`);
      throw new Error('Link not found');
    }

    if (link.user.toString() !== userId) {
      log.warn(
        `User with id: ${userId} is not authorized to update link with id: ${linkId}`
      );
      throw new Error('Unauthorized');
    }

    const existingLink = await Link.findOne({ shortUrl: newShortUrl });
    if (existingLink) {
      log.warn(`Short URL: ${newShortUrl} is already in use`);
      throw new Error('Short URL already in use');
    }
    console.log(newShortUrl, 'newShortUrl');

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

export const getOriginalUrl = async (shortUrl: string): Promise<ILink> => {
  try {
    log.info(`Searching short link for: ${shortUrl}`);
    const link = await Link.findOne({ shortUrl }).exec();

    if (!link) {
      log.warn(`Link with short url: ${shortUrl} not found`);
      throw new Error(`Link with short url: ${shortUrl} not found`);
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
      throw new Error('Link not found');
    }

    link.clicks += 1;
    await link.save();
    log.info(`Clicks incremented for link with id: ${linkId}`);
  } catch (error: any) {
    log.error(`Error incrementing clicks for link with id: ${linkId}`);
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
