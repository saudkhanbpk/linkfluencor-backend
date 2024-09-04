import { Schema } from 'mongoose';
import log from '../utils/logger';
import { SubscriptionPlan, UserRole } from '../types/enums';
import * as InfluencerSubscription from './influencerSubscriptionService';
import * as BrandSubscription from './brandSubscriptionService';
import NotFoundError from '../errors/NotFoundError';

const SubscriptionService = (role: UserRole) => {
  if (role === UserRole.User) {
    return InfluencerSubscription;
  } else if (role === UserRole.BrandUser) {
    return BrandSubscription;
  } else {
    log.warn(`Role ${role} not found`);
    throw new NotFoundError(`Role ${role} not found`);
  }
};

export const createSubscription = async (
  user: Schema.Types.ObjectId,
  role: UserRole,
  plan: SubscriptionPlan
) => {
  try {
    log.info(`Subscribing user ${user} to plan ${plan}`);

    return SubscriptionService(role).createSubscription(user, plan);
  } catch (error: any) {
    log.error(
      `Error subscribing user ${user} to plan ${plan}: ${error.message}`
    );
    throw error;
  }
};

export const getClicksLeft = async (
  user: Schema.Types.ObjectId,
  role: UserRole
) => {
  try {
    return SubscriptionService(role).getClicksLeft(user);
  } catch (error: any) {
    log.error(`Error getting clicks left for user ${user}: ${error.message}`);
    throw error;
  }
};

export const incrementClicks = async (
  user: Schema.Types.ObjectId,
  role: UserRole
) => {
  try {
    return SubscriptionService(role).incrementClicks(user);
  } catch (error: any) {
    log.error(`Error incrementing clicks for user ${user}: ${error.message}`);
    throw error;
  }
};
