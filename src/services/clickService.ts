import { Request } from 'express';
import moment from 'moment';
import geoip from 'geoip-lite';
import log from '../utils/logger';
import requestIp from 'request-ip';
import { getOriginalUrl, incrementLinkClicks } from '../services/linkService';
import {
  getClicksLeft,
  incrementClicks,
} from '../services/subscriptionService';
import Click from '../models/Click';
import { ILink } from '../models/Link';

export const handleClick = async (req: Request) => {
  const shortUrl = req.params.link;
  const link = await getOriginalUrl(shortUrl);

  if (!link) {
    log.error('Invalid short url');
    throw new Error('Invalid short url');
  }
  const clicksLeft = getClicksLeft(link.user);

  if (!clicksLeft) {
    log.warn('No clicks left');
    throw new Error('No clicks left');
  }
  await incrementClicks(link.user);
  await incrementLinkClicks(link._id);

  await saveClickInfo(req, shortUrl, link);

  return link.originalUrl;
};

export const saveClickInfo = async (
  req: Request,
  shortUrl: string,
  link: ILink
): Promise<void> => {
  const ipAddress = requestIp.getClientIp(req);
  const geo = geoip.lookup(ipAddress as string);
  const click = new Click({
    link: link._id,
    ipAddress: ipAddress,
    userAgent: req.headers['user-agent'],
    platform: req.headers['sec-ch-ua-platform'] ?? 'Unknown',
    country: geo ? geo.country : 'Unknown',
    referrer: req.headers['referer'] || null,
    shortUrl: shortUrl,
  });

  await click.save();
};

export const getClicksForLink = async (linkId: string) => {
  const clicks = await Click.find({ link: linkId });
  return clicks;
};

export const getClickTrend = async (linkId: string): Promise<number> => {
  const now = moment();
  const startOfToday = now.startOf('day').toDate();
  const startOfThreeDaysAgo = now.subtract(2, 'days').startOf('day').toDate();
  const startOfSixDaysAgo = now.subtract(3, 'days').startOf('day').toDate();
  const endOfSixDaysAgo = now.subtract(3, 'days').endOf('day').toDate();

  log.info(`Calculating click trend for linkId: ${linkId}`);

  const clicksLastThreeDays = await Click.countDocuments({
    link: linkId,
    createdAt: { $gte: startOfThreeDaysAgo, $lt: startOfToday },
  });

  const clicksPreviousThreeDays = await Click.countDocuments({
    link: linkId,
    createdAt: { $gte: startOfSixDaysAgo, $lt: endOfSixDaysAgo },
  });

  if (clicksPreviousThreeDays === 0) {
    return clicksLastThreeDays > 0 ? 100 : 0;
  }

  const trend =
    ((clicksLastThreeDays - clicksPreviousThreeDays) /
      clicksPreviousThreeDays) *
    100;
  return trend;
};
