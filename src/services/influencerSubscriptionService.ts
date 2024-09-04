import Subscription from '../models/InfluencerSubscription';
import { Schema } from 'mongoose';
import log from '../utils/logger';
import { SubscriptionPlan } from '../types/enums';
import { subscriptionPlans } from '../config/subscriptionPlans';

export const createSubscription = async (
  user: Schema.Types.ObjectId,
  plan: SubscriptionPlan
) => {
  try {
    log.info(`Subscribing user ${user} to plan ${plan}`);

    const planDetails = subscriptionPlans[plan];
    const subscription = new Subscription({
      userId: user,
      plan,
      clicksAllowed: planDetails.clicksLimit,
      purchaseDate: new Date(),
      createdBy: user,
    });

    subscription.save();
    log.info(`User ${user} subscribed to plan ${plan}`);

    return subscription;
  } catch (error: any) {
    log.error(
      `Error subscribing user ${user} to plan ${plan}: ${error.message}`
    );
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
    const clicksLeft = subscription.clicksAllowed - subscription.clicksUsed;

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
