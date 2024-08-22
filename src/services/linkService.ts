import mongoose from 'mongoose';
import log from '../utils/logger';
import Link, { ILink } from '../models/Link';
import User from '../models/User';
import { generateShortUrl } from '../utils/urlGenerator';
import { detectTargetSite } from '../utils/urlUtils';

export const getAllLinksForUser = async (userId: string) => {
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
};

export const createShortLink = async (
  userId: string,
  originalUrl: string
): Promise<ILink> => {
  log.info(`Creating short link for user with id: ${userId}`);
  const user = await User.findById(userId);

  if (!user) {
    log.warn(`User with id: ${userId} not found`);
    throw new Error('User not found');
  }

  const shortUrl = generateShortUrl();
  const targetSite = detectTargetSite(originalUrl);
  log.info(`Generated short URL: ${shortUrl}`);

  const newLink = new Link({
    user: user._id,
    originalUrl,
    shortUrl,
    targetSite,
  });

  await newLink.save();
  log.info(`Short link created with id: ${newLink._id}`);

  return newLink;
};

export const updateShortLink = async (
  userId: string,
  linkId: string,
  newShortUrl: string
): Promise<ILink> => {
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
};

export const getOriginalUrl = async (shortUrl: string): Promise<ILink> => {
  log.info(`Searching short link for: ${shortUrl}`);
  const link = await Link.findOne({ shortUrl }).exec();

  if (!link) {
    log.warn(`Link with short url: ${shortUrl} not found`);
    throw new Error(`Link with short url: ${shortUrl} not found`);
  }

  return link;
};

export const incrementLinkClicks = async (linkId: string) => {
  log.info(`Incrementing clicks for link with id: ${linkId}`);
  const link = await Link.findById(linkId);

  if (!link) {
    log.warn(`Link with id: ${linkId} not found`);
    throw new Error('Link not found');
  }

  link.clicks += 1;
  await link.save();
  log.info(`Clicks incremented for link with id: ${linkId}`);
};
