import { URL_PATTERNS } from '../types/patterns';
import { uriSchemes } from './uriSchemes';

const getIntentUrl = (scheme: string, originalUrl: string): string => {
  return `intent://${originalUrl.replace(
    /^https?:\/\//,
    ''
  )}#Intent;scheme=${scheme};package=com.example;S.browser_fallback_url=${encodeURIComponent(
    originalUrl
  )};end`;
};

const getFallbackUrl = (originalUrl: string): string => {
  return `googlechrome://navigate?url=${originalUrl}`;
};

const getUniversalLink = (originalUrl: string): string => {
  return `https://${originalUrl.replace(/^https?:\/\//, '')}`;
};

export const redirectToApp = (originalUrl: string, osName: string): string => {
  const appKey = Object.keys(URL_PATTERNS).find(key =>
    URL_PATTERNS[key as keyof typeof URL_PATTERNS].test(originalUrl)
  );

  if (!appKey) {
    return getFallbackUrl(originalUrl);
  }

  const scheme = uriSchemes[appKey];

  if (scheme) {
    if (osName === 'iOS' && scheme.ios) {
      return getUniversalLink(originalUrl);
    } else if (osName === 'Android' && scheme.android) {
      return getIntentUrl(scheme.android, originalUrl);
    }
  }

  return getFallbackUrl(originalUrl);
};
