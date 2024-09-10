import { Request } from 'express';
import moment from 'moment';
import geoip from 'geoip-lite';
import log from '../utils/logger';
import requestIp from 'request-ip';
import {
  getAllLinksForUser,
  getOriginalUrl,
  incrementLinkClicks,
} from '../services/linkService';
import {
  getClicksLeft,
  incrementClicks,
} from '../services/subscriptionService';
import Click from '../models/Click';
import { ILink } from '../interfaces/Link';
import { getUserById } from '../services/userService';
import { TimeInterval, TimeGranularity } from '../types/types';
import { IClick } from 'interfaces/Click';
import NotFoundError from '../errors/NotFoundError';
import ConflictError from '../errors/ConflictError';

export const handleClick = async (req: Request) => {
  try {
    log.info('Handling click');
    const shortUrl = req.params.link;
    const link = await getOriginalUrl(shortUrl);

    if (!link) {
      log.error('Invalid short url');
      throw new NotFoundError('Invalid short url');
    }

    const user = await getUserById(link.createdBy.toString());
    if (!user) {
      log.error('Invalid user');
      throw new NotFoundError('Invalid user');
    }

    const clicksLeft = await getClicksLeft(link.createdBy, user.role);

    if (!clicksLeft) {
      log.warn('No clicks left');
      throw new ConflictError('No clicks left');
    }
    await incrementClicks(link.createdBy, user.role);
    await incrementLinkClicks(link._id);

    await saveClickInfo(req, shortUrl, link);

    return link.originalUrl;
  } catch (error: any) {
    log.error(`Error handling click: ${error.message}`);
    throw error;
  }
};

export const saveClickInfo = async (
  req: Request,
  shortUrl: string,
  link: ILink
): Promise<void> => {
  try {
    log.info('Saving click info');
    const ipAddress = requestIp.getClientIp(req);
    const geo = geoip.lookup(ipAddress as string);
    const click = new Click({
      linkId: link._id,
      ipAddress: ipAddress,
      userAgent: req.headers['user-agent'],
      platform: req.headers['sec-ch-ua-platform'] ?? 'Unknown',
      country: geo ? geo.country : 'Unknown',
      city: geo ? geo.city : 'Unknown',
      referrer: req.headers['referer'] || null,
      shortUrl: shortUrl,
    });

    await click.save();
  } catch (error: any) {
    log.error(`Error saving click info: ${error.message}`);
    throw error;
  }
};

export const getTopCountryByLink = async (linkId: string): Promise<string> => {
  try {
    log.info(`Getting top country for link: ${linkId}`);
    const clicks = await Click.find({ linkId });

    if (clicks.length === 0) {
      return 'Unknown';
    }

    const countryCounts = clicks.reduce(
      (acc, click) => {
        acc[click.country] = (acc[click.country] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.keys(countryCounts).reduce((a, b) =>
      countryCounts[a] > countryCounts[b] ? a : b
    );
  } catch (error: any) {
    log.error(`Error getting top country for link: ${linkId}`);
    throw error;
  }
};

export const getTopCityByLink = async (linkId: string): Promise<string> => {
  try {
    log.info(`Getting top city for link: ${linkId}`);
    const clicks = await Click.find({ linkId });

    if (clicks.length === 0) {
      return 'Unknown';
    }

    const cityCounts = clicks.reduce(
      (acc, click) => {
        acc[click.city] = (acc[click.city] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.keys(cityCounts).reduce((a, b) =>
      cityCounts[a] > cityCounts[b] ? a : b
    );
  } catch (error: any) {
    log.error(`Error getting top city for link: ${linkId}`);
    throw error;
  }
};

export const getBestAverageTimeToEngageByLink = async (
  linkId: string
): Promise<number> => {
  try {
    log.info(`Getting best average time to engage for link: ${linkId}`);
    const clicks = await Click.find({ linkId });

    if (clicks.length === 0) {
      return 0;
    }

    const engagementTimes = clicks.map(click => click.clickedAt.getTime());
    const intervals = engagementTimes.map(time =>
      Math.floor(time / (3 * 60 * 60 * 1000))
    );

    const intervalCounts = intervals.reduce(
      (acc, interval) => {
        acc[interval] = (acc[interval] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    const bestInterval = Object.keys(intervalCounts).reduce((a, b) =>
      intervalCounts[parseInt(a)] > intervalCounts[parseInt(b)] ? a : b
    );
    return parseInt(bestInterval) * 3;
  } catch (error: any) {
    log.error(`Error getting best average time to engage for link: ${linkId}`);
    throw error;
  }
};

export const getClicksByIntervalAndLinkId = (
  interval: TimeInterval,
  linkId: string
) => {
  try {
    log.info(`Getting clicks for link: ${linkId} in interval: ${interval}`);
    const now = moment();
    const startOfInterval = now.startOf(interval).toDate();
    const endOfInterval = now.endOf(interval).toDate();

    return Click.find({
      linkId,
      clickedAt: { $gte: startOfInterval, $lt: endOfInterval },
    });
  } catch (error: any) {
    log.error(
      `Error getting clicks for link: ${linkId} in interval: ${interval}`
    );
    throw error;
  }
};

export const getClicksGranularityByLink = async (
  linkId: string,
  granularity: TimeGranularity
) => {
  try {
    log.info(`Getting clicks by granularity for link: ${linkId}`);
    const clicks = await Click.find({ linkId });

    if (clicks.length === 0) {
      return 'Unknown';
    }

    const formatMap = {
      hour: 'HH',
      day: 'dddd',
      week: 'WW',
      month: 'MM',
    };

    const format = formatMap[granularity];
    const counts = clicks.reduce(
      (acc, click) => {
        const key = moment(click.clickedAt).format(format);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return counts;
  } catch (error: any) {
    log.error(`Error getting clicks by granularity for link: ${linkId}`);
    throw error;
  }
};

export const getClicksForLink = async (linkId: string) => {
  try {
    log.info(`Getting clicks for link: ${linkId}`);
    const clicks = await Click.find({ linkId });
    return clicks;
  } catch (error: any) {
    log.error(`Error getting clicks for link: ${linkId}`);
    throw error;
  }
};

export const getLinkClicksTrend = async (linkId: string): Promise<number> => {
  try {
    const now = moment();
    const startOfToday = now.startOf('day').toDate();
    const startOfThreeDaysAgo = now.subtract(2, 'days').startOf('day').toDate();
    const startOfSixDaysAgo = now.subtract(3, 'days').startOf('day').toDate();
    const endOfSixDaysAgo = now.subtract(3, 'days').endOf('day').toDate();

    log.info(`Calculating click trend for linkId: ${linkId}`);

    const clicksLastThreeDays = await Click.countDocuments({
      linkId,
      createdAt: { $gte: startOfThreeDaysAgo, $lt: startOfToday },
    });

    const clicksPreviousThreeDays = await Click.countDocuments({
      linkId,
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
  } catch (error: any) {
    log.error(`Error calculating click trend for linkId: ${linkId}`);
    throw error;
  }
};

export const getClicksByIntervalAndUser = async (
  interval: TimeInterval,
  userId: string
) => {
  try {
    log.info(`Getting clicks for user: ${userId} in interval: ${interval}`);
    const now = moment();
    const startOfInterval = now.startOf(interval).toDate();
    const endOfInterval = now.endOf(interval).toDate();

    const user = await getUserById(userId);

    if (!user) {
      log.error(`User not found: ${userId}`);
      throw new NotFoundError('Invalid user');
    }
    const userLinks = await getAllLinksForUser(userId);

    let clicks: IClick[] = [];

    for (const link of userLinks) {
      const linkClicks = await Click.find({
        linkId: link._id,
        clickedAt: { $gte: startOfInterval, $lt: endOfInterval },
      });
      clicks = clicks.concat(linkClicks);
    }

    return clicks;
  } catch (error: any) {
    log.error(
      `Error getting clicks for user: ${userId} in interval: ${interval}`
    );
    throw error;
  }
};

export const getTotalClicksByUser = async (
  interval: TimeInterval,
  userId: string
): Promise<number> => {
  try {
    log.info(
      `Getting total clicks for user: ${userId} in interval: ${interval}`
    );
    const clicks = await getClicksByIntervalAndUser(interval, userId);
    return clicks.length;
  } catch (error: any) {
    log.error(
      `Error getting total clicks for user: ${userId} in interval: ${interval}`
    );
    throw error;
  }
};

export const getBestPerformingPlatformByUser = async (
  interval: TimeInterval,
  userId: string
): Promise<string> => {
  try {
    log.info(`Getting best performing platform for user: ${userId}`);
    const clicks = await getClicksByIntervalAndUser(interval, userId);

    if (clicks.length === 0) {
      return 'Unknown';
    }

    const platformCounts = clicks.reduce(
      (acc, click) => {
        acc[click.platform] = (acc[click.platform] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.keys(platformCounts).reduce((a, b) =>
      platformCounts[a] > platformCounts[b] ? a : b
    );
  } catch (error: any) {
    log.error(
      `Error getting best performing platform for user: ${userId} in interval: ${interval}`
    );
    throw error;
  }
};

export const getTop5BestPerformingPlatformsByUser = async (
  interval: TimeInterval,
  userId: string
): Promise<string[]> => {
  try {
    log.info(`Getting top 5 best performing platforms for user: ${userId}`);
    const clicks = await getClicksByIntervalAndUser(interval, userId);

    if (clicks.length === 0) {
      return [];
    }

    const platformCounts = clicks.reduce(
      (acc, click) => {
        acc[click.platform] = (acc[click.platform] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(platformCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([platform]) => platform);
  } catch (error: any) {
    log.error(
      `Error getting top 5 best performing platforms for user: ${userId} in interval: ${interval}`
    );
    throw error;
  }
};

export const getTopCountryByUser = async (
  interval: TimeInterval,
  userId: string
): Promise<string> => {
  try {
    log.info(`Getting top country for user: ${userId}`);
    const clicks = await getClicksByIntervalAndUser(interval, userId);

    if (clicks.length === 0) {
      return 'Unknown';
    }

    const countryCounts = clicks.reduce(
      (acc, click) => {
        acc[click.country] = (acc[click.country] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.keys(countryCounts).reduce((a, b) =>
      countryCounts[a] > countryCounts[b] ? a : b
    );
  } catch (error: any) {
    log.error(
      `Error getting top country for user: ${userId} in interval: ${interval}`
    );
    throw error;
  }
};

export const getBestCityByUser = async (
  interval: TimeInterval,
  userId: string
): Promise<string> => {
  try {
    log.info(`Getting best city for user: ${userId}`);
    const clicks = await getClicksByIntervalAndUser(interval, userId);

    if (clicks.length === 0) {
      return 'Unknown';
    }

    const cityCounts = clicks.reduce(
      (acc, click) => {
        acc[click.city] = (acc[click.city] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.keys(cityCounts).reduce((a, b) =>
      cityCounts[a] > cityCounts[b] ? a : b
    );
  } catch (error: any) {
    log.error(
      `Error getting best city for user: ${userId} in interval: ${interval}`
    );
    throw error;
  }
};

export const getBestAverageTimeToEngageByUser = async (
  interval: TimeInterval,
  userId: string
): Promise<number> => {
  try {
    log.info(`Getting best average time to engage for user: ${userId}`);
    const clicks = await getClicksByIntervalAndUser(interval, userId);

    if (clicks.length === 0) {
      return 0;
    }

    const engagementTimes = clicks.map(click => click.clickedAt.getTime());
    const intervals = engagementTimes.map(time =>
      Math.floor(time / (3 * 60 * 60 * 1000))
    );

    const intervalCounts = intervals.reduce(
      (acc, interval) => {
        acc[interval] = (acc[interval] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    const bestInterval = Object.keys(intervalCounts).reduce((a, b) =>
      intervalCounts[parseInt(a)] > intervalCounts[parseInt(b)] ? a : b
    );
    return parseInt(bestInterval) * 3;
  } catch (error: any) {
    log.error(
      `Error getting best average time to engage for user: ${userId} in interval: ${interval}`
    );
    throw error;
  }
};

export const getClicksGranularityByUser = async (
  interval: TimeInterval,
  userId: string,
  granularity: TimeGranularity
): Promise<Record<string, number>> => {
  try {
    log.info(
      `Getting clicks by granularity for user: ${userId} in interval: ${interval}`
    );
    const clicks = await getClicksByIntervalAndUser(interval, userId);

    if (clicks.length === 0) {
      return {};
    }

    const formatMap = {
      hour: 'HH',
      day: 'dddd',
      week: 'WW',
      month: 'MM',
    };

    const format = formatMap[granularity];
    const counts = clicks.reduce(
      (acc, click) => {
        const key = moment(click.clickedAt).format(format);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return counts;
  } catch (error: any) {
    log.error(
      `Error getting clicks by granularity for user: ${userId} in interval: ${interval}`
    );
    throw error;
  }
};
