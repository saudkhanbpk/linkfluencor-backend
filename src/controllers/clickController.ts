import { Request, Response, NextFunction } from 'express';
import { handleClick } from '../services/clickService';
import { uriSchemes } from '../utils/uriSchemes';

export const handleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Handle click and get the original URL (fallback URL for desktop)
    const redirectUrl = await handleClick(req);
    
    // Detect the user agent and device type
    const userAgent = req.headers['user-agent']?.toLowerCase() || '';
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isAndroid = /android/i.test(userAgent);

    // Determine the app name based on the redirect URL
    let appName = '';
    if (redirectUrl.includes('instagram.com')) {
      appName = 'instagram';
    } else if (redirectUrl.includes('facebook.com')) {
      appName = 'facebook';
    }
    // Add more app checks as needed...

    // Get the URI schemes for the identified app
    const appUriScheme = uriSchemes[appName];

    // If it's a mobile device and we have an app URI scheme
    if (isMobile && appUriScheme) {
      let appUri = '';

      // Select the correct URI for iOS or Android
      if (isIOS) {
        appUri = appUriScheme.ios;
      } else if (isAndroid) {
        appUri = appUriScheme.android;
      }

      // If we have a valid mobile app URI, attempt to open the app
      if (appUri) {
        // Respond with the mobile app redirection
        return res.redirect(appUri);
      }
    }

    // Fallback to website for desktop users or if no app URI is available
    return res.redirect(redirectUrl);

  } catch (err) {
    next(err);
  }
};
