import { Schema } from 'mongoose';
import log from '../utils/logger';
import { SubscriptionPlan, UserRole } from '../types/enums';
import * as InfluencerSubscription from './influencerSubscriptionService';
import * as BrandSubscription from './brandSubscriptionService';
import NotFoundError from '../errors/NotFoundError';
import Stripe from 'stripe';

const stripe = new Stripe(
  'sk_test_51LSyHvLXPozpY2goNcCyuV3Nv9jAiuuN1IYIFkMbu7zLddmiYlhIXPO0viSuoEV1ftEcNoZSWh3AU8oBGQld9nit002R41cjAP'
);
const stripef = require('stripe')(
  'pk_test_51LSyHvLXPozpY2goU5k689Qi5EYonsd4d9aUbAW75pJtbF95TXLYjltVyy4oZg4T969JFZl5wOMAvT3HwfwR90Zw00DkhiG5aM'
); //frontend

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

export const processStripeOneTimePayment = async (paymentData: any) => {
  const { email, name, amount, currency, type, card, metadata } = paymentData;

  try {
    // Step 1: Check if customer exists
    let customer = null;
    const existingCustomers = await stripe.customers.list({ email });
    if (existingCustomers?.data?.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Step 2: Create a new customer
      customer = await stripe.customers.create({
        email,
        name,
        metadata,
      });
    }

    // Step 3: Create a payment method
    const paymentMethod = await stripef.paymentMethods.create({
      type: type,
      card: {
        number: card.number,
        exp_month: parseInt(card.exp_month),
        exp_year: parseInt(card.exp_year),
        cvc: card.cvc,
      },
    });

    // Step 4: Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    // Step 5: Set payment method as default
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    // Step 6: Create a one-time payment (Payment Intent)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.floor(amount), // Amount in cents
      currency,
      customer: customer.id,
      payment_method: paymentMethod.id,
      return_url: 'https://example.com/order/123/complete',
      off_session: true,
      confirm: true, // Automatically confirm and charge the payment method
    });

    return {
      success: true,
      paymentIntent,
    };
  } catch (error: any) {
    log.error(`Error processing one-time payment: ${error.message}`);
    throw new Error(error.message);
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
