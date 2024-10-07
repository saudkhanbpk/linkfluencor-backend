import Subscription from '../models/InfluencerSubscription';
import { Schema } from 'mongoose';
import log from '../utils/logger';
import { SubscriptionPlan } from '../types/enums';
import { subscriptionPlans } from '../config/subscriptionPlans';
import InfluencerSubscriptionSchema from '../models/InfluencerSubscription';

export const createSubscription = async (
  user: Schema.Types.ObjectId,
  plan: SubscriptionPlan
) => {
  try {
    log.info(`Subscribing user ${user} to plan ${plan}`);

    // Fetch existing subscription for the user, if it exists
    const existingSubscription = await getInfluencerSubscriptionByUser(user);

    // Get plan details (e.g., clicksLimit)
    const planDetails = subscriptionPlans[plan];
    let totalClicksAllowed = planDetails.clicksLimit; // New clicks limit

    // If an existing subscription is found, add current clicksAllowed to the new clicksLimit
    if (existingSubscription) {
      log.info(
        `Existing subscription found for user ${user}, updating clicksAllowed.`
      );
      totalClicksAllowed += existingSubscription.clicksAllowed; // Add current clicksAllowed
      existingSubscription.clicksAllowed = totalClicksAllowed; // Update clicksAllowed
      existingSubscription.plan = plan; // Update plan
      existingSubscription.purchaseDate = new Date(); // Update the purchase date

      // Save the updated subscription
      await existingSubscription.save();

      log.info(
        `User ${user} updated to plan ${plan} with ${totalClicksAllowed} clicks allowed`
      );
      return existingSubscription;
    } else {
      // If no existing subscription, create a new one
      const newSubscription = new InfluencerSubscriptionSchema({
        userId: user,
        plan,
        clicksAllowed: totalClicksAllowed,
        purchaseDate: new Date(),
        createdBy: user,
      });

      // Save the new subscription
      await newSubscription.save();

      log.info(
        `User ${user} subscribed to plan ${plan} with ${totalClicksAllowed} clicks allowed`
      );
      return newSubscription;
    }
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
    const subscription = await Subscription.findOne({ userId: user });

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
    const subscription = await Subscription.findOne({ userId: user });

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

export const getInfluencerSubscriptionByUser = async (
  userId: Schema.Types.ObjectId
) => {
  try {
    log.info(`Fetching influencer subscription by user ID: ${userId}`);

    // Fetch the subscription using the userId field
    const influencerSubscription = await InfluencerSubscriptionSchema.findOne({
      userId: userId,
    });

    if (!influencerSubscription) {
      log.warn(`Influencer subscription not found for user ID: ${userId}`);
      return null; // Return null instead of throwing an error if no subscription is found
    }

    log.info(`Influencer subscription found for user ID: ${userId}`);
    return influencerSubscription;
  } catch (error: any) {
    log.error(
      `Error fetching influencer subscription by user ID: ${error.message}`
    );
    throw error;
  }
};
