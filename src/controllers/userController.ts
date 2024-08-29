import { Request, Response } from 'express';
import {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../services/userService';
import { subscribe, getClicksLeft } from '../services/subscriptionService';
import {
  getClicksByIntervalAndUser,
  getTotalClicksByUser,
  getBestPerformingPlatformByUser,
  getTop5BestPerformingPlatformsByUser,
  getTopCountryByUser,
  getBestCityByUser,
  getBestAverageTimeToEngageByUser,
  getClicksGranularityByUser,
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
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return await subscribe(user._id, req.body.plan);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getClicksLeftController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const clicksLeft = await getClicksLeft(user._id);
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
    const topCountry = await getTopCountryByUser(interval, req.params.id);
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
      interval,
      req.params.id
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
