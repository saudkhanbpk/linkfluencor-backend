import { URL_PATTERNS } from '../types/patterns';

const getIntentUrl = (scheme: string, originalUrl: string): string => {
  return `intent://${originalUrl.replace(/^https?:\/\//, '')}#Intent;scheme=${scheme};package=com.example;end`;
};

export const redirectToApp = (originalUrl: string, osName: string): string => {
  const appKey = Object.keys(URL_PATTERNS).find(key =>
    URL_PATTERNS[key as keyof typeof URL_PATTERNS].test(originalUrl)
  );

  if (!appKey) {
    return originalUrl;
  }

  const uriSchemes: { [key: string]: { ios: string; android: string } } = {
    youtube: { ios: 'vnd.youtube:', android: 'vnd.youtube:' },
    amazon: {
      ios: 'com.amazon.mobile.shopping:',
      android: 'com.amazon.mobile.shopping:',
    },
    instagram: {
      ios: 'instagram://',
      android:
        'intent://instagram.com/#Intent;package=com.instagram.android;end',
    },
    spotify: { ios: 'spotify:', android: 'spotify:' },
    alibaba: { ios: 'alibaba:', android: 'alibaba:' },
    applemusic: { ios: 'music:', android: 'music:' },
    farfetch: { ios: 'farfetch:', android: 'farfetch:' },
    linkedin: { ios: 'linkedin:', android: 'linkedin:' },
    netflix: { ios: 'nflx:', android: 'nflx:' },
    snapchat: { ios: 'snapchat:', android: 'snapchat:' },
    telegram: { ios: 'tg:', android: 'tg:' },
    threads: { ios: 'threads:', android: 'threads:' },
    tiktok: { ios: 'snssdk1128:', android: 'snssdk1128:' },
    twitch: { ios: 'twitch:', android: 'twitch:' },
    twitter: { ios: 'twitter:', android: 'twitter:' },
    youtubemusic: { ios: 'youtubemusic:', android: 'youtubemusic:' },
    asos: { ios: 'asos:', android: 'asos:' },
    deezer: { ios: 'deezer:', android: 'deezer:' },
    deliveroo: { ios: 'deliveroo:', android: 'deliveroo:' },
    doordash: { ios: 'doordash:', android: 'doordash:' },
    etsy: { ios: 'etsy:', android: 'etsy:' },
    facebook: { ios: 'fb:', android: 'fb:' },
    googlemaps: { ios: 'comgooglemaps:', android: 'comgooglemaps:' },
    nextdoor: { ios: 'nextdoor:', android: 'nextdoor:' },
    reddit: { ios: 'reddit:', android: 'reddit:' },
    spreaker: { ios: 'spreaker:', android: 'spreaker:' },
    ubereats: { ios: 'ubereats:', android: 'ubereats:' },
    vimeo: { ios: 'vimeo:', android: 'vimeo:' },
    zalando: { ios: 'zalando:', android: 'zalando:' },
    zomato: { ios: 'zomato:', android: 'zomato:' },
    pinterest: { ios: 'pinterest:', android: 'pinterest:' },
    temu: { ios: 'temu:', android: 'temu:' },
    soundcloud: { ios: 'soundcloud:', android: 'soundcloud:' },
    yelp: { ios: 'yelp:', android: 'yelp:' },
    airbnb: { ios: 'airbnb:', android: 'airbnb:' },
    lydia: { ios: 'lydia:', android: 'lydia:' },
    doctolib: { ios: 'doctolib:', android: 'doctolib:' },
    whatsapp: { ios: 'whatsapp:', android: 'whatsapp:' },
    shein: { ios: 'shein:', android: 'shein:' },
    shazam: { ios: 'shazam:', android: 'shazam:' },
    tripadvisor: { ios: 'tripadvisor:', android: 'tripadvisor:' },
    gofundme: { ios: 'gofundme:', android: 'gofundme:' },
    aliexpress: { ios: 'aliexpress:', android: 'aliexpress:' },
    booking: { ios: 'booking:', android: 'booking:' },
    talabat: { ios: 'talabat:', android: 'talabat:' },
    hungerstation: { ios: 'hungerstation:', android: 'hungerstation:' },
    smood: { ios: 'smood:', android: 'smood:' },
    postmates: { ios: 'postmates:', android: 'postmates:' },
  };

  const scheme = uriSchemes[appKey];

  if (scheme) {
    if (osName === 'iOS' && scheme.ios) {
      return `${scheme.ios}//`;
    } else if (osName === 'Android' && scheme.android) {
      return getIntentUrl(scheme.android, originalUrl);
    }
  }

  return originalUrl;
};
