import Subscription, { ISubscription } from '../models/Subscription';
import { getUserById, checkUserBalance } from '../services/userService';
import { Schema } from 'mongoose';
import log from '../utils/logger';
import { SubscriptionPlan } from '../types/enums';
import { subscriptionPlans } from '../config/subscriptionPlans';

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

const updateSubscription = async (
  user: Schema.Types.ObjectId,
  plan: SubscriptionPlan
) => {
  try {
    log.info(`Updating subscription for user ${user} to plan ${plan}`);
    const planDetails = subscriptionPlans[plan];

    const subscription = await Subscription.findOneAndUpdate(
      { user },
      { plan, $inc: { clicksLimit: planDetails.clicksLimit } },
      { new: true }
    );
    log.info(`Subscription updated for user ${user} to plan ${plan}`);

    if (!subscription) {
      throw new Error(`Subscription for user ${user} not found`);
    }

    log.info(`User ${user} successfully subscribed to plan ${plan}`);
    return subscription;
  } catch (error: any) {
    log.error(
      `Error updating subscription for user ${user} to plan ${plan}: ${error.message}`
    );
    throw error;
  }
};

export const subscribe = async (
  user: Schema.Types.ObjectId,
  plan: SubscriptionPlan
) => {
  try {
    log.info(`Subscribing user ${user} to plan ${plan}`);

    const userData = await getUserById(user.toString());
    if (!userData) {
      log.warn(`User with ID ${user} not found`);
      throw new Error(`User with ID ${user} not found`);
    }

    const planDetails = subscriptionPlans[plan];
    checkUserBalance(userData.balance, planDetails.price);

    return await updateSubscription(user, plan);
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
