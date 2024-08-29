import Brand from '../models/Brand';
import { BrandMemberRole } from '../types/enums';
import log from '../utils/logger';

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
