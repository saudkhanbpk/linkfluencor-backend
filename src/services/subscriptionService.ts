import Subscription, { ISubscription } from '../models/Subscription';
import { Schema } from 'mongoose';
import log from '../utils/logger';

export const createSubscription = async (
  user: Schema.Types.ObjectId
): Promise<ISubscription> => {
  const subscription = new Subscription({
    user,
  });

  await subscription.save();
  log.info(`Subscription created for user ${user}`);

  return subscription;
};

export const getClicksLeft = async (user: Schema.Types.ObjectId) => {
  log.info(`Get clicks left for user ${user}`);
  const subscription = await Subscription.findOne({ user });

  if (!subscription) {
    log.warn(`No subscription found for user ${user}`);
    return false;
  }
  const clicksLeft = subscription.clicksLimit - subscription.clicksUsed;

  log.info(`User ${user} has ${clicksLeft} clicks left`);

  return clicksLeft;
};

export const incrementClicks = async (user: Schema.Types.ObjectId) => {
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
};
