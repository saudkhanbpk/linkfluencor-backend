import Subscription, { ISubscription } from '../models/Subscription';
import { Schema } from 'mongoose';
import log from '../utils/logger';

export const createSubscription = async (
  user: Schema.Types.ObjectId
): Promise<ISubscription> => {
  try {
    log.info(`Creating subscription for user ${user}`);
    const subscription = new Subscription({
      user,
    });

    await subscription.save();
    log.info(`Subscription created for user ${user}`);

    return subscription;
  } catch (error: any) {
    log.error(`Error creating subscription for user ${user}: ${error.message}`);
    throw error;
  }
};

export const getClicksLeft = async (user: Schema.Types.ObjectId) => {
  try {
    log.info(`Get clicks left for user ${user}`);
    const subscription = await Subscription.findOne({ user });

    if (!subscription) {
      log.warn(`No subscription found for user ${user}`);
      return false;
    }
    const clicksLeft = subscription.clicksLimit - subscription.clicksUsed;

    log.info(`User ${user} has ${clicksLeft} clicks left`);

    return clicksLeft;
  } catch (error: any) {
    log.error(`Error getting clicks left for user ${user}: ${error.message}`);
    throw error;
  }
};

export const incrementClicks = async (user: Schema.Types.ObjectId) => {
  try {
    log.info(`Incrementing clicks for user ${user}`);
    const subscription = await Subscription.findOne({ user });

    if (!subscription) {
      log.warn(`No subscription found for user ${user}`);
      return false;
    }

    subscription.clicksUsed += 1;
    await subscription.save();
    log.info(`Clicks incremented for user ${user}`);

    return true;
  } catch (error: any) {
    log.error(`Error incrementing clicks for user ${user}: ${error.message}`);
    throw error;
  }
};
