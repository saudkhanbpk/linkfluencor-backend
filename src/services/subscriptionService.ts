import Subscription, { ISubscription } from '../models/Subscription';
import { Schema } from 'mongoose';
import log from '../utils/logger';

class SubscriptionService {
  static async createSubscription(
    user: Schema.Types.ObjectId
  ): Promise<ISubscription> {
    const subscription = new Subscription({
      user,
    });

    await subscription.save();
    log.info(`Subscription created for user ${user}`);

    return subscription;
  }
}

export default SubscriptionService;
