import { Request } from 'express';
import { URL_PATTERNS } from '../types/patterns';
import { URL } from 'url';
import log from '../utils/logger';
import { uriSchemes } from './uriSchemes';

// Cache to store previously calculated redirect URLs for performance optimization
const cache = new Map<
  string,
  { iosLink: string | null; androidLink: string | null }
>();

/**
 * Validates a URL and returns a URL object or null if invalid.
 * @param {string} originalUrl - The URL string to validate.
 * @returns {URL | null} - The parsed URL object or null if invalid.
 */
const validateUrl = (originalUrl: string): URL | null => {
  try {
    return new URL(originalUrl);
  } catch (error) {
    log.error('Invalid URL provided:', originalUrl);
    return null;
  }
};

/**
 * Generates the iOS and Android links based on the platform and URL.
 * @param {keyof typeof uriSchemes} platform - The platform key (e.g., "youtube", "twitter").
 * @param {URL} urlParts - The parsed URL object.
 * @param {string} fallbackTag - The fallback tag for Android intents.
 * @returns {{ iosLink: string | null, androidLink: string | null }} - The iOS and Android redirect links.
 */
const generateLinks = (
  platform: keyof typeof uriSchemes,
  urlParts: URL,
  fallbackTag: string
): { iosLink: string | null; androidLink: string | null } => {
  const scheme = uriSchemes[platform];
  if (!scheme) return { iosLink: null, androidLink: null };

  const iosLink = scheme.ios ? scheme.ios(urlParts) : null;
  const androidLink = scheme.android
    ? scheme.android(urlParts, fallbackTag)
    : null;

  return { iosLink, androidLink };
};

/**
 * Prepares and returns the appropriate redirection URLs (iOS and Android) for a given original URL.
 * Caches results for repeated URLs to improve performance.
 * @param {string} originalUrl - The original URL that needs to be redirected.
 * @returns {{ iosLink: string | null, androidLink: string | null }} - The iOS and Android redirect URLs.
 */
export const prepareRedirectUrl = (
  originalUrl: string
): { iosLink: string | null; androidLink: string | null } => {
  const urlParts = validateUrl(originalUrl);
  if (!urlParts) {
    return { iosLink: null, androidLink: null };
  }

  const fallbackTag = `S.browser_fallback_url=${encodeURIComponent(originalUrl)};`;

  const platformKey =
    Object.keys(URL_PATTERNS).find(key =>
      URL_PATTERNS[key as keyof typeof URL_PATTERNS].test(originalUrl)
    ) || '';

  const { iosLink, androidLink } = generateLinks(
    platformKey as keyof typeof uriSchemes,
    urlParts,
    fallbackTag
  );

  // Cache the result
  const redirectResult = { iosLink, androidLink };
  cache.set(originalUrl, redirectResult);

  return redirectResult;
};

/**
 * Determines the appropriate redirect URL for the request based on the user's device (iOS or Android).
 * Logs and returns the corresponding redirect URL.
 * @param {Request} req - The HTTP request object containing headers like the user agent.
 * @param {string} originalUrl - The original URL to be redirected.
 * @returns {string} - The redirect URL for the user based on the device.
 */
export const getRedirectUrl = (req: Request, originalUrl: string): string => {
  const userAgent = req.headers['user-agent'] || '';
  const osName = /android/i.test(userAgent)
    ? 'Android'
    : /iphone|ipad|ipod/i.test(userAgent)
      ? 'iOS'
      : 'Unknown';

  const { iosLink, androidLink } = prepareRedirectUrl(originalUrl);

  log.info(`Redirection for ${originalUrl} on ${osName}:`);

  if (osName === 'iOS' && iosLink) {
    return iosLink;
  } else if (osName === 'Android' && androidLink) {
    return androidLink;
  }

  return originalUrl; // Redirection fallback
};
