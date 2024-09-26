import Subscription from '../models/BrandSubscription';
import { Schema } from 'mongoose';
import log from '../utils/logger';
import { SubscriptionPlan } from '../types/enums';
import { subscriptionPlans } from '../config/subscriptionPlans';
import { getBrandByUser, getBrandSubscriptionByUser } from './brandService';

export const createSubscription = async (
  user: Schema.Types.ObjectId,
  plan: SubscriptionPlan
) => {
  try {
    log.info(`Subscribing brand ${user} to plan ${plan}`);

    // Fetch existing subscription for the brand, if it exists
    const existingSubscription = await getBrandSubscriptionByUser(user);

    // Get brand details (e.g., brandId)
    const brand = await getBrandByUser(user);

    // Get plan details (e.g., clicksLimit)
    const planDetails = subscriptionPlans[plan];

    let totalClicksAllowed = planDetails.clicksLimit; // New clicks limit

    // If an existing subscription is found, add current clicksAllowed to the new clicksLimit
    if (existingSubscription) {
      log.info(
        `Existing subscription found for brand ${brand.id}, updating clicksAllowed.`
      );
      totalClicksAllowed += existingSubscription.clicksAllowed; // Add current clicksAllowed
      existingSubscription.clicksAllowed = totalClicksAllowed; // Update clicksAllowed
      existingSubscription.plan = plan; // Update plan
      existingSubscription.purchaseDate = new Date(); // Update the purchase date

      // Save the updated subscription
      await existingSubscription.save();

      log.info(
        `Brand ${brand.id} updated to plan ${plan} with ${totalClicksAllowed} clicks allowed`
      );
      return existingSubscription;
    } else {
      // If no existing subscription, create a new one
      const newSubscription = new Subscription({
        brandId: brand.id,
        plan,
        clicksAllowed: totalClicksAllowed,
        purchaseDate: new Date(),
        createdBy: user,
      });

      // Save the new subscription
      await newSubscription.save();

      log.info(
        `Brand ${brand.id} subscribed to plan ${plan} with ${totalClicksAllowed} clicks allowed`
      );
      return newSubscription;
    }
  } catch (error: any) {
    log.error(`Error subscribing brand  to plan ${plan}: ${error.message}`);
    throw error;
  }
};

export const getClicksLeft = async (user: Schema.Types.ObjectId) => {
  try {
    log.info(`Get clicks left for user ${user}`);
    const brand = await getBrandByUser(user);
    const subscription = await Subscription.findOne({ brand });

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
    const brand = await getBrandByUser(user);
    const subscription = await Subscription.findOne({ brand });

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
