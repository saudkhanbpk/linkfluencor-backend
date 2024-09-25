import { Request, Response, NextFunction } from 'express';
import { handleClick } from '../services/clickService';

export const handleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uriSchemes: { [key: string]: { ios: string; android: string } } = {
      youtube: { ios: 'vnd.youtube:', android: 'vnd.youtube:' },
      amazon: {
        ios: 'com.amazon.mobile.shopping:',
        android: 'com.amazon.mobile.shopping:',
      },
      instagram: {
        ios: 'instagram://',
        android: 'intent://instagram.com/#Intent;package=com.instagram.android;end',
      },
      // Add more app URIs as needed...
    };

    const redirectUrl = await handleClick(req);
    const userAgent = req.headers['user-agent']?.toLowerCase() || '';
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);

    let appName = '';
    if (redirectUrl.includes('instagram.com')) {
      appName = 'instagram';
    } else if (redirectUrl.includes('facebook.com')) {
      appName = 'facebook';
    }
    // Add more conditions for other apps as needed...
    const appUri = uriSchemes[appName]; // Fetch the corresponding URI scheme

    // Redirect logic
    if (isMobile && appUri) {
      // Determine which mobile app link to use based on the user's device
      const mobileAppLink =
        userAgent.includes('iphone') || userAgent.includes('ipad')
          ? appUri.ios
          : appUri.android;
      console.log({ mobileAppLink });

      // Redirect to the mobile app if the application is available
      return res.redirect(mobileAppLink);
    } else {
      // Fallback: Redirect to the original link for desktop users or if app is not found
      return res.redirect(redirectUrl);
    }
  } catch (err) {
    next(err);
  }
};
