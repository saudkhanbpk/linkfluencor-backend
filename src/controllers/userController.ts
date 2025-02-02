import { Request, Response } from 'express';
import {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  inviteToBrand,
  updatePassword,
  getProfileCompletion,
} from '../services/userService';
import {
  createSubscription,
  getClicksLeft,
  processStripeOneTimePayment,
} from '../services/subscriptionService';
import {
  getClicksByIntervalAndUser,
  getTotalClicksByUser,
  getBestPerformingPlatformByUser,
  getTop5BestPerformingPlatformsByUser,
  getTopCountriesByUser,
  getBestCityByUser,
  getBestAverageTimeToEngageByUser,
  getClicksGranularityByUser,
  getFormattedClicksByIntervalAndUser,
} from '../services/clickService';
import { TimeGranularity, TimeInterval } from '../types/types';

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const deletedUser = await deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const subscribeUserController = async (req: Request, res: Response) => {
  try {
    // Fetch the user by ID
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract Stripe token data from the request body
    const { email, name, metadata, amount, currency, type, card } =
      req.body.stripeToken;

    // Call the function for handling Stripe one-time payment logic
    const stripeResponse = await processStripeOneTimePayment({
      email,
      name,
      metadata,
      amount,
      currency,
      type,
      card,
    });

    // Create a subscription record in your system (or just save the payment record)
    await createSubscription(user.id, user.role, req.body.plan);

    // Respond with success and payment details
    return res.status(200).json({
      message: 'Payment processed successfully',
      payment: stripeResponse.paymentIntent,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error });
  }
};

export const getClicksLeftController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const clicksLeft = await getClicksLeft(user.id, user.role);
    res.json({ clicksLeft });
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getClicksByIntervalAndUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const interval = req.query.interval as TimeInterval;
    const clicks = await getClicksByIntervalAndUser(interval, req.params.id);
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getTotalClicksByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const interval = req.query.interval as TimeInterval;
    const clicks = await getTotalClicksByUser(interval, req.params.id);
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getBestPerformingPlatformByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const interval = req.query.interval as TimeInterval;
    const platform = await getBestPerformingPlatformByUser(
      interval,
      req.params.id
    );
    res.json(platform);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getTop5BestPerformingPlatformsByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const interval = req.query.interval as TimeInterval;
    const platforms = await getTop5BestPerformingPlatformsByUser(
      interval,
      req.params.id
    );
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getTopCountryByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const interval = req.query.interval as TimeInterval;
    const topCountry = await getTopCountriesByUser(interval, req.params.id);
    res.json(topCountry);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getBestCityByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const interval = req.query.interval as TimeInterval;
    const topCity = await getBestCityByUser(interval, req.params.id);
    res.json(topCity);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getBestAverageTimeToEngageByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const interval = req.query.interval as TimeInterval;
    const bestAverageTimeToEngage = await getBestAverageTimeToEngageByUser(
      req.params.id,
      interval
    );
    res.json(bestAverageTimeToEngage);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getClicksGranularityByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const interval = req.query.interval as TimeInterval;
    const granularity = req.query.granularity as TimeGranularity;
    const clicks = await getClicksGranularityByUser(
      interval,
      req.params.id,
      granularity
    );
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const inviteToBrandController = async (req: Request, res: Response) => {
  try {
    return await inviteToBrand(
      req.params.id,
      req.body.brandId,
      req.body.email,
      req.body.role
    );
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const updatePasswordController = async (req: Request, res: Response) => {
  try {
    return await updatePassword(
      req.params.id,
      req.body.newPassword,
      req.body.oldPassword
    );
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getFormattedClicksByIntervalAndUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const interval = req.query.interval as TimeInterval;
    const clicks = await getFormattedClicksByIntervalAndUser(
      req.params.id,
      interval
    );
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getProfileCompletionController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.id;

    const profileCompletion = await getProfileCompletion(userId);
    res.json(profileCompletion);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};
