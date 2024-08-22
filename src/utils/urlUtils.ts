import { URL_PATTERNS } from '../types/patterns';

export const detectTargetSite = (url: string): string => {
  for (const [site, pattern] of Object.entries(URL_PATTERNS)) {
    if (pattern.test(url)) {
      return site;
    }
  }
  return 'unknown';
};
