import { Request, Response, NextFunction } from 'express';
import { handleClick } from '../services/clickService';

const appLinkMappings = [
  {
    name: 'Instagram',
    urlPattern:
      /https:\/\/(www\.)?instagram\.com\/(reel\/([^/?#&]+)|p\/([^/?#&]+)|([^/?#&]+))/,
    appScheme: (match: string[]) => {
      if (match[5]) {
        return `instagram://user?username=${match[5]}`;
      }
      return `instagram://media?id=${match[3] || match[4]}`;
    },
    webFallback: (match: string[]) => `https://www.instagram.com/${match[2]}`,
  },
  {
    name: 'YouTube',
    urlPattern:
      /https:\/\/(www\.)?youtube\.com\/(watch\?v=[^&]+|channel\/[^/?#&]+|playlist\/[^/?#&]+)/,
    appScheme: (match: string[]) => {
      if (match[2].startsWith('watch?v=')) {
        const videoId = match[2].split('v=')[1];
        return `vnd.youtube://${videoId}`; // Deep link for YouTube videos in the app
      }
      return `https://www.youtube.com/${match[2]}`; // Web fallback for channels and playlists
    },
    webFallback: (match: string[]) => `https://www.youtube.com/${match[2]}`,
  },
  {
    name: 'Facebook',
    urlPattern:
      /https:\/\/(www\.)?facebook\.com\/(posts\/[^/?#&]+|pages\/[^/?#&]+|[^/?#&]+)/,
    appScheme: (match: string[]) =>
      `fb://facewebmodal/f?href=${encodeURIComponent(match[0])}`,
    webFallback: (match: string[]) => `https://www.facebook.com/${match[2]}`,
  },
  {
    name: 'LinkedIn',
    urlPattern:
      /https:\/\/(www\.)?linkedin\.com\/(in\/[^/?#&]+|company\/[^/?#&]+|jobs\/view\/[^/?#&]+|posts\/[^/?#&]+)/,
    appScheme: (match: string[]) => {
      if (match[2].startsWith('in/')) {
        return `linkedin://in/${match[2].split('/')[1]}`; // Deep link for profiles
      }
      return `https://www.linkedin.com/${match[2]}`; // Web fallback for jobs, posts, company pages
    },
    webFallback: (match: string[]) => `https://www.linkedin.com/${match[2]}`,
  },
  {
    name: 'X (Twitter)',
    urlPattern:
      /https:\/\/(www\.)?twitter\.com\/(i\/status\/([^/?#&]+)|hashtag\/([^/?#&]+)|([^/?#&]+))/,
    appScheme: (match: string[]) => {
      if (match[3]) return `twitter://status/${match[3]}`;
      if (match[4]) return `twitter://hashtag/${match[4]}`;
      return `twitter://user?screen_name=${match[5]}`;
    },
    webFallback: (match: string[]) => `https://www.twitter.com/${match[2]}`,
  },
  {
    name: 'TikTok',
    urlPattern:
      /https:\/\/(www\.)?tiktok\.com\/(@[^/?#&]+\/video\/([^/?#&]+)|(@[^/?#&]+)|([^/?#&]+))/,
    appScheme: (match: string[]) => {
      if (match[3]) {
        return `snssdk1128://aweme/detail/${match[3]}`; // TikTok video deep link
      }
      if (match[4]) {
        return `snssdk1128://user/profile/${match[4].replace('@', '')}`; // TikTok profile deep link
      }
      return `snssdk1128://feed`; // Fallback to TikTok feed in app
    },
    webFallback: (match: string[]) => `https://www.tiktok.com/${match[2]}`,
  },
  {
    name: 'Snapchat',
    urlPattern:
      /https:\/\/(www\.)?snapchat\.com\/(add\/([^/?#&]+)|story\/([^/?#&]+))/,
    appScheme: (match: string[]) => {
      if (match[3]) {
        return `snapchat://add/${match[3]}`; // Snapchat profile deep link
      }
      if (match[4]) {
        return `snapchat://story/${match[4]}`; // Snapchat story deep link
      }
      return `snapchat://`; // Fallback to Snapchat app
    },
    webFallback: (match: string[]) => `https://www.snapchat.com/${match[2]}`, // Web fallback
  },
  {
    name: 'Telegram',
    urlPattern: /https:\/\/(www\.)?t\.me\/([^/?#&]+)/,
    appScheme: (match: string[]) => `tg://resolve?domain=${match[2]}`, // Telegram deep link for profiles/channels
    webFallback: (match: string[]) => `https://t.me/${match[2]}`, // Web fallback
  },
  {
    name: 'Spotify',
    urlPattern:
      /https:\/\/(open\.)?spotify\.com\/(track\/([^/?#&]+)|album\/([^/?#&]+)|playlist\/([^/?#&]+)|user\/([^/?#&]+))/,
    appScheme: (match: string[]) => {
      if (match[3]) return `spotify://track/${match[3]}`; // Spotify track deep link
      if (match[4]) return `spotify://album/${match[4]}`; // Spotify album deep link
      if (match[5]) return `spotify://playlist/${match[5]}`; // Spotify playlist deep link
      if (match[6]) return `spotify://user/${match[6]}`; // Spotify user deep link
      return null; // Fallback inelse if( no valid match
    },
    webFallback: (match: string[]) => `https://open.spotify.com/${match[2]}`, // Web fallback URL
  },
];

const isMobile = (userAgent: string): boolean => {
  return /android|iphone|ipad|ipod/i.test(userAgent);
};

export const handleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const redirectUrl = await handleClick(req);

    console.log('this is request ====>>>>', req);

    // Check if the request is coming from a mobile device
    if (isMobile(req.headers['user-agent'] || '')) {
      // Check if there is an app scheme available for the redirect URL
      const appMapping = appLinkMappings.find(mapping =>
        mapping.urlPattern.test(redirectUrl)
      );
      if (appMapping) {
        const match = redirectUrl.match(appMapping.urlPattern);
        if (match) {
          // Get the app scheme
          const appUrl = appMapping.appScheme(match);
          // If appUrl is null, fallback to the web URL
          return res.redirect(appUrl || appMapping.webFallback(match));
        }
      }
    }
    console.log(
      'outside of the mobile =========================================>>>>>>'
    );

    // Fallback to the web URL if not on mobile or no app mapping found
    res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
};
