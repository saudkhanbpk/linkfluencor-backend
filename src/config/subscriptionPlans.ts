import { PlanDetails } from '../types/interfaces';
import { SubscriptionPlan } from '../types/enums';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line no-unused-vars
export const subscriptionPlans: { [key in SubscriptionPlan]: PlanDetails } = {
  [SubscriptionPlan.Free]: {
    price: parseFloat(process.env.PLAN_FREE_PRICE || '0'),
    clicksLimit: parseInt(process.env.PLAN_FREE_CLICKS_LIMIT || '0', 10),
  },
  [SubscriptionPlan.Starter]: {
    price: parseFloat(process.env.PLAN_STARTER_PRICE || '49.99'),
    clicksLimit: parseInt(process.env.PLAN_STARTER_CLICKS_LIMIT || '50000', 10),
  },
  [SubscriptionPlan.Grow]: {
    price: parseFloat(process.env.PLAN_GROW_PRICE || '99.99'),
    clicksLimit: parseInt(process.env.PLAN_GROW_CLICKS_LIMIT || '100000', 10),
  },
  [SubscriptionPlan.Scale]: {
    price: parseFloat(process.env.PLAN_SCALE_PRICE || '199.99'),
    clicksLimit: parseInt(process.env.PLAN_SCALE_CLICKS_LIMIT || '250000', 10),
  },
};
