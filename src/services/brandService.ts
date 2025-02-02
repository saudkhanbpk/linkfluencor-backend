import { Schema } from 'mongoose';
import Brand from '../models/Brand';
import { BrandMemberRole } from '../types/enums';
import log from '../utils/logger';
import ValidationError from '../errors/ValidationError';
import NotFoundError from '../errors/NotFoundError';
import BrandSubscriptionSchema from '../models/BrandSubscription';

export const createBrand = (userId: string) => {
  try {
    log.info('Creating brand');

    const brand = new Brand({
      name: null,
      mainUser: userId,
      members: [{ user: userId, role: BrandMemberRole.Admin }],
    });
    log.info(`Brand created: ${brand._id}`);

    return brand;
  } catch (error: any) {
    log.error(`Error creating brand: ${error.message}`);
    throw error;
  }
};

export const handleBrandAssociation = async (
  brandName: string,
  brandEmail: string
) => {
  log.info('Associating brand');
  if (!brandName || !brandEmail) {
    log.error('Brand name and brand email are required to associate a brand');
    throw new ValidationError(
      'Brand name and brand email are required to create a new brand'
    );
  }

  const brand = new Brand({
    name: brandName,
    email: brandEmail,
  });

  await brand.save();
  log.info(`Brand created: ${brand.name}`);

  return brand;
};

export const addUserToBrand = async (
  userId: Schema.Types.ObjectId,
  brandId: Schema.Types.ObjectId,
  role: BrandMemberRole,
  addedBy: Schema.Types.ObjectId
) => {
  try {
    log.info(`Adding user to brand: ${userId}`);
    const brand = await Brand.findById(brandId);
    if (!brand) {
      log.error(`Brand not found: ${brandId}`);
      throw new NotFoundError('Brand not found');
    }
    brand.members.push({ userId, role, addedBy });
    await brand.save();
    log.info(`User added to brand: ${userId}`);
  } catch (error: any) {
    log.error(`Error adding user to brand: ${error.message}`);
    throw error;
  }
};

export const getBrandByUser = async (userId: Schema.Types.ObjectId) => {
  try {
    log.info(`Fetching brand by user ID: ${userId}`);
    const brand = await Brand.findOne({ 'members.userId': userId });
    if (!brand) {
      log.warn(`Brand not found for user ID: ${userId}`);
      throw new NotFoundError('Brand not found');
    }
    log.info(`Brand found for user ID: ${userId}`);
    return brand;
  } catch (error: any) {
    log.error(`Error fetching brand by user ID: ${error.message}`);
    throw error;
  }
};

export const getBrandSubscriptionByUser = async (
  userId: Schema.Types.ObjectId
) => {
  try {
    log.info(`Fetching brand subscription by user ID: ${userId}`);
    const brandSubscription = await BrandSubscriptionSchema.findOne({
      createdBy: userId,
    })
      .populate('createdBy')
      .populate('brandId');

    if (!brandSubscription) {
      log.warn(`Brand subscription not found for user ID: ${userId}`);
      throw new NotFoundError('Brand subscription not found');
    }

    log.info(`Brand subscription found for user ID: ${userId}`);
    return brandSubscription;
  } catch (error: any) {
    log.error(`Error fetching brand subscription by user ID: ${error.message}`);
    throw error;
  }
};
