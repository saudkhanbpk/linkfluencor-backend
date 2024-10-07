export const uriSchemes = {
  youtube: {
    ios: (urlParts: URL) => {
      // Patterns to handle different YouTube URL types
      const videoIDPattern = /[?&]v=([^&]+)/; // To extract video ID from `watch` links
      const playlistIDPattern = /[?&]list=([^&]+)/; // To extract playlist ID
      const channelPattern = /channel\/([^/?]+)/; // To extract channel ID from `channel/` links
      const userPattern = /user\/([^/?]+)/; // To extract username from `user/` links
      const youtuBePattern = /youtu\.be\/([^/?]+)/; // To extract video ID from shortened `youtu.be` links

      let iosLink = null;

      // Handle video links
      if (urlParts.pathname === '/watch') {
        const videoID = urlParts.search.match(videoIDPattern)?.[1];
        if (videoID) {
          iosLink = `vnd.youtube://${videoID}`;
        }
      }

      // Handle playlist links
      if (!iosLink && urlParts.search.match(playlistIDPattern)) {
        const playlistID = urlParts.search.match(playlistIDPattern)?.[1];
        iosLink = `vnd.youtube://www.youtube.com/playlist?list=${playlistID}`;
      }

      // Handle channel links
      if (!iosLink && urlParts.pathname.match(channelPattern)) {
        const channelID = urlParts.pathname.match(channelPattern)?.[1];
        iosLink = `vnd.youtube://www.youtube.com/channel/${channelID}`;
      }

      // Handle user links
      if (!iosLink && urlParts.pathname.match(userPattern)) {
        const username = urlParts.pathname.match(userPattern)?.[1];
        iosLink = `vnd.youtube://www.youtube.com/user/${username}`;
      }

      // Handle short links from youtu.be
      if (!iosLink && urlParts.host === 'youtu.be') {
        const videoID = urlParts.pathname.match(youtuBePattern)?.[1];
        iosLink = `vnd.youtube://${videoID}`;
      }

      // Fallback if none of the above matched
      if (!iosLink) {
        iosLink = `vnd.youtube://www.youtube.com${urlParts.pathname}${urlParts.search}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const videoIDPattern = /[?&]v=([^&]+)/;
      const playlistIDPattern = /[?&]list=([^&]+)/;
      const channelPattern = /channel\/([^/?]+)/;
      const userPattern = /user\/([^/?]+)/;
      const youtuBePattern = /youtu\.be\/([^/?]+)/;

      let androidLink = null;

      // Handle video links
      if (urlParts.pathname === '/watch') {
        const videoID = urlParts.search.match(videoIDPattern)?.[1];
        if (videoID) {
          androidLink = `intent://${urlParts.host}/watch?v=${videoID}#Intent;package=com.google.android.youtube;scheme=https;${fallbackTag}end;`;
        }
      }

      // Handle playlist links
      if (!androidLink && urlParts.search.match(playlistIDPattern)) {
        const playlistID = urlParts.search.match(playlistIDPattern)?.[1];
        androidLink = `intent://${urlParts.host}/playlist?list=${playlistID}#Intent;package=com.google.android.youtube;scheme=https;${fallbackTag}end;`;
      }

      // Handle channel links
      if (!androidLink && urlParts.pathname.match(channelPattern)) {
        const channelID = urlParts.pathname.match(channelPattern)?.[1];
        androidLink = `intent://${urlParts.host}/channel/${channelID}#Intent;package=com.google.android.youtube;scheme=https;${fallbackTag}end;`;
      }

      // Handle user links
      if (!androidLink && urlParts.pathname.match(userPattern)) {
        const username = urlParts.pathname.match(userPattern)?.[1];
        androidLink = `intent://${urlParts.host}/user/${username}#Intent;package=com.google.android.youtube;scheme=https;${fallbackTag}end;`;
      }

      // Handle short links from youtu.be
      if (!androidLink && urlParts.host === 'youtu.be') {
        const videoID = urlParts.pathname.match(youtuBePattern)?.[1];
        androidLink = `intent://youtu.be/${videoID}#Intent;package=com.google.android.youtube;scheme=https;${fallbackTag}end;`;
      }

      // Fallback if none of the above matched
      if (!androidLink) {
        androidLink = `intent://${urlParts.host}${urlParts.pathname}${urlParts.search}#Intent;package=com.google.android.youtube;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  amazon: {
    ios: (urlParts: URL) => {
      // Patterns pour différents types de pages Amazon
      const productIDPattern = /\/dp\/([^/?]+)/; // ID de produit
      const affiliatePattern = /tag=([^&]+)/; // Lien d'affiliation
      const categoryPattern = /\/s\?.+/; // Pages de recherche ou catégories
      const variantPattern = /\/dp\/[^/]+\/ref=.+/; // Produits avec variantes (taille, couleur, etc.)
      const reviewsPattern = /\/product-reviews\/([^/]+)/; // Pages de commentaires
      const smilePattern = /smile\.amazon\./; // Amazon Smile pour les donations
      const regionPattern =
        /\.(com|co\.uk|de|fr|it|es|ca|jp|in|com\.br|com\.au)$/; // Modèles de régions

      // Extraction de la région
      const regionMatch = urlParts.host.match(regionPattern);
      const region = regionMatch ? regionMatch[1] : 'com'; // Valeur par défaut

      let iosLink = null;

      // Cas d'un produit avec son ID
      if (urlParts.pathname.match(productIDPattern)) {
        const productID = urlParts.pathname.match(productIDPattern)?.[1];
        iosLink = `com.amazon.mobile.shopping://www.amazon.${region}/dp/${productID}`;
      }

      // Cas d'un produit avec variantes
      if (!iosLink && urlParts.pathname.match(variantPattern)) {
        const productID = urlParts.pathname.match(productIDPattern)?.[1];
        iosLink = `com.amazon.mobile.shopping://www.amazon.${region}/dp/${productID}?ref=${urlParts.searchParams.get('ref')}`;
      }

      // Cas des commentaires sur un produit
      if (!iosLink && urlParts.pathname.match(reviewsPattern)) {
        const productID = urlParts.pathname.match(reviewsPattern)?.[1];
        iosLink = `com.amazon.mobile.shopping://www.amazon.${region}/product-reviews/${productID}`;
      }

      // Cas de la recherche ou des catégories
      if (!iosLink && urlParts.pathname.match(categoryPattern)) {
        iosLink = `com.amazon.mobile.shopping://www.amazon.${region}${urlParts.pathname}${urlParts.search}`;
      }

      // Gestion des liens d'affiliation
      if (!iosLink && urlParts.search.match(affiliatePattern)) {
        const affiliateTag = urlParts.search.match(affiliatePattern)?.[1];
        iosLink = `com.amazon.mobile.shopping://www.amazon.${region}${urlParts.pathname}?tag=${affiliateTag}`;
      }

      // Gestion des liens Amazon Smile (donations)
      if (!iosLink && urlParts.host.match(smilePattern)) {
        iosLink = `com.amazon.mobile.shopping://smile.amazon.${region}${urlParts.pathname}${urlParts.search}`;
      }

      // Fallback par défaut
      if (!iosLink) {
        iosLink = `com.amazon.mobile.shopping://www.amazon.${region}${urlParts.pathname}${urlParts.search}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      // Patterns pour différents types de pages Amazon
      const productIDPattern = /\/dp\/([^/?]+)/; // ID de produit
      const affiliatePattern = /tag=([^&]+)/; // Lien d'affiliation
      const categoryPattern = /\/s\?.+/; // Pages de recherche ou catégories
      const variantPattern = /\/dp\/[^/]+\/ref=.+/; // Produits avec variantes (taille, couleur, etc.)
      const reviewsPattern = /\/product-reviews\/([^/]+)/; // Pages de commentaires
      const smilePattern = /smile\.amazon\./; // Amazon Smile pour les donations
      const regionPattern =
        /\.(com|co\.uk|de|fr|it|es|ca|jp|in|com\.br|com\.au)$/; // Modèles de régions

      // Extraction de la région
      const regionMatch = urlParts.host.match(regionPattern);
      const region = regionMatch ? regionMatch[1] : 'com'; // Valeur par défaut

      let androidLink = null;

      // Cas d'un produit avec son ID
      if (urlParts.pathname.match(productIDPattern)) {
        const productID = urlParts.pathname.match(productIDPattern)?.[1];
        androidLink = `intent://www.amazon.${region}/dp/${productID}#Intent;package=com.amazon.mShop.android.shopping;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'un produit avec variantes
      if (!androidLink && urlParts.pathname.match(variantPattern)) {
        const productID = urlParts.pathname.match(productIDPattern)?.[1];
        androidLink = `intent://www.amazon.${region}/dp/${productID}?ref=${urlParts.searchParams.get('ref')}#Intent;package=com.amazon.mShop.android.shopping;scheme=https;${fallbackTag}end;`;
      }

      // Cas des commentaires sur un produit
      if (!androidLink && urlParts.pathname.match(reviewsPattern)) {
        const productID = urlParts.pathname.match(reviewsPattern)?.[1];
        androidLink = `intent://www.amazon.${region}/product-reviews/${productID}#Intent;package=com.amazon.mShop.android.shopping;scheme=https;${fallbackTag}end;`;
      }

      // Cas des recherches ou des catégories
      if (!androidLink && urlParts.pathname.match(categoryPattern)) {
        androidLink = `intent://www.amazon.${region}${urlParts.pathname}${urlParts.search}#Intent;package=com.amazon.mShop.android.shopping;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des liens d'affiliation
      if (!androidLink && urlParts.search.match(affiliatePattern)) {
        const affiliateTag = urlParts.search.match(affiliatePattern)?.[1];
        androidLink = `intent://www.amazon.${region}${urlParts.pathname}?tag=${affiliateTag}#Intent;package=com.amazon.mShop.android.shopping;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des liens Amazon Smile (donations)
      if (!androidLink && urlParts.host.match(smilePattern)) {
        androidLink = `intent://smile.amazon.${region}${urlParts.pathname}${urlParts.search}#Intent;package=com.amazon.mShop.android.shopping;scheme=https;${fallbackTag}end;`;
      }

      // Fallback par défaut
      if (!androidLink) {
        androidLink = `intent://www.amazon.${region}${urlParts.pathname}${urlParts.search}#Intent;package=com.amazon.mShop.android.shopping;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  instagram: {
    ios: (urlParts: URL) => {
      // Patterns pour différents types de contenu Instagram
      const profilePattern = /^\/([^/]+)\/?$/; // Profil d'utilisateur
      const postPattern = /^\/p\/([^/]+)\/?$/; // Publication (post)
      const reelPattern = /^\/reel\/([^/]+)\/?$/; // Reels
      const storyPattern = /^\/stories\/([^/]+)\/([^/]+)\/?$/; // Stories (avec userID et storyID)
      const igtvPattern = /^\/tv\/([^/]+)\/?$/; // IGTV
      const hashtagPattern = /^\/explore\/tags\/([^/]+)\/?$/; // Hashtags
      const locationPattern = /^\/explore\/locations\/([^/]+)\/?$/; // Localisation

      let iosLink = null;

      // Cas d'un profil d'utilisateur
      if (urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.match(profilePattern)?.[1];
        iosLink = `instagram://user?username=${username}`;
      }

      // Cas d'une publication (post)
      if (!iosLink && urlParts.pathname.match(postPattern)) {
        const postID = urlParts.pathname.match(postPattern)?.[1];
        iosLink = `instagram://media?id=${postID}`;
      }

      // Cas d'une reel (reel vidéo)
      if (!iosLink && urlParts.pathname.match(reelPattern)) {
        const reelID = urlParts.pathname.match(reelPattern)?.[1];
        iosLink = `instagram://reel?id=${reelID}`;
      }

      // Cas d'une story
      if (!iosLink && urlParts.pathname.match(storyPattern)) {
        const userID = urlParts.pathname.match(storyPattern)?.[1];
        const storyID = urlParts.pathname.match(storyPattern)?.[2];
        iosLink = `instagram://stories/${userID}/${storyID}`;
      }

      // Cas d'une IGTV (longue vidéo)
      if (!iosLink && urlParts.pathname.match(igtvPattern)) {
        const igtvID = urlParts.pathname.match(igtvPattern)?.[1];
        iosLink = `instagram://tv?id=${igtvID}`;
      }

      // Cas d'un hashtag
      if (!iosLink && urlParts.pathname.match(hashtagPattern)) {
        const hashtag = urlParts.pathname.match(hashtagPattern)?.[1];
        iosLink = `instagram://tag?name=${hashtag}`;
      }

      // Cas d'une localisation
      if (!iosLink && urlParts.pathname.match(locationPattern)) {
        const locationID = urlParts.pathname.match(locationPattern)?.[1];
        iosLink = `instagram://location?id=${locationID}`;
      }

      // Fallback par défaut
      if (!iosLink) {
        iosLink = `instagram://www.instagram.com${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      // Patterns pour différents types de contenu Instagram
      const profilePattern = /^\/([^/]+)\/?$/; // Profil d'utilisateur
      const postPattern = /^\/p\/([^/]+)\/?$/; // Publication (post)
      const reelPattern = /^\/reel\/([^/]+)\/?$/; // Reels
      const storyPattern = /^\/stories\/([^/]+)\/([^/]+)\/?$/; // Stories (avec userID et storyID)
      const igtvPattern = /^\/tv\/([^/]+)\/?$/; // IGTV
      const hashtagPattern = /^\/explore\/tags\/([^/]+)\/?$/; // Hashtags
      const locationPattern = /^\/explore\/locations\/([^/]+)\/?$/; // Localisation

      let androidLink = null;

      // Cas d'un profil d'utilisateur
      if (urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.match(profilePattern)?.[1];
        androidLink = `intent://www.instagram.com/${username}#Intent;package=com.instagram.android;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une publication (post)
      if (!androidLink && urlParts.pathname.match(postPattern)) {
        const postID = urlParts.pathname.match(postPattern)?.[1];
        androidLink = `intent://www.instagram.com/p/${postID}#Intent;package=com.instagram.android;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une reel (reel vidéo)
      if (!androidLink && urlParts.pathname.match(reelPattern)) {
        const reelID = urlParts.pathname.match(reelPattern)?.[1];
        androidLink = `intent://www.instagram.com/reel/${reelID}#Intent;package=com.instagram.android;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une story
      if (!androidLink && urlParts.pathname.match(storyPattern)) {
        const userID = urlParts.pathname.match(storyPattern)?.[1];
        const storyID = urlParts.pathname.match(storyPattern)?.[2];
        androidLink = `intent://www.instagram.com/stories/${userID}/${storyID}#Intent;package=com.instagram.android;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une IGTV (longue vidéo)
      if (!androidLink && urlParts.pathname.match(igtvPattern)) {
        const igtvID = urlParts.pathname.match(igtvPattern)?.[1];
        androidLink = `intent://www.instagram.com/tv/${igtvID}#Intent;package=com.instagram.android;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'un hashtag
      if (!androidLink && urlParts.pathname.match(hashtagPattern)) {
        const hashtag = urlParts.pathname.match(hashtagPattern)?.[1];
        androidLink = `intent://www.instagram.com/explore/tags/${hashtag}#Intent;package=com.instagram.android;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une localisation
      if (!androidLink && urlParts.pathname.match(locationPattern)) {
        const locationID = urlParts.pathname.match(locationPattern)?.[1];
        androidLink = `intent://www.instagram.com/explore/locations/${locationID}#Intent;package=com.instagram.android;scheme=https;${fallbackTag}end;`;
      }

      // Fallback par défaut
      if (!androidLink) {
        androidLink = `intent://www.instagram.com${urlParts.pathname}#Intent;package=com.instagram.android;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  spotify: {
    ios: (urlParts: URL) => {
      // Patterns pour différents types de contenu Spotify
      const albumPattern = /^\/album\/([^/]+)\/?$/; // Album
      const playlistPattern = /^\/playlist\/([^/]+)\/?$/; // Playlist
      const trackPattern = /^\/track\/([^/]+)\/?$/; // Morceau (track)
      const artistPattern = /^\/artist\/([^/]+)\/?$/; // Artiste
      const episodePattern = /^\/episode\/([^/]+)\/?$/; // Podcast épisode

      let iosLink = null;

      // Cas d'un album
      if (urlParts.pathname.match(albumPattern)) {
        const albumID = urlParts.pathname.match(albumPattern)?.[1];
        iosLink = `spotify://album/${albumID}`;
      }

      // Cas d'une playlist
      if (!iosLink && urlParts.pathname.match(playlistPattern)) {
        const playlistID = urlParts.pathname.match(playlistPattern)?.[1];
        iosLink = `spotify://playlist/${playlistID}`;
      }

      // Cas d'un morceau (track)
      if (!iosLink && urlParts.pathname.match(trackPattern)) {
        const trackID = urlParts.pathname.match(trackPattern)?.[1];
        iosLink = `spotify://track/${trackID}`;
      }

      // Cas d'un artiste
      if (!iosLink && urlParts.pathname.match(artistPattern)) {
        const artistID = urlParts.pathname.match(artistPattern)?.[1];
        iosLink = `spotify://artist/${artistID}`;
      }

      // Cas d'un épisode de podcast
      if (!iosLink && urlParts.pathname.match(episodePattern)) {
        const episodeID = urlParts.pathname.match(episodePattern)?.[1];
        iosLink = `spotify://episode/${episodeID}`;
      }

      // Fallback général
      if (!iosLink) {
        iosLink = `spotify://open.spotify.com${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      // Patterns pour différents types de contenu Spotify
      const albumPattern = /^\/album\/([^/]+)\/?$/; // Album
      const playlistPattern = /^\/playlist\/([^/]+)\/?$/; // Playlist
      const trackPattern = /^\/track\/([^/]+)\/?$/; // Morceau (track)
      const artistPattern = /^\/artist\/([^/]+)\/?$/; // Artiste
      const episodePattern = /^\/episode\/([^/]+)\/?$/; // Podcast épisode

      let androidLink = null;

      // Cas d'un album
      if (urlParts.pathname.match(albumPattern)) {
        const albumID = urlParts.pathname.match(albumPattern)?.[1];
        androidLink = `intent://open.spotify.com/album/${albumID}#Intent;package=com.spotify.music;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une playlist
      if (!androidLink && urlParts.pathname.match(playlistPattern)) {
        const playlistID = urlParts.pathname.match(playlistPattern)?.[1];
        androidLink = `intent://open.spotify.com/playlist/${playlistID}#Intent;package=com.spotify.music;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'un morceau (track)
      if (!androidLink && urlParts.pathname.match(trackPattern)) {
        const trackID = urlParts.pathname.match(trackPattern)?.[1];
        androidLink = `intent://open.spotify.com/track/${trackID}#Intent;package=com.spotify.music;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'un artiste
      if (!androidLink && urlParts.pathname.match(artistPattern)) {
        const artistID = urlParts.pathname.match(artistPattern)?.[1];
        androidLink = `intent://open.spotify.com/artist/${artistID}#Intent;package=com.spotify.music;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'un épisode de podcast
      if (!androidLink && urlParts.pathname.match(episodePattern)) {
        const episodeID = urlParts.pathname.match(episodePattern)?.[1];
        androidLink = `intent://open.spotify.com/episode/${episodeID}#Intent;package=com.spotify.music;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général
      if (!androidLink) {
        androidLink = `intent://open.spotify.com${urlParts.pathname}#Intent;package=com.spotify.music;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  alibaba: {
    ios: (urlParts: URL) => {
      // Patterns pour différents types de contenu Alibaba
      const productPattern = /^\/product-detail\/([^/]+)\/?$/; // Produit
      const categoryPattern = /^\/category\/([^/]+)\/?$/; // Catégorie
      const searchPattern = /^\/search\/([^/]+)\/?$/; // Recherche
      const sellerPattern = /^\/shop\/([^/]+)\/?$/; // Vendeur (Shop)

      let iosLink = null;

      // Cas d'un produit
      if (urlParts.pathname.match(productPattern)) {
        const productID = urlParts.pathname.match(productPattern)?.[1];
        iosLink = `alibaba://product-detail/${productID}`;
      }

      // Cas d'une catégorie
      if (!iosLink && urlParts.pathname.match(categoryPattern)) {
        const categoryID = urlParts.pathname.match(categoryPattern)?.[1];
        iosLink = `alibaba://category/${categoryID}`;
      }

      // Cas d'une recherche
      if (!iosLink && urlParts.pathname.match(searchPattern)) {
        const searchQuery = urlParts.pathname.match(searchPattern)?.[1];
        iosLink = `alibaba://search/${searchQuery}`;
      }

      // Cas d'un vendeur (shop)
      if (!iosLink && urlParts.pathname.match(sellerPattern)) {
        const shopID = urlParts.pathname.match(sellerPattern)?.[1];
        iosLink = `alibaba://shop/${shopID}`;
      }

      // Fallback général
      if (!iosLink) {
        iosLink = `alibaba://open.alibaba.com${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      // Patterns pour différents types de contenu Alibaba
      const productPattern = /^\/product-detail\/([^/]+)\/?$/; // Produit
      const categoryPattern = /^\/category\/([^/]+)\/?$/; // Catégorie
      const searchPattern = /^\/search\/([^/]+)\/?$/; // Recherche
      const sellerPattern = /^\/shop\/([^/]+)\/?$/; // Vendeur (Shop)

      let androidLink = null;

      // Cas d'un produit
      if (urlParts.pathname.match(productPattern)) {
        const productID = urlParts.pathname.match(productPattern)?.[1];
        androidLink = `intent://product-detail/${productID}#Intent;package=com.alibaba.intl.android.apps.poseidon;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une catégorie
      if (!androidLink && urlParts.pathname.match(categoryPattern)) {
        const categoryID = urlParts.pathname.match(categoryPattern)?.[1];
        androidLink = `intent://category/${categoryID}#Intent;package=com.alibaba.intl.android.apps.poseidon;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une recherche
      if (!androidLink && urlParts.pathname.match(searchPattern)) {
        const searchQuery = urlParts.pathname.match(searchPattern)?.[1];
        androidLink = `intent://search/${searchQuery}#Intent;package=com.alibaba.intl.android.apps.poseidon;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'un vendeur (shop)
      if (!androidLink && urlParts.pathname.match(sellerPattern)) {
        const shopID = urlParts.pathname.match(sellerPattern)?.[1];
        androidLink = `intent://shop/${shopID}#Intent;package=com.alibaba.intl.android.apps.poseidon;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général
      if (!androidLink) {
        androidLink = `intent://open.alibaba.com${urlParts.pathname}#Intent;package=com.alibaba.intl.android.apps.poseidon;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  applemusic: {
    ios: (urlParts: URL) => {
      // Patterns pour différents types de contenu sur Apple Music
      const albumPattern = /^\/album\/([^/]+)\/(\d+)$/; // Album avec ID
      const playlistPattern = /^\/playlist\/([^/]+)\/pl\.(\w+)$/; // Playlist avec ID
      const artistPattern = /^\/artist\/([^/]+)\/(\d+)$/; // Artiste avec ID
      const songPattern = /^\/song\/(\d+)$/; // Chanson avec ID

      let iosLink = null;

      // Cas d'un album
      if (urlParts.pathname.match(albumPattern)) {
        const albumID = urlParts.pathname.match(albumPattern)?.[2];
        iosLink = `music://album/${albumID}`;
      }

      // Cas d'une playlist
      if (!iosLink && urlParts.pathname.match(playlistPattern)) {
        const playlistID = urlParts.pathname.match(playlistPattern)?.[2];
        iosLink = `music://playlist/${playlistID}`;
      }

      // Cas d'un artiste
      if (!iosLink && urlParts.pathname.match(artistPattern)) {
        const artistID = urlParts.pathname.match(artistPattern)?.[2];
        iosLink = `music://artist/${artistID}`;
      }

      // Cas d'une chanson
      if (!iosLink && urlParts.pathname.match(songPattern)) {
        const songID = urlParts.pathname.match(songPattern)?.[1];
        iosLink = `music://song/${songID}`;
      }

      // Fallback général pour une page Apple Music non gérée
      if (!iosLink) {
        iosLink = `music://open${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      // Patterns pour différents types de contenu sur Apple Music
      const albumPattern = /^\/album\/([^/]+)\/(\d+)$/; // Album avec ID
      const playlistPattern = /^\/playlist\/([^/]+)\/pl\.(\w+)$/; // Playlist avec ID
      const artistPattern = /^\/artist\/([^/]+)\/(\d+)$/; // Artiste avec ID
      const songPattern = /^\/song\/(\d+)$/; // Chanson avec ID

      let androidLink = null;

      // Cas d'un album
      if (urlParts.pathname.match(albumPattern)) {
        const albumID = urlParts.pathname.match(albumPattern)?.[2];
        androidLink = `intent://album/${albumID}#Intent;package=com.apple.android.music;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une playlist
      if (!androidLink && urlParts.pathname.match(playlistPattern)) {
        const playlistID = urlParts.pathname.match(playlistPattern)?.[2];
        androidLink = `intent://playlist/${playlistID}#Intent;package=com.apple.android.music;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'un artiste
      if (!androidLink && urlParts.pathname.match(artistPattern)) {
        const artistID = urlParts.pathname.match(artistPattern)?.[2];
        androidLink = `intent://artist/${artistID}#Intent;package=com.apple.android.music;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une chanson
      if (!androidLink && urlParts.pathname.match(songPattern)) {
        const songID = urlParts.pathname.match(songPattern)?.[1];
        androidLink = `intent://song/${songID}#Intent;package=com.apple.android.music;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général pour une page Apple Music non gérée
      if (!androidLink) {
        androidLink = `intent://open${urlParts.pathname}#Intent;package=com.apple.android.music;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  farfetch: {
    ios: (urlParts: URL) => {
      // Patterns pour différents types de contenu sur Farfetch
      const productPattern = /^\/shopping\/item-(\d+)\.aspx$/; // Produit avec ID
      const categoryPattern = /^\/shopping\/([a-zA-Z0-9-]+)\/$/; // Catégorie
      const brandPattern = /^\/shopping\/([a-zA-Z0-9-]+)-([a-zA-Z0-9-]+)\/$/; // Marque avec catégorie
      const searchPattern = /^\/search\/([a-zA-Z0-9-]+)\/$/; // Recherche

      let iosLink = null;

      // Cas d'un produit
      if (urlParts.pathname.match(productPattern)) {
        const productID = urlParts.pathname.match(productPattern)?.[1];
        iosLink = `farfetch://product/${productID}`;
      }

      // Cas d'une catégorie
      if (!iosLink && urlParts.pathname.match(categoryPattern)) {
        const categorySlug = urlParts.pathname.match(categoryPattern)?.[1];
        iosLink = `farfetch://category/${categorySlug}`;
      }

      // Cas d'une marque avec une catégorie spécifique
      if (!iosLink && urlParts.pathname.match(brandPattern)) {
        const brandSlug = urlParts.pathname.match(brandPattern)?.[1];
        iosLink = `farfetch://brand/${brandSlug}`;
      }

      // Cas d'une recherche
      if (!iosLink && urlParts.pathname.match(searchPattern)) {
        const searchTerm = urlParts.pathname.match(searchPattern)?.[1];
        iosLink = `farfetch://search?term=${searchTerm}`;
      }

      // Fallback général pour une page Farfetch non gérée
      if (!iosLink) {
        iosLink = `farfetch://open${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      // Patterns pour différents types de contenu sur Farfetch
      const productPattern = /^\/shopping\/item-(\d+)\.aspx$/; // Produit avec ID
      const categoryPattern = /^\/shopping\/([a-zA-Z0-9-]+)\/$/; // Catégorie
      const brandPattern = /^\/shopping\/([a-zA-Z0-9-]+)-([a-zA-Z0-9-]+)\/$/; // Marque avec catégorie
      const searchPattern = /^\/search\/([a-zA-Z0-9-]+)\/$/; // Recherche

      let androidLink = null;

      // Cas d'un produit
      if (urlParts.pathname.match(productPattern)) {
        const productID = urlParts.pathname.match(productPattern)?.[1];
        androidLink = `intent://product/${productID}#Intent;package=com.farfetch.farfetchshop;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une catégorie
      if (!androidLink && urlParts.pathname.match(categoryPattern)) {
        const categorySlug = urlParts.pathname.match(categoryPattern)?.[1];
        androidLink = `intent://category/${categorySlug}#Intent;package=com.farfetch.farfetchshop;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une marque avec une catégorie spécifique
      if (!androidLink && urlParts.pathname.match(brandPattern)) {
        const brandSlug = urlParts.pathname.match(brandPattern)?.[1];
        androidLink = `intent://brand/${brandSlug}#Intent;package=com.farfetch.farfetchshop;scheme=https;${fallbackTag}end;`;
      }

      // Cas d'une recherche
      if (!androidLink && urlParts.pathname.match(searchPattern)) {
        const searchTerm = urlParts.pathname.match(searchPattern)?.[1];
        androidLink = `intent://search?term=${searchTerm}#Intent;package=com.farfetch.farfetchshop;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général pour une page Farfetch non gérée
      if (!androidLink) {
        androidLink = `intent://open${urlParts.pathname}#Intent;package=com.farfetch.farfetchshop;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  linkedin: {
    ios: (urlParts: URL) => {
      const profilePattern = /^\/in\/([a-zA-Z0-9-]+)\/?$/; // Profil utilisateur
      const companyPattern = /^\/company\/([a-zA-Z0-9-]+)\/?$/; // Page entreprise
      const postPattern = /^\/feed\/update\/urn:li:activity:([0-9]+)\/?$/; // Post spécifique
      const jobPattern = /^\/jobs\/view\/([0-9]+)\/?$/; // Offre d'emploi spécifique

      let iosLink = null;

      // Profil utilisateur
      if (urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.match(profilePattern)?.[1];
        iosLink = `linkedin://profile/${username}`;
      }

      // Page entreprise
      if (!iosLink && urlParts.pathname.match(companyPattern)) {
        const companyID = urlParts.pathname.match(companyPattern)?.[1];
        iosLink = `linkedin://company/${companyID}`;
      }

      // Post spécifique
      if (!iosLink && urlParts.pathname.match(postPattern)) {
        const postID = urlParts.pathname.match(postPattern)?.[1];
        iosLink = `linkedin://feed/update/urn:li:activity:${postID}`;
      }

      // Offre d'emploi spécifique
      if (!iosLink && urlParts.pathname.match(jobPattern)) {
        const jobID = urlParts.pathname.match(jobPattern)?.[1];
        iosLink = `linkedin://jobs/view/${jobID}`;
      }

      // Fallback général pour LinkedIn non géré
      if (!iosLink) {
        iosLink = `linkedin://open${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const profilePattern = /^\/in\/([a-zA-Z0-9-]+)\/?$/; // Profil utilisateur
      const companyPattern = /^\/company\/([a-zA-Z0-9-]+)\/?$/; // Page entreprise
      const postPattern = /^\/feed\/update\/urn:li:activity:([0-9]+)\/?$/; // Post spécifique
      const jobPattern = /^\/jobs\/view\/([0-9]+)\/?$/; // Offre d'emploi spécifique

      let androidLink = null;

      // Profil utilisateur
      if (urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.match(profilePattern)?.[1];
        androidLink = `intent://profile/${username}#Intent;package=com.linkedin.android;scheme=https;${fallbackTag}end;`;
      }

      // Page entreprise
      if (!androidLink && urlParts.pathname.match(companyPattern)) {
        const companyID = urlParts.pathname.match(companyPattern)?.[1];
        androidLink = `intent://company/${companyID}#Intent;package=com.linkedin.android;scheme=https;${fallbackTag}end;`;
      }

      // Post spécifique
      if (!androidLink && urlParts.pathname.match(postPattern)) {
        const postID = urlParts.pathname.match(postPattern)?.[1];
        androidLink = `intent://feed/update/urn:li:activity:${postID}#Intent;package=com.linkedin.android;scheme=https;${fallbackTag}end;`;
      }

      // Offre d'emploi spécifique
      if (!androidLink && urlParts.pathname.match(jobPattern)) {
        const jobID = urlParts.pathname.match(jobPattern)?.[1];
        androidLink = `intent://jobs/view/${jobID}#Intent;package=com.linkedin.android;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général pour LinkedIn non géré
      if (!androidLink) {
        androidLink = `intent://open${urlParts.pathname}#Intent;package=com.linkedin.android;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  netflix: {
    ios: (urlParts: URL) => {
      const moviePattern = /^\/title\/([0-9]+)\/?$/; // Film ou série spécifique
      const genrePattern = /^\/browse\/genre\/([0-9]+)\/?$/; // Genre spécifique
      const profilePattern = /^\/ProfilesGate$/; // Page des profils utilisateur
      let iosLink = null;

      // Film ou série spécifique
      if (urlParts.pathname.match(moviePattern)) {
        const contentID = urlParts.pathname.match(moviePattern)?.[1];
        iosLink = `nflx://www.netflix.com/title/${contentID}`;
      }

      // Genre spécifique
      if (!iosLink && urlParts.pathname.match(genrePattern)) {
        const genreID = urlParts.pathname.match(genrePattern)?.[1];
        iosLink = `nflx://www.netflix.com/browse/genre/${genreID}`;
      }

      // Page des profils utilisateur
      if (!iosLink && urlParts.pathname.match(profilePattern)) {
        iosLink = `nflx://www.netflix.com/ProfilesGate`;
      }

      // Fallback général pour Netflix non géré
      if (!iosLink) {
        iosLink = `nflx://www.netflix.com${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const moviePattern = /^\/title\/([0-9]+)\/?$/; // Film ou série spécifique
      const genrePattern = /^\/browse\/genre\/([0-9]+)\/?$/; // Genre spécifique
      const profilePattern = /^\/ProfilesGate$/; // Page des profils utilisateur
      let androidLink = null;

      // Film ou série spécifique
      if (urlParts.pathname.match(moviePattern)) {
        const contentID = urlParts.pathname.match(moviePattern)?.[1];
        androidLink = `intent://www.netflix.com/title/${contentID}#Intent;package=com.netflix.mediaclient;scheme=https;${fallbackTag}end;`;
      }

      // Genre spécifique
      if (!androidLink && urlParts.pathname.match(genrePattern)) {
        const genreID = urlParts.pathname.match(genrePattern)?.[1];
        androidLink = `intent://www.netflix.com/browse/genre/${genreID}#Intent;package=com.netflix.mediaclient;scheme=https;${fallbackTag}end;`;
      }

      // Page des profils utilisateur
      if (!androidLink && urlParts.pathname.match(profilePattern)) {
        androidLink = `intent://www.netflix.com/ProfilesGate#Intent;package=com.netflix.mediaclient;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général pour Netflix non géré
      if (!androidLink) {
        androidLink = `intent://www.netflix.com${urlParts.pathname}#Intent;package=com.netflix.mediaclient;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  snapchat: {
    ios: (urlParts: URL) => {
      const userPattern = /^\/add\/([\w-]+)\/?$/; // Profil utilisateur
      const storyPattern = /^\/discover\/([\w-]+)\/?$/; // Story ou contenu spécifique
      let iosLink = null;

      // Profil utilisateur spécifique
      if (urlParts.pathname.match(userPattern)) {
        const username = urlParts.pathname.match(userPattern)?.[1];
        iosLink = `snapchat://add/${username}`;
      }

      // Story ou contenu Discover spécifique
      if (!iosLink && urlParts.pathname.match(storyPattern)) {
        const storyID = urlParts.pathname.match(storyPattern)?.[1];
        iosLink = `snapchat://discover/${storyID}`;
      }

      // Fallback général pour Snapchat non géré
      if (!iosLink) {
        iosLink = `snapchat://${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const userPattern = /^\/add\/([\w-]+)\/?$/; // Profil utilisateur
      const storyPattern = /^\/discover\/([\w-]+)\/?$/; // Story ou contenu spécifique
      let androidLink = null;

      // Profil utilisateur spécifique
      if (urlParts.pathname.match(userPattern)) {
        const username = urlParts.pathname.match(userPattern)?.[1];
        androidLink = `intent://add/${username}#Intent;package=com.snapchat.android;scheme=snapchat;${fallbackTag}end;`;
      }

      // Story ou contenu Discover spécifique
      if (!androidLink && urlParts.pathname.match(storyPattern)) {
        const storyID = urlParts.pathname.match(storyPattern)?.[1];
        androidLink = `intent://discover/${storyID}#Intent;package=com.snapchat.android;scheme=snapchat;${fallbackTag}end;`;
      }

      // Fallback général pour Snapchat non géré
      if (!androidLink) {
        androidLink = `intent://${urlParts.host}${urlParts.pathname}#Intent;package=com.snapchat.android;scheme=snapchat;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  telegram: {
    ios: (urlParts: URL) => {
      const usernamePattern = /^\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour le nom d'utilisateur ou groupe
      const joinChatPattern = /^\/joinchat\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour rejoindre un chat via lien
      let iosLink = null;

      // Gestion des utilisateurs ou des groupes
      if (urlParts.pathname.match(usernamePattern)) {
        const username = urlParts.pathname.match(usernamePattern)?.[1];
        iosLink = `tg://resolve?domain=${username}`;
      }

      // Gestion des liens pour rejoindre un chat
      if (!iosLink && urlParts.pathname.match(joinChatPattern)) {
        const chatID = urlParts.pathname.match(joinChatPattern)?.[1];
        iosLink = `tg://join?invite=${chatID}`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `tg://${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const usernamePattern = /^\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour le nom d'utilisateur ou groupe
      const joinChatPattern = /^\/joinchat\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour rejoindre un chat via lien
      let androidLink = null;

      // Gestion des utilisateurs ou des groupes
      if (urlParts.pathname.match(usernamePattern)) {
        const username = urlParts.pathname.match(usernamePattern)?.[1];
        androidLink = `intent://resolve?domain=${username}#Intent;package=org.telegram.messenger;scheme=tg;${fallbackTag}end;`;
      }

      // Gestion des liens pour rejoindre un chat
      if (!androidLink && urlParts.pathname.match(joinChatPattern)) {
        const chatID = urlParts.pathname.match(joinChatPattern)?.[1];
        androidLink = `intent://join?invite=${chatID}#Intent;package=org.telegram.messenger;scheme=tg;${fallbackTag}end;`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://${urlParts.host}${urlParts.pathname}#Intent;package=org.telegram.messenger;scheme=tg;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  threads: {
    ios: (urlParts: URL) => {
      const profilePattern = /^\/@([a-zA-Z0-9_]+)\/?$/; // Pattern pour les profils
      const postPattern = /^\/@([a-zA-Z0-9_]+)\/posts\/(\d+)\/?$/; // Pattern pour les publications spécifiques
      let iosLink = null;

      // Gestion des profils Threads (par exemple : /@username)
      if (urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.match(profilePattern)?.[1];
        iosLink = `barcelona://user?username=${username}`;
      }

      // Gestion des publications spécifiques (par exemple : /@username/posts/123456)
      if (!iosLink && urlParts.pathname.match(postPattern)) {
        const username = urlParts.pathname.match(postPattern)?.[1];
        const postId = urlParts.pathname.match(postPattern)?.[2];
        iosLink = `barcelona://post?username=${username}&postId=${postId}`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `barcelona://threads${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const profilePattern = /^\/@([a-zA-Z0-9_]+)\/?$/; // Pattern pour les profils
      const postPattern = /^\/@([a-zA-Z0-9_]+)\/posts\/(\d+)\/?$/; // Pattern pour les publications spécifiques
      let androidLink = null;

      // Gestion des profils Threads (par exemple : /@username)
      if (urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.match(profilePattern)?.[1];
        androidLink = `intent://user?username=${username}#Intent;package=com.instagram.barcelona;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des publications spécifiques (par exemple : /@username/posts/123456)
      if (!androidLink && urlParts.pathname.match(postPattern)) {
        const username = urlParts.pathname.match(postPattern)?.[1];
        const postId = urlParts.pathname.match(postPattern)?.[2];
        androidLink = `intent://post?username=${username}&postId=${postId}#Intent;package=com.instagram.barcelona;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://threads${urlParts.pathname}#Intent;package=com.instagram.barcelona;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  tiktok: {
    ios: (urlParts: URL) => {
      const videoPattern = /^\/@([a-zA-Z0-9_]+)\/video\/(\d+)\/?$/; // Pattern pour les vidéos spécifiques
      const profilePattern = /^\/@([a-zA-Z0-9_]+)\/?$/; // Pattern pour les profils TikTok
      let iosLink = null;

      // Gestion des vidéos spécifiques (par exemple : /@username/video/1234567890)
      if (urlParts.pathname.match(videoPattern)) {
        const username = urlParts.pathname.match(videoPattern)?.[1];
        const videoId = urlParts.pathname.match(videoPattern)?.[2];
        iosLink = `snssdk1233://user/${username}/video/${videoId}`;
      }

      // Gestion des profils TikTok (par exemple : /@username)
      if (!iosLink && urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.match(profilePattern)?.[1];
        iosLink = `snssdk1233://user/${username}`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `snssdk1233://tiktok${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const videoPattern = /^\/@([a-zA-Z0-9_]+)\/video\/(\d+)\/?$/; // Pattern pour les vidéos spécifiques
      const profilePattern = /^\/@([a-zA-Z0-9_]+)\/?$/; // Pattern pour les profils TikTok
      let androidLink = null;

      // Gestion des vidéos spécifiques (par exemple : /@username/video/1234567890)
      if (urlParts.pathname.match(videoPattern)) {
        const username = urlParts.pathname.match(videoPattern)?.[1];
        const videoId = urlParts.pathname.match(videoPattern)?.[2];
        androidLink = `intent://user/${username}/video/${videoId}#Intent;package=com.zhiliaoapp.musically;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des profils TikTok (par exemple : /@username)
      if (!androidLink && urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.match(profilePattern)?.[1];
        androidLink = `intent://user/${username}#Intent;package=com.zhiliaoapp.musically;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://tiktok${urlParts.pathname}#Intent;package=com.zhiliaoapp.musically;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  twitch: {
    ios: (urlParts: URL) => {
      const streamPattern = /^\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour les streams live (par exemple : /username)
      const videoPattern = /^\/videos\/(\d+)\/?$/; // Pattern pour les vidéos spécifiques (VODs)
      const clipPattern = /^\/clip\/([a-zA-Z0-9_-]+)\/?$/; // Pattern pour les clips (par exemple : /clip/ClipName)
      let iosLink = null;

      // Gestion des streams live (par exemple : /username)
      if (urlParts.pathname.match(streamPattern)) {
        const username = urlParts.pathname.match(streamPattern)?.[1];
        iosLink = `twitch://stream/${username}`;
      }

      // Gestion des vidéos spécifiques (par exemple : /videos/1234567890)
      if (!iosLink && urlParts.pathname.match(videoPattern)) {
        const videoId = urlParts.pathname.match(videoPattern)?.[1];
        iosLink = `twitch://video/${videoId}`;
      }

      // Gestion des clips (par exemple : /clip/ClipName)
      if (!iosLink && urlParts.pathname.match(clipPattern)) {
        const clipName = urlParts.pathname.match(clipPattern)?.[1];
        iosLink = `twitch://clip/${clipName}`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `twitch://twitch${urlParts.pathname}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const streamPattern = /^\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour les streams live (par exemple : /username)
      const videoPattern = /^\/videos\/(\d+)\/?$/; // Pattern pour les vidéos spécifiques (VODs)
      const clipPattern = /^\/clip\/([a-zA-Z0-9_-]+)\/?$/; // Pattern pour les clips (par exemple : /clip/ClipName)
      let androidLink = null;

      // Gestion des streams live (par exemple : /username)
      if (urlParts.pathname.match(streamPattern)) {
        const username = urlParts.pathname.match(streamPattern)?.[1];
        androidLink = `intent://stream/${username}#Intent;package=tv.twitch.android.app;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des vidéos spécifiques (par exemple : /videos/1234567890)
      if (!androidLink && urlParts.pathname.match(videoPattern)) {
        const videoId = urlParts.pathname.match(videoPattern)?.[1];
        androidLink = `intent://video/${videoId}#Intent;package=tv.twitch.android.app;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des clips (par exemple : /clip/ClipName)
      if (!androidLink && urlParts.pathname.match(clipPattern)) {
        const clipName = urlParts.pathname.match(clipPattern)?.[1];
        androidLink = `intent://clip/${clipName}#Intent;package=tv.twitch.android.app;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://twitch${urlParts.pathname}#Intent;package=tv.twitch.android.app;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  twitter: {
    ios: (urlParts: URL) => {
      const userPattern = /^\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour les utilisateurs (par exemple : /username)
      const tweetPattern = /^\/([a-zA-Z0-9_]+)\/status\/(\d+)\/?$/; // Pattern pour les tweets spécifiques
      const hashtagPattern = /^\/hashtag\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour les hashtags
      let iosLink = null;

      // Gestion des tweets spécifiques (par exemple : /username/status/1234567890)
      if (urlParts.pathname.match(tweetPattern)) {
        const tweetId = urlParts.pathname.match(tweetPattern)?.[2];
        iosLink = `twitter://status?id=${tweetId}`;
      }

      // Gestion des utilisateurs (par exemple : /username)
      if (!iosLink && urlParts.pathname.match(userPattern)) {
        const username = urlParts.pathname.match(userPattern)?.[1];
        iosLink = `twitter://user?screen_name=${username}`;
      }

      // Gestion des hashtags (par exemple : /hashtag/hashtagName)
      if (!iosLink && urlParts.pathname.match(hashtagPattern)) {
        const hashtag = urlParts.pathname.match(hashtagPattern)?.[1];
        iosLink = `twitter://search?query=%23${hashtag}`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `twitter://timeline`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const userPattern = /^\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour les utilisateurs (par exemple : /username)
      const tweetPattern = /^\/([a-zA-Z0-9_]+)\/status\/(\d+)\/?$/; // Pattern pour les tweets spécifiques
      const hashtagPattern = /^\/hashtag\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour les hashtags
      let androidLink = null;

      // Gestion des tweets spécifiques (par exemple : /username/status/1234567890)
      if (urlParts.pathname.match(tweetPattern)) {
        const tweetId = urlParts.pathname.match(tweetPattern)?.[2];
        androidLink = `intent://status/${tweetId}#Intent;package=com.twitter.android;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des utilisateurs (par exemple : /username)
      if (!androidLink && urlParts.pathname.match(userPattern)) {
        const username = urlParts.pathname.match(userPattern)?.[1];
        androidLink = `intent://user?screen_name=${username}#Intent;package=com.twitter.android;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des hashtags (par exemple : /hashtag/hashtagName)
      if (!androidLink && urlParts.pathname.match(hashtagPattern)) {
        const hashtag = urlParts.pathname.match(hashtagPattern)?.[1];
        androidLink = `intent://search?query=%23${hashtag}#Intent;package=com.twitter.android;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://timeline#Intent;package=com.twitter.android;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  x: {
    ios: (urlParts: URL) => {
      const userPattern = /^\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour les utilisateurs (par exemple : /username)
      const tweetPattern = /^\/([a-zA-Z0-9_]+)\/status\/(\d+)\/?$/; // Pattern pour les tweets spécifiques
      const hashtagPattern = /^\/hashtag\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour les hashtags
      let iosLink = null;

      // Gestion des tweets spécifiques (par exemple : /username/status/1234567890)
      if (urlParts.pathname.match(tweetPattern)) {
        const tweetId = urlParts.pathname.match(tweetPattern)?.[2];
        iosLink = `twitter://status?id=${tweetId}`;
      }

      // Gestion des utilisateurs (par exemple : /username)
      if (!iosLink && urlParts.pathname.match(userPattern)) {
        const username = urlParts.pathname.match(userPattern)?.[1];
        iosLink = `twitter://user?screen_name=${username}`;
      }

      // Gestion des hashtags (par exemple : /hashtag/hashtagName)
      if (!iosLink && urlParts.pathname.match(hashtagPattern)) {
        const hashtag = urlParts.pathname.match(hashtagPattern)?.[1];
        iosLink = `twitter://search?query=%23${hashtag}`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `twitter://timeline`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const userPattern = /^\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour les utilisateurs (par exemple : /username)
      const tweetPattern = /^\/([a-zA-Z0-9_]+)\/status\/(\d+)\/?$/; // Pattern pour les tweets spécifiques
      const hashtagPattern = /^\/hashtag\/([a-zA-Z0-9_]+)\/?$/; // Pattern pour les hashtags
      let androidLink = null;

      // Gestion des tweets spécifiques (par exemple : /username/status/1234567890)
      if (urlParts.pathname.match(tweetPattern)) {
        const tweetId = urlParts.pathname.match(tweetPattern)?.[2];
        androidLink = `intent://status/${tweetId}#Intent;package=com.twitter.android;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des utilisateurs (par exemple : /username)
      if (!androidLink && urlParts.pathname.match(userPattern)) {
        const username = urlParts.pathname.match(userPattern)?.[1];
        androidLink = `intent://user?screen_name=${username}#Intent;package=com.twitter.android;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des hashtags (par exemple : /hashtag/hashtagName)
      if (!androidLink && urlParts.pathname.match(hashtagPattern)) {
        const hashtag = urlParts.pathname.match(hashtagPattern)?.[1];
        androidLink = `intent://search?query=%23${hashtag}#Intent;package=com.twitter.android;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://timeline#Intent;package=com.twitter.android;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  youtubemusic: {
    ios: (urlParts: URL) => {
      const musicPattern = /^\/watch\?v=([a-zA-Z0-9_-]+)$/; // Pattern pour les vidéos musicales (ex: /watch?v=ID)
      const playlistPattern = /^\/playlist\?list=([a-zA-Z0-9_-]+)$/; // Pattern pour les playlists (ex: /playlist?list=ID)
      const albumPattern = /^\/browse\/([A-Za-z0-9_-]+)$/; // Pattern pour les albums ou artistes (ex: /browse/ID)
      let iosLink = null;

      // Gestion des vidéos musicales (ex: /watch?v=VIDEO_ID)
      if (urlParts.pathname.match(musicPattern)) {
        const videoID = urlParts.searchParams.get('v');
        iosLink = `youtube://music/${videoID}`;
      }

      // Gestion des playlists (ex: /playlist?list=PLAYLIST_ID)
      if (!iosLink && urlParts.pathname.match(playlistPattern)) {
        const playlistID = urlParts.searchParams.get('list');
        iosLink = `youtube://playlist?list=${playlistID}`;
      }

      // Gestion des albums ou artistes (ex: /browse/ARTIST_ID ou /browse/ALBUM_ID)
      if (!iosLink && urlParts.pathname.match(albumPattern)) {
        const browseID = urlParts.pathname.split('/').pop();
        iosLink = `youtube://browse/${browseID}`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `youtube://music_home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const musicPattern = /^\/watch\?v=([a-zA-Z0-9_-]+)$/; // Pattern pour les vidéos musicales (ex: /watch?v=ID)
      const playlistPattern = /^\/playlist\?list=([a-zA-Z0-9_-]+)$/; // Pattern pour les playlists (ex: /playlist?list=ID)
      const albumPattern = /^\/browse\/([A-Za-z0-9_-]+)$/; // Pattern pour les albums ou artistes (ex: /browse/ID)
      let androidLink = null;

      // Gestion des vidéos musicales (ex: /watch?v=VIDEO_ID)
      if (urlParts.pathname.match(musicPattern)) {
        const videoID = urlParts.searchParams.get('v');
        androidLink = `intent://music/${videoID}#Intent;package=com.google.android.apps.youtube.music;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des playlists (ex: /playlist?list=PLAYLIST_ID)
      if (!androidLink && urlParts.pathname.match(playlistPattern)) {
        const playlistID = urlParts.searchParams.get('list');
        androidLink = `intent://playlist?list=${playlistID}#Intent;package=com.google.android.apps.youtube.music;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des albums ou artistes (ex: /browse/ARTIST_ID ou /browse/ALBUM_ID)
      if (!androidLink && urlParts.pathname.match(albumPattern)) {
        const browseID = urlParts.pathname.split('/').pop();
        androidLink = `intent://browse/${browseID}#Intent;package=com.google.android.apps.youtube.music;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://music_home#Intent;package=com.google.android.apps.youtube.music;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  asos: {
    ios: (urlParts: URL) => {
      const productPattern = /^\/prd\/([0-9]+)$/; // Pattern pour les pages produits (ex: /prd/PRODUCT_ID)
      const categoryPattern = /^\/cat\/([0-9]+)$/; // Pattern pour les pages de catégories (ex: /cat/CATEGORY_ID)
      let iosLink = null;

      // Gestion des produits (ex: /prd/PRODUCT_ID)
      if (urlParts.pathname.match(productPattern)) {
        const productID = urlParts.pathname.split('/').pop();
        iosLink = `asos://product?iid=${productID}`;
      }

      // Gestion des catégories (ex: /cat/CATEGORY_ID)
      if (!iosLink && urlParts.pathname.match(categoryPattern)) {
        const categoryID = urlParts.pathname.split('/').pop();
        iosLink = `asos://category?id=${categoryID}`;
      }

      // Gestion des régions (ex: /gb, /fr)
      const regionCode = urlParts.pathname.split('/')[1];
      if (regionCode && !iosLink) {
        iosLink = `asos://${regionCode}`;
      }

      // Fallback général
      if (!iosLink) {
        iosLink = `asos://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      const productPattern = /^\/prd\/([0-9]+)$/; // Pattern pour les pages produits (ex: /prd/PRODUCT_ID)
      const categoryPattern = /^\/cat\/([0-9]+)$/; // Pattern pour les pages de catégories (ex: /cat/CATEGORY_ID)
      let androidLink = null;

      // Gestion des produits (ex: /prd/PRODUCT_ID)
      if (urlParts.pathname.match(productPattern)) {
        const productID = urlParts.pathname.split('/').pop();
        androidLink = `intent://product?iid=${productID}#Intent;package=com.asos.app;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des catégories (ex: /cat/CATEGORY_ID)
      if (!androidLink && urlParts.pathname.match(categoryPattern)) {
        const categoryID = urlParts.pathname.split('/').pop();
        androidLink = `intent://category?id=${categoryID}#Intent;package=com.asos.app;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des régions (ex: /gb, /fr)
      const regionCode = urlParts.pathname.split('/')[1];
      if (regionCode && !androidLink) {
        androidLink = `intent://home/${regionCode}#Intent;package=com.asos.app;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général
      if (!androidLink) {
        androidLink = `intent://home#Intent;package=com.asos.app;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  deezer: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les tracks
      const trackPattern = /^\/track\/([0-9]+)$/; // ex: /track/TRACK_ID
      // Pattern pour les albums
      const albumPattern = /^\/album\/([0-9]+)$/; // ex: /album/ALBUM_ID
      // Pattern pour les playlists
      const playlistPattern = /^\/playlist\/([0-9]+)$/; // ex: /playlist/PLAYLIST_ID
      // Pattern pour les utilisateurs
      const userPattern = /^\/profile\/([0-9]+)$/; // ex: /profile/USER_ID

      // Gestion des tracks
      if (urlParts.pathname.match(trackPattern)) {
        const trackID = urlParts.pathname.split('/').pop();
        iosLink = `deezer://track/${trackID}`;
      }

      // Gestion des albums
      if (!iosLink && urlParts.pathname.match(albumPattern)) {
        const albumID = urlParts.pathname.split('/').pop();
        iosLink = `deezer://album/${albumID}`;
      }

      // Gestion des playlists
      if (!iosLink && urlParts.pathname.match(playlistPattern)) {
        const playlistID = urlParts.pathname.split('/').pop();
        iosLink = `deezer://playlist/${playlistID}`;
      }

      // Gestion des utilisateurs
      if (!iosLink && urlParts.pathname.match(userPattern)) {
        const userID = urlParts.pathname.split('/').pop();
        iosLink = `deezer://profile/${userID}`;
      }

      // Fallback général vers Deezer si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `deezer://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les tracks
      const trackPattern = /^\/track\/([0-9]+)$/; // ex: /track/TRACK_ID
      // Pattern pour les albums
      const albumPattern = /^\/album\/([0-9]+)$/; // ex: /album/ALBUM_ID
      // Pattern pour les playlists
      const playlistPattern = /^\/playlist\/([0-9]+)$/; // ex: /playlist/PLAYLIST_ID
      // Pattern pour les utilisateurs
      const userPattern = /^\/profile\/([0-9]+)$/; // ex: /profile/USER_ID

      // Gestion des tracks
      if (urlParts.pathname.match(trackPattern)) {
        const trackID = urlParts.pathname.split('/').pop();
        androidLink = `intent://track/${trackID}#Intent;package=deezer.android.app;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des albums
      if (!androidLink && urlParts.pathname.match(albumPattern)) {
        const albumID = urlParts.pathname.split('/').pop();
        androidLink = `intent://album/${albumID}#Intent;package=deezer.android.app;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des playlists
      if (!androidLink && urlParts.pathname.match(playlistPattern)) {
        const playlistID = urlParts.pathname.split('/').pop();
        androidLink = `intent://playlist/${playlistID}#Intent;package=deezer.android.app;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des utilisateurs
      if (!androidLink && urlParts.pathname.match(userPattern)) {
        const userID = urlParts.pathname.split('/').pop();
        androidLink = `intent://profile/${userID}#Intent;package=deezer.android.app;scheme=https;${fallbackTag}end;`;
      }

      // Fallback général vers Deezer si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://home#Intent;package=deezer.android.app;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  deliveroo: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les restaurants : /restaurant/restaurant_id
      const restaurantPattern = /^\/restaurant\/([a-zA-Z0-9_-]+)$/; // ex: /restaurant/RESTAURANT_ID
      // Pattern pour les menus : /menu/restaurant_id
      const menuPattern = /^\/menu\/([a-zA-Z0-9_-]+)$/; // ex: /menu/RESTAURANT_ID
      // Pattern pour les catégories : /category/category_id
      const categoryPattern = /^\/category\/([a-zA-Z0-9_-]+)$/; // ex: /category/CATEGORY_ID
      // Pattern pour les commandes : /order/order_id
      const orderPattern = /^\/order\/([a-zA-Z0-9_-]+)$/; // ex: /order/ORDER_ID

      // Gestion des restaurants
      if (urlParts.pathname.match(restaurantPattern)) {
        const restaurantID = urlParts.pathname.split('/').pop();
        iosLink = `deliveroo://restaurant/${restaurantID}`;
      }

      // Gestion des menus
      if (!iosLink && urlParts.pathname.match(menuPattern)) {
        const restaurantID = urlParts.pathname.split('/').pop();
        iosLink = `deliveroo://menu/${restaurantID}`;
      }

      // Gestion des catégories
      if (!iosLink && urlParts.pathname.match(categoryPattern)) {
        const categoryID = urlParts.pathname.split('/').pop();
        iosLink = `deliveroo://category/${categoryID}`;
      }

      // Gestion des commandes
      if (!iosLink && urlParts.pathname.match(orderPattern)) {
        const orderID = urlParts.pathname.split('/').pop();
        iosLink = `deliveroo://order/${orderID}`;
      }

      // Fallback vers Deliveroo si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `deliveroo://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les restaurants : /restaurant/restaurant_id
      const restaurantPattern = /^\/restaurant\/([a-zA-Z0-9_-]+)$/; // ex: /restaurant/RESTAURANT_ID
      // Pattern pour les menus : /menu/restaurant_id
      const menuPattern = /^\/menu\/([a-zA-Z0-9_-]+)$/; // ex: /menu/RESTAURANT_ID
      // Pattern pour les catégories : /category/category_id
      const categoryPattern = /^\/category\/([a-zA-Z0-9_-]+)$/; // ex: /category/CATEGORY_ID
      // Pattern pour les commandes : /order/order_id
      const orderPattern = /^\/order\/([a-zA-Z0-9_-]+)$/; // ex: /order/ORDER_ID

      // Gestion des restaurants
      if (urlParts.pathname.match(restaurantPattern)) {
        const restaurantID = urlParts.pathname.split('/').pop();
        androidLink = `intent://restaurant/${restaurantID}#Intent;package=com.deliveroo.orderapp;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des menus
      if (!androidLink && urlParts.pathname.match(menuPattern)) {
        const restaurantID = urlParts.pathname.split('/').pop();
        androidLink = `intent://menu/${restaurantID}#Intent;package=com.deliveroo.orderapp;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des catégories
      if (!androidLink && urlParts.pathname.match(categoryPattern)) {
        const categoryID = urlParts.pathname.split('/').pop();
        androidLink = `intent://category/${categoryID}#Intent;package=com.deliveroo.orderapp;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des commandes
      if (!androidLink && urlParts.pathname.match(orderPattern)) {
        const orderID = urlParts.pathname.split('/').pop();
        androidLink = `intent://order/${orderID}#Intent;package=com.deliveroo.orderapp;scheme=https;${fallbackTag}end;`;
      }

      // Fallback vers Deliveroo si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://home#Intent;package=com.deliveroo.orderapp;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  doordash: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les restaurants : /store/restaurant_id
      const restaurantPattern = /^\/store\/([a-zA-Z0-9_-]+)$/; // ex: /store/RESTAURANT_ID
      // Pattern pour les commandes : /order/order_id
      const orderPattern = /^\/order\/([a-zA-Z0-9_-]+)$/; // ex: /order/ORDER_ID
      // Pattern pour les catégories : /category/category_id
      const categoryPattern = /^\/category\/([a-zA-Z0-9_-]+)$/; // ex: /category/CATEGORY_ID

      // Gestion des restaurants
      if (urlParts.pathname.match(restaurantPattern)) {
        const restaurantID = urlParts.pathname.split('/').pop();
        iosLink = `doordash://store/${restaurantID}`;
      }

      // Gestion des commandes
      if (!iosLink && urlParts.pathname.match(orderPattern)) {
        const orderID = urlParts.pathname.split('/').pop();
        iosLink = `doordash://order/${orderID}`;
      }

      // Gestion des catégories
      if (!iosLink && urlParts.pathname.match(categoryPattern)) {
        const categoryID = urlParts.pathname.split('/').pop();
        iosLink = `doordash://category/${categoryID}`;
      }

      // Fallback vers DoorDash si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `doordash://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les restaurants : /store/restaurant_id
      const restaurantPattern = /^\/store\/([a-zA-Z0-9_-]+)$/; // ex: /store/RESTAURANT_ID
      // Pattern pour les commandes : /order/order_id
      const orderPattern = /^\/order\/([a-zA-Z0-9_-]+)$/; // ex: /order/ORDER_ID
      // Pattern pour les catégories : /category/category_id
      const categoryPattern = /^\/category\/([a-zA-Z0-9_-]+)$/; // ex: /category/CATEGORY_ID

      // Gestion des restaurants
      if (urlParts.pathname.match(restaurantPattern)) {
        const restaurantID = urlParts.pathname.split('/').pop();
        androidLink = `intent://store/${restaurantID}#Intent;package=com.dd.doordash;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des commandes
      if (!androidLink && urlParts.pathname.match(orderPattern)) {
        const orderID = urlParts.pathname.split('/').pop();
        androidLink = `intent://order/${orderID}#Intent;package=com.dd.doordash;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des catégories
      if (!androidLink && urlParts.pathname.match(categoryPattern)) {
        const categoryID = urlParts.pathname.split('/').pop();
        androidLink = `intent://category/${categoryID}#Intent;package=com.dd.doordash;scheme=https;${fallbackTag}end;`;
      }

      // Fallback vers DoorDash si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://home#Intent;package=com.dd.doordash;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  etsy: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les produits : /listing/PRODUCT_ID
      const productPattern = /^\/listing\/(\d+)$/; // ex: /listing/123456789
      // Pattern pour les magasins : /shop/SHOP_NAME
      const shopPattern = /^\/shop\/([a-zA-Z0-9_-]+)$/; // ex: /shop/ShopName
      // Pattern pour les catégories : /c/category
      const categoryPattern = /^\/c\/([a-zA-Z0-9_-]+)$/; // ex: /c/jewelry

      // Gestion des produits
      if (urlParts.pathname.match(productPattern)) {
        const productID = urlParts.pathname.split('/').pop();
        iosLink = `etsy://listing/${productID}`;
      }

      // Gestion des magasins
      if (!iosLink && urlParts.pathname.match(shopPattern)) {
        const shopName = urlParts.pathname.split('/').pop();
        iosLink = `etsy://shop/${shopName}`;
      }

      // Gestion des catégories
      if (!iosLink && urlParts.pathname.match(categoryPattern)) {
        const categoryName = urlParts.pathname.split('/').pop();
        iosLink = `etsy://category/${categoryName}`;
      }

      // Fallback vers Etsy si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `etsy://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les produits : /listing/PRODUCT_ID
      const productPattern = /^\/listing\/(\d+)$/; // ex: /listing/123456789
      // Pattern pour les magasins : /shop/SHOP_NAME
      const shopPattern = /^\/shop\/([a-zA-Z0-9_-]+)$/; // ex: /shop/ShopName
      // Pattern pour les catégories : /c/category
      const categoryPattern = /^\/c\/([a-zA-Z0-9_-]+)$/; // ex: /c/jewelry

      // Gestion des produits
      if (urlParts.pathname.match(productPattern)) {
        const productID = urlParts.pathname.split('/').pop();
        androidLink = `intent://listing/${productID}#Intent;package=com.etsy.android;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des magasins
      if (!androidLink && urlParts.pathname.match(shopPattern)) {
        const shopName = urlParts.pathname.split('/').pop();
        androidLink = `intent://shop/${shopName}#Intent;package=com.etsy.android;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des catégories
      if (!androidLink && urlParts.pathname.match(categoryPattern)) {
        const categoryName = urlParts.pathname.split('/').pop();
        androidLink = `intent://category/${categoryName}#Intent;package=com.etsy.android;scheme=https;${fallbackTag}end;`;
      }

      // Fallback vers Etsy si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://home#Intent;package=com.etsy.android;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  facebook: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Patterns pour les différents types de contenu sur Facebook
      const profilePattern = /^\/([a-zA-Z0-9._-]+)\/?$/; // ex: /username
      const pagePattern = /^\/pages\/([a-zA-Z0-9._-]+)\/(\d+)\/?$/; // ex: /pages/page-name/123456789
      const groupPattern = /^\/groups\/(\d+)\/?$/; // ex: /groups/123456789
      const eventPattern = /^\/events\/(\d+)\/?$/; // ex: /events/123456789
      const postPattern = /^\/([a-zA-Z0-9._-]+)\/posts\/(\d+)\/?$/; // ex: /username/posts/123456789
      const videoPattern = /^\/([a-zA-Z0-9._-]+)\/videos\/(\d+)\/?$/; // ex: /username/videos/123456789

      // Gestion des profils utilisateurs
      if (urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.split('/')[1];
        iosLink = `fb://profile/${username}`;
      }

      // Gestion des pages Facebook
      if (!iosLink && urlParts.pathname.match(pagePattern)) {
        const pageID = urlParts.pathname.split('/').pop();
        iosLink = `fb://page/${pageID}`;
      }

      // Gestion des groupes Facebook
      if (!iosLink && urlParts.pathname.match(groupPattern)) {
        const groupID = urlParts.pathname.split('/').pop();
        iosLink = `fb://group/${groupID}`;
      }

      // Gestion des événements Facebook
      if (!iosLink && urlParts.pathname.match(eventPattern)) {
        const eventID = urlParts.pathname.split('/').pop();
        iosLink = `fb://event/${eventID}`;
      }

      // Gestion des posts sur le profil
      if (!iosLink && urlParts.pathname.match(postPattern)) {
        const postID = urlParts.pathname.split('/').pop();
        iosLink = `fb://post/${postID}`;
      }

      // Gestion des vidéos sur le profil ou la page
      if (!iosLink && urlParts.pathname.match(videoPattern)) {
        const videoID = urlParts.pathname.split('/').pop();
        iosLink = `fb://video/${videoID}`;
      }

      // Fallback : redirection vers le modal web Facebook si aucun pattern ne correspond
      if (!iosLink) {
        iosLink = `fb://facewebmodal/f?href=${encodeURIComponent(urlParts.href)}`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Patterns pour les différents types de contenu sur Facebook
      const profilePattern = /^\/([a-zA-Z0-9._-]+)\/?$/; // ex: /username
      const pagePattern = /^\/pages\/([a-zA-Z0-9._-]+)\/(\d+)\/?$/; // ex: /pages/page-name/123456789
      const groupPattern = /^\/groups\/(\d+)\/?$/; // ex: /groups/123456789
      const eventPattern = /^\/events\/(\d+)\/?$/; // ex: /events/123456789
      const postPattern = /^\/([a-zA-Z0-9._-]+)\/posts\/(\d+)\/?$/; // ex: /username/posts/123456789
      const videoPattern = /^\/([a-zA-Z0-9._-]+)\/videos\/(\d+)\/?$/; // ex: /username/videos/123456789

      // Gestion des profils utilisateurs
      if (urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.split('/')[1];
        androidLink = `intent://profile/${username}#Intent;package=com.facebook.katana;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des pages Facebook
      if (!androidLink && urlParts.pathname.match(pagePattern)) {
        const pageID = urlParts.pathname.split('/').pop();
        androidLink = `intent://page/${pageID}#Intent;package=com.facebook.katana;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des groupes Facebook
      if (!androidLink && urlParts.pathname.match(groupPattern)) {
        const groupID = urlParts.pathname.split('/').pop();
        androidLink = `intent://group/${groupID}#Intent;package=com.facebook.katana;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des événements Facebook
      if (!androidLink && urlParts.pathname.match(eventPattern)) {
        const eventID = urlParts.pathname.split('/').pop();
        androidLink = `intent://event/${eventID}#Intent;package=com.facebook.katana;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des posts sur le profil
      if (!androidLink && urlParts.pathname.match(postPattern)) {
        const postID = urlParts.pathname.split('/').pop();
        androidLink = `intent://post/${postID}#Intent;package=com.facebook.katana;scheme=https;${fallbackTag}end;`;
      }

      // Gestion des vidéos sur le profil ou la page
      if (!androidLink && urlParts.pathname.match(videoPattern)) {
        const videoID = urlParts.pathname.split('/').pop();
        androidLink = `intent://video/${videoID}#Intent;package=com.facebook.katana;scheme=https;${fallbackTag}end;`;
      }

      // Fallback : redirection vers le modal web Facebook si aucun pattern ne correspond
      if (!androidLink) {
        androidLink = `intent://facewebmodal/f?href=${encodeURIComponent(urlParts.href)}#Intent;package=com.facebook.katana;scheme=https;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  googlemaps: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Patterns pour différents types d'actions sur Google Maps
      const placePattern = /^\/maps\/place\/([^/]+)\/?$/; // ex: /maps/place/Eiffel+Tower/
      const searchPattern = /^\/maps\/search\/([^/]+)\/?$/; // ex: /maps/search/restaurants/
      const directionsPattern = /^\/maps\/dir\/([^/]+)\/([^/]+)\/?$/; // ex: /maps/dir/Paris/Eiffel+Tower/

      // Gestion des lieux spécifiques
      if (urlParts.pathname.match(placePattern)) {
        const placeName = urlParts.pathname.split('/')[3];
        iosLink = `comgooglemapsurl://?q=${placeName}`;
      }

      // Gestion des recherches sur Google Maps
      if (!iosLink && urlParts.pathname.match(searchPattern)) {
        const query = urlParts.pathname.split('/')[3];
        iosLink = `comgooglemapsurl://?q=${query}`;
      }

      // Gestion des itinéraires (directions)
      if (!iosLink && urlParts.pathname.match(directionsPattern)) {
        const [from, to] = urlParts.pathname.split('/').slice(3, 5);
        iosLink = `comgooglemaps://?saddr=${from}&daddr=${to}`;
      }

      // Fallback : Si aucun pattern ne correspond, redirection vers la vue générale de Google Maps
      if (!iosLink) {
        iosLink = `comgooglemapsurl://?center=${urlParts.searchParams.get('ll') || '0,0'}&zoom=14`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Patterns pour différents types d'actions sur Google Maps
      const placePattern = /^\/maps\/place\/([^/]+)\/?$/; // ex: /maps/place/Eiffel+Tower/
      const searchPattern = /^\/maps\/search\/([^/]+)\/?$/; // ex: /maps/search/restaurants/
      const directionsPattern = /^\/maps\/dir\/([^/]+)\/([^/]+)\/?$/; // ex: /maps/dir/Paris/Eiffel+Tower/

      // Gestion des lieux spécifiques
      if (urlParts.pathname.match(placePattern)) {
        const placeName = urlParts.pathname.split('/')[3];
        androidLink = `intent://maps/place/${placeName}#Intent;scheme=https;package=com.google.android.apps.maps;${fallbackTag}end;`;
      }

      // Gestion des recherches sur Google Maps
      if (!androidLink && urlParts.pathname.match(searchPattern)) {
        const query = urlParts.pathname.split('/')[3];
        androidLink = `intent://maps/search/${query}#Intent;scheme=https;package=com.google.android.apps.maps;${fallbackTag}end;`;
      }

      // Gestion des itinéraires (directions)
      if (!androidLink && urlParts.pathname.match(directionsPattern)) {
        const [from, to] = urlParts.pathname.split('/').slice(3, 5);
        androidLink = `intent://maps/dir/?saddr=${from}&daddr=${to}#Intent;scheme=https;package=com.google.android.apps.maps;${fallbackTag}end;`;
      }

      // Fallback : Si aucun pattern ne correspond, redirection vers la vue générale de Google Maps
      if (!androidLink) {
        const ll = urlParts.searchParams.get('ll') || '0,0';
        androidLink = `intent://maps/?ll=${ll}&zoom=14#Intent;scheme=https;package=com.google.android.apps.maps;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  nextdoor: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les profils utilisateur sur Nextdoor
      const profilePattern = /^\/profile\/([^/]+)\/?$/; // ex: /profile/john-doe

      // Pattern pour les événements spécifiques
      const eventPattern = /^\/events\/([^/]+)\/?$/; // ex: /events/123456

      // Pattern pour les groupes spécifiques
      const groupPattern = /^\/groups\/([^/]+)\/?$/; // ex: /groups/7890

      // Gestion des profils utilisateur
      if (urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.split('/')[2];
        iosLink = `nextdoor://profile/${username}`;
      }

      // Gestion des événements
      if (!iosLink && urlParts.pathname.match(eventPattern)) {
        const eventId = urlParts.pathname.split('/')[2];
        iosLink = `nextdoor://events/${eventId}`;
      }

      // Gestion des groupes
      if (!iosLink && urlParts.pathname.match(groupPattern)) {
        const groupId = urlParts.pathname.split('/')[2];
        iosLink = `nextdoor://groups/${groupId}`;
      }

      // Fallback : redirection vers l'accueil de Nextdoor si aucune correspondance
      if (!iosLink) {
        iosLink = `nextdoor://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les profils utilisateur sur Nextdoor
      const profilePattern = /^\/profile\/([^/]+)\/?$/; // ex: /profile/john-doe

      // Pattern pour les événements spécifiques
      const eventPattern = /^\/events\/([^/]+)\/?$/; // ex: /events/123456

      // Pattern pour les groupes spécifiques
      const groupPattern = /^\/groups\/([^/]+)\/?$/; // ex: /groups/7890

      // Gestion des profils utilisateur
      if (urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.split('/')[2];
        androidLink = `intent://profile/${username}#Intent;scheme=https;package=com.nextdoor;${fallbackTag}end;`;
      }

      // Gestion des événements
      if (!androidLink && urlParts.pathname.match(eventPattern)) {
        const eventId = urlParts.pathname.split('/')[2];
        androidLink = `intent://events/${eventId}#Intent;scheme=https;package=com.nextdoor;${fallbackTag}end;`;
      }

      // Gestion des groupes
      if (!androidLink && urlParts.pathname.match(groupPattern)) {
        const groupId = urlParts.pathname.split('/')[2];
        androidLink = `intent://groups/${groupId}#Intent;scheme=https;package=com.nextdoor;${fallbackTag}end;`;
      }

      // Fallback : redirection vers l'accueil de Nextdoor si aucune correspondance
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.nextdoor;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  reddit: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les subreddits
      const subredditPattern = /^\/r\/([^/]+)\/?$/; // ex: /r/technology

      // Pattern pour les posts spécifiques
      const postPattern = /^\/r\/[^/]+\/comments\/([^/]+)\/?$/; // ex: /r/technology/comments/abcdef

      // Pattern pour les utilisateurs
      const userPattern = /^\/user\/([^/]+)\/?$/; // ex: /user/username

      // Gestion des subreddits
      if (urlParts.pathname.match(subredditPattern)) {
        const subreddit = urlParts.pathname.split('/')[2];
        iosLink = `reddit://r/${subreddit}`;
      }

      // Gestion des posts spécifiques
      if (!iosLink && urlParts.pathname.match(postPattern)) {
        const postId = urlParts.pathname.split('/')[4];
        iosLink = `reddit://comments/${postId}`;
      }

      // Gestion des profils utilisateurs
      if (!iosLink && urlParts.pathname.match(userPattern)) {
        const username = urlParts.pathname.split('/')[2];
        iosLink = `reddit://user/${username}`;
      }

      // Fallback : redirection vers la page d'accueil de Reddit
      if (!iosLink) {
        iosLink = `reddit://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les subreddits
      const subredditPattern = /^\/r\/([^/]+)\/?$/; // ex: /r/technology

      // Pattern pour les posts spécifiques
      const postPattern = /^\/r\/[^/]+\/comments\/([^/]+)\/?$/; // ex: /r/technology/comments/abcdef

      // Pattern pour les utilisateurs
      const userPattern = /^\/user\/([^/]+)\/?$/; // ex: /user/username

      // Gestion des subreddits
      if (urlParts.pathname.match(subredditPattern)) {
        const subreddit = urlParts.pathname.split('/')[2];
        androidLink = `intent://r/${subreddit}#Intent;scheme=https;package=com.reddit.frontpage;${fallbackTag}end;`;
      }

      // Gestion des posts spécifiques
      if (!androidLink && urlParts.pathname.match(postPattern)) {
        const postId = urlParts.pathname.split('/')[4];
        androidLink = `intent://comments/${postId}#Intent;scheme=https;package=com.reddit.frontpage;${fallbackTag}end;`;
      }

      // Gestion des profils utilisateurs
      if (!androidLink && urlParts.pathname.match(userPattern)) {
        const username = urlParts.pathname.split('/')[2];
        androidLink = `intent://user/${username}#Intent;scheme=https;package=com.reddit.frontpage;${fallbackTag}end;`;
      }

      // Fallback : redirection vers la page d'accueil de Reddit
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.reddit.frontpage;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  spreaker: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les émissions (shows)
      const showPattern = /^\/show\/([^/]+)\/?$/; // ex: /show/show-name

      // Pattern pour les épisodes (episodes)
      const episodePattern = /^\/episode\/([^/]+)\/?$/; // ex: /episode/episode-id

      // Pattern pour les utilisateurs (users)
      const userPattern = /^\/user\/([^/]+)\/?$/; // ex: /user/user-id

      // Gestion des émissions (shows)
      if (urlParts.pathname.match(showPattern)) {
        const showId = urlParts.pathname.split('/')[2];
        iosLink = `spreaker://show/${showId}`;
      }

      // Gestion des épisodes (episodes)
      if (!iosLink && urlParts.pathname.match(episodePattern)) {
        const episodeId = urlParts.pathname.split('/')[2];
        iosLink = `spreaker://episode/${episodeId}`;
      }

      // Gestion des utilisateurs (users)
      if (!iosLink && urlParts.pathname.match(userPattern)) {
        const userId = urlParts.pathname.split('/')[2];
        iosLink = `spreaker://user/${userId}`;
      }

      // Fallback : redirection vers la page d'accueil de Spreaker
      if (!iosLink) {
        iosLink = `spreaker://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les émissions (shows)
      const showPattern = /^\/show\/([^/]+)\/?$/; // ex: /show/show-name

      // Pattern pour les épisodes (episodes)
      const episodePattern = /^\/episode\/([^/]+)\/?$/; // ex: /episode/episode-id

      // Pattern pour les utilisateurs (users)
      const userPattern = /^\/user\/([^/]+)\/?$/; // ex: /user/user-id

      // Gestion des émissions (shows)
      if (urlParts.pathname.match(showPattern)) {
        const showId = urlParts.pathname.split('/')[2];
        androidLink = `intent://show/${showId}#Intent;scheme=https;package=com.spreaker.android;${fallbackTag}end;`;
      }

      // Gestion des épisodes (episodes)
      if (!androidLink && urlParts.pathname.match(episodePattern)) {
        const episodeId = urlParts.pathname.split('/')[2];
        androidLink = `intent://episode/${episodeId}#Intent;scheme=https;package=com.spreaker.android;${fallbackTag}end;`;
      }

      // Gestion des utilisateurs (users)
      if (!androidLink && urlParts.pathname.match(userPattern)) {
        const userId = urlParts.pathname.split('/')[2];
        androidLink = `intent://user/${userId}#Intent;scheme=https;package=com.spreaker.android;${fallbackTag}end;`;
      }

      // Fallback : redirection vers la page d'accueil de Spreaker
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.spreaker.android;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  ubereats: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les restaurants (store)
      const storePattern = /^\/store\/([^/]+)\/?/; // ex: /store/store-id

      // Pattern pour les articles spécifiques (items)
      const itemPattern = /^\/store\/([^/]+)\/item\/([^/]+)\/?/; // ex: /store/store-id/item/item-id

      // Pattern pour la localisation des restaurants
      const locationPattern = /^\/location\/([^/]+)\/?/; // ex: /location/location-id

      // Gestion des restaurants (store)
      if (urlParts.pathname.match(storePattern)) {
        const storeId = urlParts.pathname.split('/')[2];
        iosLink = `ubereats://store/browse?client_id=eats&storeUUID=${storeId}`;
      }

      // Gestion des articles (items)
      if (!iosLink && urlParts.pathname.match(itemPattern)) {
        const storeId = urlParts.pathname.split('/')[2];
        const itemId = urlParts.pathname.split('/')[4];
        iosLink = `ubereats://store/item?client_id=eats&storeUUID=${storeId}&itemUUID=${itemId}`;
      }

      // Gestion de la localisation des restaurants
      if (!iosLink && urlParts.pathname.match(locationPattern)) {
        const locationId = urlParts.pathname.split('/')[2];
        iosLink = `ubereats://location?locationUUID=${locationId}`;
      }

      // Fallback : redirection vers la page d'accueil d'UberEats
      if (!iosLink) {
        iosLink = `ubereats://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les restaurants (store)
      const storePattern = /^\/store\/([^/]+)\/?/; // ex: /store/store-id

      // Pattern pour les articles spécifiques (items)
      const itemPattern = /^\/store\/([^/]+)\/item\/([^/]+)\/?/; // ex: /store/store-id/item/item-id

      // Pattern pour la localisation des restaurants
      const locationPattern = /^\/location\/([^/]+)\/?/; // ex: /location/location-id

      // Gestion des restaurants (store)
      if (urlParts.pathname.match(storePattern)) {
        const storeId = urlParts.pathname.split('/')[2];
        androidLink = `intent://store/${storeId}#Intent;scheme=https;package=com.ubercab.eats;${fallbackTag}end;`;
      }

      // Gestion des articles (items)
      if (!androidLink && urlParts.pathname.match(itemPattern)) {
        const storeId = urlParts.pathname.split('/')[2];
        const itemId = urlParts.pathname.split('/')[4];
        androidLink = `intent://store/${storeId}/item/${itemId}#Intent;scheme=https;package=com.ubercab.eats;${fallbackTag}end;`;
      }

      // Gestion de la localisation des restaurants
      if (!androidLink && urlParts.pathname.match(locationPattern)) {
        const locationId = urlParts.pathname.split('/')[2];
        androidLink = `intent://location/${locationId}#Intent;scheme=https;package=com.ubercab.eats;${fallbackTag}end;`;
      }

      // Fallback : redirection vers la page d'accueil d'UberEats
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.ubercab.eats;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  vimeo: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les vidéos spécifiques (ex : /123456789)
      const videoPattern = /^\/\d+$/; // ex: /123456789

      // Pattern pour les utilisateurs (ex : /user123456)
      const userPattern = /^\/user\d+$/; // ex: /user123456

      // Pattern pour les chaînes (ex : /channels/channelname)
      const channelPattern = /^\/channels\/[^/]+\/?$/; // ex: /channels/channelname

      // Pattern pour les catégories (ex : /categories/categoryname)
      const categoryPattern = /^\/categories\/[^/]+\/?$/; // ex: /categories/categoryname

      // Gestion des vidéos spécifiques
      if (urlParts.pathname.match(videoPattern)) {
        const videoId = urlParts.pathname.split('/').pop();
        iosLink = `vimeo://app.vimeo.com/videos/${videoId}`;
      }

      // Gestion des profils utilisateurs
      if (!iosLink && urlParts.pathname.match(userPattern)) {
        const userId = urlParts.pathname.split('/').pop();
        iosLink = `vimeo://app.vimeo.com/user/${userId}`;
      }

      // Gestion des chaînes
      if (!iosLink && urlParts.pathname.match(channelPattern)) {
        const channelName = urlParts.pathname.split('/').pop();
        iosLink = `vimeo://app.vimeo.com/channels/${channelName}`;
      }

      // Gestion des catégories
      if (!iosLink && urlParts.pathname.match(categoryPattern)) {
        const categoryName = urlParts.pathname.split('/').pop();
        iosLink = `vimeo://app.vimeo.com/categories/${categoryName}`;
      }

      // Fallback pour la page d'accueil Vimeo
      if (!iosLink) {
        iosLink = `vimeo://app.vimeo.com/home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les vidéos spécifiques (ex : /123456789)
      const videoPattern = /^\/\d+$/; // ex: /123456789

      // Pattern pour les utilisateurs (ex : /user123456)
      const userPattern = /^\/user\d+$/; // ex: /user123456

      // Pattern pour les chaînes (ex : /channels/channelname)
      const channelPattern = /^\/channels\/[^/]+\/?$/; // ex: /channels/channelname

      // Pattern pour les catégories (ex : /categories/categoryname)
      const categoryPattern = /^\/categories\/[^/]+\/?$/; // ex: /categories/categoryname

      // Gestion des vidéos spécifiques
      if (urlParts.pathname.match(videoPattern)) {
        const videoId = urlParts.pathname.split('/').pop();
        androidLink = `intent://app.vimeo.com/videos/${videoId}#Intent;scheme=https;package=com.vimeo.android.videoapp;${fallbackTag}end;`;
      }

      // Gestion des profils utilisateurs
      if (!androidLink && urlParts.pathname.match(userPattern)) {
        const userId = urlParts.pathname.split('/').pop();
        androidLink = `intent://app.vimeo.com/user/${userId}#Intent;scheme=https;package=com.vimeo.android.videoapp;${fallbackTag}end;`;
      }

      // Gestion des chaînes
      if (!androidLink && urlParts.pathname.match(channelPattern)) {
        const channelName = urlParts.pathname.split('/').pop();
        androidLink = `intent://app.vimeo.com/channels/${channelName}#Intent;scheme=https;package=com.vimeo.android.videoapp;${fallbackTag}end;`;
      }

      // Gestion des catégories
      if (!androidLink && urlParts.pathname.match(categoryPattern)) {
        const categoryName = urlParts.pathname.split('/').pop();
        androidLink = `intent://app.vimeo.com/categories/${categoryName}#Intent;scheme=https;package=com.vimeo.android.videoapp;${fallbackTag}end;`;
      }

      // Fallback pour la page d'accueil Vimeo
      if (!androidLink) {
        androidLink = `intent://app.vimeo.com/home#Intent;scheme=https;package=com.vimeo.android.videoapp;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  zalando: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les pages produits spécifiques (ex: /product-name-SK123456.html)
      const productPattern = /\/[^/]+-SK\d+\.html$/;

      // Pattern pour les pages de catégorie (ex: /category-name/)
      const categoryPattern = /\/[^/]+\/$/;

      // Gestion des pages de produits spécifiques (avec SKU)
      if (urlParts.pathname.match(productPattern)) {
        const sku = urlParts.pathname
          .split('-')
          .pop()
          ?.replace('.html', '')
          .toUpperCase();
        iosLink = `zalando://PDS?sku=${sku}`;
      }

      // Gestion des pages de catégorie
      if (!iosLink && urlParts.pathname.match(categoryPattern)) {
        const categoryName = urlParts.pathname.split('/').filter(Boolean).pop();
        iosLink = `zalando://SEARCH?urlKey=${categoryName}&order=popularity`;
      }

      // Fallback pour la page d'accueil Zalando ou les URL non reconnues
      if (!iosLink) {
        iosLink = `zalando://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les pages produits spécifiques (ex: /product-name-SK123456.html)
      const productPattern = /\/[^/]+-SK\d+\.html$/;

      // Pattern pour les pages de catégorie (ex: /category-name/)
      const categoryPattern = /\/[^/]+\/$/;

      // Gestion des pages de produits spécifiques (avec SKU)
      if (urlParts.pathname.match(productPattern)) {
        const sku = urlParts.pathname
          .split('-')
          .pop()
          ?.replace('.html', '')
          .toUpperCase();
        androidLink = `zalando://PDS?sku=${sku}`;
      }

      // Gestion des pages de catégorie
      if (!androidLink && urlParts.pathname.match(categoryPattern)) {
        const categoryName = urlParts.pathname.split('/').filter(Boolean).pop();
        androidLink = `zalando://SEARCH?urlKey=${categoryName}&order=popularity`;
      }

      // Fallback pour la page d'accueil Zalando ou les URL non reconnues
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=de.zalando.mobile;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  zomato: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les pages de restaurants spécifiques (ex: /restaurants/restaurant-name-123456)
      const restaurantPattern = /\/restaurants\/[^/]+-\d+$/;

      // Pattern pour les pages de menu d'un restaurant (ex: /restaurants/restaurant-name-123456/menu)
      const menuPattern = /\/restaurants\/[^/]+-\d+\/menu$/;

      // Gestion des pages de restaurant spécifiques
      if (urlParts.pathname.match(restaurantPattern)) {
        const restaurantId = urlParts.pathname.split('-').pop();
        iosLink = `zomato://restaurant/${restaurantId}`;
      }

      // Gestion des pages de menu d'un restaurant
      if (!iosLink && urlParts.pathname.match(menuPattern)) {
        const restaurantId = urlParts.pathname
          .split('-')
          .pop()
          ?.replace('/menu', '');
        iosLink = `zomato://restaurant/${restaurantId}/menu`;
      }

      // Fallback pour la page d'accueil Zomato ou les URL non reconnues
      if (!iosLink) {
        iosLink = `zomato://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les pages de restaurants spécifiques (ex: /restaurants/restaurant-name-123456)
      const restaurantPattern = /\/restaurants\/[^/]+-\d+$/;

      // Pattern pour les pages de menu d'un restaurant (ex: /restaurants/restaurant-name-123456/menu)
      const menuPattern = /\/restaurants\/[^/]+-\d+\/menu$/;

      // Gestion des pages de restaurant spécifiques
      if (urlParts.pathname.match(restaurantPattern)) {
        const restaurantId = urlParts.pathname.split('-').pop();
        androidLink = `zomato://restaurant/${restaurantId}`;
      }

      // Gestion des pages de menu d'un restaurant
      if (!androidLink && urlParts.pathname.match(menuPattern)) {
        const restaurantId = urlParts.pathname
          .split('-')
          .pop()
          ?.replace('/menu', '');
        androidLink = `zomato://restaurant/${restaurantId}/menu`;
      }

      // Fallback pour la page d'accueil Zomato ou les URL non reconnues
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.application.zomato;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  pinterest: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les pages de pins spécifiques (ex: /pin/123456789/)
      const pinPattern = /\/pin\/\d+\/?$/;

      // Pattern pour les pages de profils utilisateurs (ex: /username/)
      const profilePattern = /\/[^/]+\/?$/;

      // Gestion des pages de pin spécifiques
      if (urlParts.pathname.match(pinPattern)) {
        const pinId = urlParts.pathname.split('/').filter(Boolean).pop();
        iosLink = `pinterest://pin/${pinId}`;
      }

      // Gestion des pages de profil utilisateurs
      if (!iosLink && urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.split('/').filter(Boolean).pop();
        iosLink = `pinterest://user/${username}`;
      }

      // Fallback pour la page d'accueil Pinterest ou les URL non reconnues
      if (!iosLink) {
        iosLink = `pinterest://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les pages de pins spécifiques (ex: /pin/123456789/)
      const pinPattern = /\/pin\/\d+\/?$/;

      // Pattern pour les pages de profils utilisateurs (ex: /username/)
      const profilePattern = /\/[^/]+\/?$/;

      // Gestion des pages de pin spécifiques
      if (urlParts.pathname.match(pinPattern)) {
        const pinId = urlParts.pathname.split('/').filter(Boolean).pop();
        androidLink = `pinterest://pin/${pinId}`;
      }

      // Gestion des pages de profil utilisateurs
      if (!androidLink && urlParts.pathname.match(profilePattern)) {
        const username = urlParts.pathname.split('/').filter(Boolean).pop();
        androidLink = `pinterest://user/${username}`;
      }

      // Fallback pour la page d'accueil Pinterest ou les URL non reconnues
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.pinterest;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  temu: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les pages de produits spécifiques (ex: /product/detail/123456789/)
      const productPattern = /\/product\/detail\/\d+\/?$/;

      // Pattern pour les pages de catégorie (ex: /category/123456789/)
      const categoryPattern = /\/category\/\d+\/?$/;

      // Gestion des pages de produits spécifiques
      if (urlParts.pathname.match(productPattern)) {
        const productId = urlParts.pathname.split('/').filter(Boolean).pop();
        iosLink = `temu://product/detail/${productId}`;
      }

      // Gestion des pages de catégorie spécifiques
      if (!iosLink && urlParts.pathname.match(categoryPattern)) {
        const categoryId = urlParts.pathname.split('/').filter(Boolean).pop();
        iosLink = `temu://category/${categoryId}`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!iosLink) {
        iosLink = `temu://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les pages de produits spécifiques (ex: /product/detail/123456789/)
      const productPattern = /\/product\/detail\/\d+\/?$/;

      // Pattern pour les pages de catégorie (ex: /category/123456789/)
      const categoryPattern = /\/category\/\d+\/?$/;

      // Gestion des pages de produits spécifiques
      if (urlParts.pathname.match(productPattern)) {
        const productId = urlParts.pathname.split('/').filter(Boolean).pop();
        androidLink = `intent://product/detail/${productId}#Intent;scheme=https;package=com.einnovation.temu;${fallbackTag}end;`;
      }

      // Gestion des pages de catégorie spécifiques
      if (!androidLink && urlParts.pathname.match(categoryPattern)) {
        const categoryId = urlParts.pathname.split('/').filter(Boolean).pop();
        androidLink = `intent://category/${categoryId}#Intent;scheme=https;package=com.einnovation.temu;${fallbackTag}end;`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.einnovation.temu;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  soundcloud: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les pages de tracks (ex: /artistname/trackname)
      const trackPattern = /^\/[^/]+\/[^/]+\/?$/;

      // Pattern pour les pages de playlists (ex: /artistname/sets/playlistname)
      const playlistPattern = /^\/[^/]+\/sets\/[^/]+\/?$/;

      // Pattern pour les profils d'utilisateurs (ex: /artistname)
      const userProfilePattern = /^\/[^/]+\/?$/;

      // Gestion des pages de tracks
      if (urlParts.pathname.match(trackPattern)) {
        const pathParts = urlParts.pathname.split('/').filter(Boolean);
        iosLink = `soundcloud://tracks:${pathParts[1]}`;
      }

      // Gestion des pages de playlists
      if (!iosLink && urlParts.pathname.match(playlistPattern)) {
        const pathParts = urlParts.pathname.split('/').filter(Boolean);
        iosLink = `soundcloud://playlists:${pathParts[2]}`;
      }

      // Gestion des pages de profils utilisateurs
      if (!iosLink && urlParts.pathname.match(userProfilePattern)) {
        const username = urlParts.pathname.split('/').filter(Boolean).pop();
        iosLink = `soundcloud://users:${username}`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!iosLink) {
        iosLink = `soundcloud://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les pages de tracks (ex: /artistname/trackname)
      const trackPattern = /^\/[^/]+\/[^/]+\/?$/;

      // Pattern pour les pages de playlists (ex: /artistname/sets/playlistname)
      const playlistPattern = /^\/[^/]+\/sets\/[^/]+\/?$/;

      // Pattern pour les profils d'utilisateurs (ex: /artistname)
      const userProfilePattern = /^\/[^/]+\/?$/;

      // Gestion des pages de tracks
      if (urlParts.pathname.match(trackPattern)) {
        const pathParts = urlParts.pathname.split('/').filter(Boolean);
        androidLink = `intent://tracks:${pathParts[1]}#Intent;scheme=https;package=com.soundcloud.android;${fallbackTag}end;`;
      }

      // Gestion des pages de playlists
      if (!androidLink && urlParts.pathname.match(playlistPattern)) {
        const pathParts = urlParts.pathname.split('/').filter(Boolean);
        androidLink = `intent://playlists:${pathParts[2]}#Intent;scheme=https;package=com.soundcloud.android;${fallbackTag}end;`;
      }

      // Gestion des pages de profils utilisateurs
      if (!androidLink && urlParts.pathname.match(userProfilePattern)) {
        const username = urlParts.pathname.split('/').filter(Boolean).pop();
        androidLink = `intent://users:${username}#Intent;scheme=https;package=com.soundcloud.android;${fallbackTag}end;`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.soundcloud.android;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  yelp: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les pages d'entreprises (ex: /biz/business-id)
      const businessPattern = /^\/biz\/[^/]+\/?$/;

      // Pattern pour les profils d'utilisateurs (ex: /user_details?userid=12345)
      const userProfilePattern = /^\/user_details\/?$/;

      // Gestion des pages d'entreprises
      if (urlParts.pathname.match(businessPattern)) {
        const businessId = urlParts.pathname.split('/').pop();
        iosLink = `yelp:///biz/${businessId}`;
      }

      // Gestion des pages de profils utilisateurs
      if (!iosLink && urlParts.pathname.match(userProfilePattern)) {
        const userId = urlParts.searchParams.get('userid');
        iosLink = `yelp:///user/${userId}`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!iosLink) {
        iosLink = `yelp:///home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les pages d'entreprises (ex: /biz/business-id)
      const businessPattern = /^\/biz\/[^/]+\/?$/;

      // Pattern pour les profils d'utilisateurs (ex: /user_details?userid=12345)
      const userProfilePattern = /^\/user_details\/?$/;

      // Gestion des pages d'entreprises
      if (urlParts.pathname.match(businessPattern)) {
        const businessId = urlParts.pathname.split('/').pop();
        androidLink = `intent://biz/${businessId}#Intent;scheme=https;package=com.yelp.android;${fallbackTag}end;`;
      }

      // Gestion des pages de profils utilisateurs
      if (!androidLink && urlParts.pathname.match(userProfilePattern)) {
        const userId = urlParts.searchParams.get('userid');
        androidLink = `intent://user/${userId}#Intent;scheme=https;package=com.yelp.android;${fallbackTag}end;`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.yelp.android;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  airbnb: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les pages de listings (ex: /rooms/listing-id)
      const listingPattern = /^\/rooms\/[^/]+\/?$/;

      // Pattern pour les pages d'expériences (ex: /experiences/experience-id)
      const experiencePattern = /^\/experiences\/[^/]+\/?$/;

      // Pattern pour les profils d'utilisateurs (ex: /users/user-id)
      const userProfilePattern = /^\/users\/[^/]+\/?$/;

      // Gestion des pages de listings
      if (urlParts.pathname.match(listingPattern)) {
        const listingId = urlParts.pathname.split('/').pop();
        iosLink = `airbnb://d/listing/${listingId}`;
      }

      // Gestion des pages d'expériences
      if (!iosLink && urlParts.pathname.match(experiencePattern)) {
        const experienceId = urlParts.pathname.split('/').pop();
        iosLink = `airbnb://d/experience/${experienceId}`;
      }

      // Gestion des profils utilisateurs
      if (!iosLink && urlParts.pathname.match(userProfilePattern)) {
        const userId = urlParts.pathname.split('/').pop();
        iosLink = `airbnb://d/user/${userId}`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!iosLink) {
        iosLink = `airbnb://d/home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les pages de listings (ex: /rooms/listing-id)
      const listingPattern = /^\/rooms\/[^/]+\/?$/;

      // Pattern pour les pages d'expériences (ex: /experiences/experience-id)
      const experiencePattern = /^\/experiences\/[^/]+\/?$/;

      // Pattern pour les profils d'utilisateurs (ex: /users/user-id)
      const userProfilePattern = /^\/users\/[^/]+\/?$/;

      // Gestion des pages de listings
      if (urlParts.pathname.match(listingPattern)) {
        const listingId = urlParts.pathname.split('/').pop();
        androidLink = `intent://rooms/${listingId}#Intent;scheme=https;package=com.airbnb.android;${fallbackTag}end;`;
      }

      // Gestion des pages d'expériences
      if (!androidLink && urlParts.pathname.match(experiencePattern)) {
        const experienceId = urlParts.pathname.split('/').pop();
        androidLink = `intent://experiences/${experienceId}#Intent;scheme=https;package=com.airbnb.android;${fallbackTag}end;`;
      }

      // Gestion des profils utilisateurs
      if (!androidLink && urlParts.pathname.match(userProfilePattern)) {
        const userId = urlParts.pathname.split('/').pop();
        androidLink = `intent://users/${userId}#Intent;scheme=https;package=com.airbnb.android;${fallbackTag}end;`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.airbnb.android;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  lydia: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les transactions (ex: /transactions/transaction-id)
      const transactionPattern = /^\/transactions\/[^/]+\/?$/;

      // Pattern pour les utilisateurs (ex: /users/user-id)
      const userPattern = /^\/users\/[^/]+\/?$/;

      // Gestion des transactions
      if (urlParts.pathname.match(transactionPattern)) {
        const transactionId = urlParts.pathname.split('/').pop();
        iosLink = `lydia://transaction/${transactionId}`;
      }

      // Gestion des profils utilisateurs
      if (!iosLink && urlParts.pathname.match(userPattern)) {
        const userId = urlParts.pathname.split('/').pop();
        iosLink = `lydia://user/${userId}`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!iosLink) {
        iosLink = `lydia://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les transactions (ex: /transactions/transaction-id)
      const transactionPattern = /^\/transactions\/[^/]+\/?$/;

      // Pattern pour les utilisateurs (ex: /users/user-id)
      const userPattern = /^\/users\/[^/]+\/?$/;

      // Gestion des transactions
      if (urlParts.pathname.match(transactionPattern)) {
        const transactionId = urlParts.pathname.split('/').pop();
        androidLink = `intent://transaction/${transactionId}#Intent;scheme=https;package=com.lydia.android;${fallbackTag}end;`;
      }

      // Gestion des profils utilisateurs
      if (!androidLink && urlParts.pathname.match(userPattern)) {
        const userId = urlParts.pathname.split('/').pop();
        androidLink = `intent://user/${userId}#Intent;scheme=https;package=com.lydia.android;${fallbackTag}end;`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.lydia.android;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  doctolib: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour les rendez-vous (ex: /appointments/appointment-id)
      const appointmentPattern = /^\/appointments\/[^/]+\/?$/;

      // Gestion des rendez-vous
      if (urlParts.pathname.match(appointmentPattern)) {
        const appointmentId = urlParts.pathname.split('/').pop();
        iosLink = `doctolib://appointment/${appointmentId}`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!iosLink) {
        iosLink = `doctolib://home`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour les rendez-vous (ex: /appointments/appointment-id)
      const appointmentPattern = /^\/appointments\/[^/]+\/?$/;

      // Gestion des rendez-vous
      if (urlParts.pathname.match(appointmentPattern)) {
        const appointmentId = urlParts.pathname.split('/').pop();
        androidLink = `intent://appointment/${appointmentId}#Intent;scheme=https;package=com.doctolib;${fallbackTag}end;`;
      }

      // Fallback pour la page d'accueil ou les URL non reconnues
      if (!androidLink) {
        androidLink = `intent://home#Intent;scheme=https;package=com.doctolib;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  whatsapp: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour envoyer un message (ex: /send?text=message)
      const messagePattern = /^\/send\?text=(.+)$/;

      // Gestion de l'envoi de messages
      const messageMatch = urlParts.pathname.match(messagePattern);
      if (messageMatch) {
        const message = encodeURIComponent(messageMatch[1]);
        iosLink = `whatsapp://send?text=${message}`;
      } else {
        // Fallback pour la page d'accueil de WhatsApp
        iosLink = `whatsapp://`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour envoyer un message (ex: /send?text=message)
      const messagePattern = /^\/send\?text=(.+)$/;

      // Gestion de l'envoi de messages
      const messageMatch = urlParts.pathname.match(messagePattern);
      if (messageMatch) {
        const message = encodeURIComponent(messageMatch[1]);
        androidLink = `intent://send?text=${message}#Intent;scheme=whatsapp;package=com.whatsapp;${fallbackTag}end;`;
      } else {
        // Fallback pour la page d'accueil de WhatsApp
        androidLink = `intent://#Intent;scheme=whatsapp;package=com.whatsapp;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  shein: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour accéder à un produit (ex: /product/123456)
      const productPattern = /^\/product\/([0-9]+)/;

      // Pattern pour accéder à une catégorie (ex: /category/men)
      const categoryPattern = /^\/category\/([^/]+)/;

      // Gestion de l'accès aux produits
      const productMatch = urlParts.pathname.match(productPattern);
      if (productMatch) {
        iosLink = `shein://product/${productMatch[1]}`;
      } else {
        // Gestion de l'accès aux catégories
        const categoryMatch = urlParts.pathname.match(categoryPattern);
        if (categoryMatch) {
          iosLink = `shein://category/${categoryMatch[1]}`;
        } else {
          // Fallback pour la page d'accueil de SHEIN
          iosLink = `shein://`;
        }
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour accéder à un produit (ex: /product/123456)
      const productPattern = /^\/product\/([0-9]+)/;

      // Pattern pour accéder à une catégorie (ex: /category/men)
      const categoryPattern = /^\/category\/([^/]+)/;

      // Gestion de l'accès aux produits
      const productMatch = urlParts.pathname.match(productPattern);
      if (productMatch) {
        androidLink = `intent://product/${productMatch[1]}#Intent;scheme=shein;package=com.shein;${fallbackTag}end;`;
      } else {
        // Gestion de l'accès aux catégories
        const categoryMatch = urlParts.pathname.match(categoryPattern);
        if (categoryMatch) {
          androidLink = `intent://category/${categoryMatch[1]}#Intent;scheme=shein;package=com.shein;${fallbackTag}end;`;
        } else {
          // Fallback pour la page d'accueil de SHEIN
          androidLink = `intent://#Intent;scheme=shein;package=com.shein;${fallbackTag}end;`;
        }
      }

      return androidLink;
    },
  },
  shazam: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour accéder à une chanson (ex: /discover/track/123456)
      const trackPattern = /^\/discover\/track\/([0-9]+)/;

      // Gestion de l'accès aux chansons
      const trackMatch = urlParts.pathname.match(trackPattern);
      if (trackMatch) {
        iosLink = `shazam://discover/track/${trackMatch[1]}`;
      } else {
        // Fallback pour la page d'accueil de Shazam
        iosLink = `shazam://`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour accéder à une chanson (ex: /discover/track/123456)
      const trackPattern = /^\/discover\/track\/([0-9]+)/;

      // Gestion de l'accès aux chansons
      const trackMatch = urlParts.pathname.match(trackPattern);
      if (trackMatch) {
        androidLink = `intent://discover/track/${trackMatch[1]}#Intent;scheme=shazam;package=com.shazam.android;${fallbackTag}end;`;
      } else {
        // Fallback pour la page d'accueil de Shazam
        androidLink = `intent://#Intent;scheme=shazam;package=com.shazam.android;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  tripadvisor: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour accéder à un emplacement spécifique (ex: /Restaurant_Review-g123456-d4567890)
      const locationPattern =
        /^\/(Restaurant_Review|Attraction_Review|Hotel_Review|ShowUserReviews)-g(\d+)-d(\d+)/;

      // Gestion de l'accès aux emplacements
      const locationMatch = urlParts.pathname.match(locationPattern);
      if (locationMatch) {
        iosLink = `tripadvisor://location/${locationMatch[2]}`;
      } else {
        // Fallback pour la page d'accueil de Tripadvisor
        iosLink = `tripadvisor://`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour accéder à un emplacement spécifique (ex: /Restaurant_Review-g123456-d4567890)
      const locationPattern =
        /^\/(Restaurant_Review|Attraction_Review|Hotel_Review|ShowUserReviews)-g(\d+)-d(\d+)/;

      // Gestion de l'accès aux emplacements
      const locationMatch = urlParts.pathname.match(locationPattern);
      if (locationMatch) {
        androidLink = `intent://location/${locationMatch[2]}#Intent;scheme=tripadvisor;package=com.tripadvisor.android;${fallbackTag}end;`;
      } else {
        // Fallback pour la page d'accueil de Tripadvisor
        androidLink = `intent://#Intent;scheme=tripadvisor;package=com.tripadvisor.android;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  gofundme: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour accéder à un projet spécifique (ex: /f/my-fundraiser)
      const fundraiserPattern = /^\/f\/([a-zA-Z0-9_-]+)/;

      // Gestion de l'accès aux projets
      const fundraiserMatch = urlParts.pathname.match(fundraiserPattern);
      if (fundraiserMatch) {
        iosLink = `gofundme://fundraiser/${fundraiserMatch[1]}`;
      } else {
        // Fallback pour la page d'accueil de GoFundMe
        iosLink = `gofundme://`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour accéder à un projet spécifique (ex: /f/my-fundraiser)
      const fundraiserPattern = /^\/f\/([a-zA-Z0-9_-]+)/;

      // Gestion de l'accès aux projets
      const fundraiserMatch = urlParts.pathname.match(fundraiserPattern);
      if (fundraiserMatch) {
        androidLink = `intent://fundraiser/${fundraiserMatch[1]}#Intent;scheme=gofundme;package=com.gofundme.android;${fallbackTag}end;`;
      } else {
        // Fallback pour la page d'accueil de GoFundMe
        androidLink = `intent://#Intent;scheme=gofundme;package=com.gofundme.android;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  aliexpress: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour accéder à un produit spécifique (ex: /item/1234567890)
      const productPattern = /^\/item\/([0-9]+)/;

      // Gestion de l'accès aux produits
      const productMatch = urlParts.pathname.match(productPattern);
      if (productMatch) {
        iosLink = `aliexpress://productdetail/${productMatch[1]}`;
      } else {
        // Fallback pour la page d'accueil d'AliExpress
        iosLink = `aliexpress://`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour accéder à un produit spécifique (ex: /item/1234567890)
      const productPattern = /^\/item\/([0-9]+)/;

      // Gestion de l'accès aux produits
      const productMatch = urlParts.pathname.match(productPattern);
      if (productMatch) {
        androidLink = `intent://productdetail/${productMatch[1]}#Intent;scheme=aliexpress;package=com.alibaba.aliexpresshd;${fallbackTag}end;`;
      } else {
        // Fallback pour la page d'accueil d'AliExpress
        androidLink = `intent://#Intent;scheme=aliexpress;package=com.alibaba.aliexpresshd;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  booking: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour accéder à un hôtel spécifique (ex: /hotel/123456)
      const hotelPattern = /^\/hotel\/([0-9]+)/;

      // Gestion de l'accès aux hôtels
      const hotelMatch = urlParts.pathname.match(hotelPattern);
      if (hotelMatch) {
        iosLink = `booking://hotel/${hotelMatch[1]}`;
      } else {
        // Fallback pour la page d'accueil de Booking.com
        iosLink = `booking://`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour accéder à un hôtel spécifique (ex: /hotel/123456)
      const hotelPattern = /^\/hotel\/([0-9]+)/;

      // Gestion de l'accès aux hôtels
      const hotelMatch = urlParts.pathname.match(hotelPattern);
      if (hotelMatch) {
        androidLink = `intent://hotel/${hotelMatch[1]}#Intent;scheme=booking;package=com.booking;${fallbackTag}end;`;
      } else {
        // Fallback pour la page d'accueil de Booking.com
        androidLink = `intent://#Intent;scheme=booking;package=com.booking;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  talabat: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour accéder à un restaurant spécifique (ex: /restaurant/12345)
      const restaurantPattern = /^\/restaurant\/([0-9]+)/;

      // Gestion de l'accès aux restaurants
      const restaurantMatch = urlParts.pathname.match(restaurantPattern);
      if (restaurantMatch) {
        iosLink = `talabat://restaurant/${restaurantMatch[1]}`;
      } else {
        // Fallback pour la page d'accueil de Talabat
        iosLink = `talabat://`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour accéder à un restaurant spécifique (ex: /restaurant/12345)
      const restaurantPattern = /^\/restaurant\/([0-9]+)/;

      // Gestion de l'accès aux restaurants
      const restaurantMatch = urlParts.pathname.match(restaurantPattern);
      if (restaurantMatch) {
        androidLink = `intent://restaurant/${restaurantMatch[1]}#Intent;scheme=talabat;package=com.talabat;${fallbackTag}end;`;
      } else {
        // Fallback pour la page d'accueil de Talabat
        androidLink = `intent://#Intent;scheme=talabat;package=com.talabat;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  hungerstation: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour accéder à un restaurant spécifique (ex: /restaurant/12345)
      const restaurantPattern = /^\/restaurant\/([0-9]+)/;

      // Gestion de l'accès aux restaurants
      const restaurantMatch = urlParts.pathname.match(restaurantPattern);
      if (restaurantMatch) {
        iosLink = `hungerstation://restaurant/${restaurantMatch[1]}`;
      } else {
        // Fallback pour la page d'accueil de HungerStation
        iosLink = `hungerstation://`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour accéder à un restaurant spécifique (ex: /restaurant/12345)
      const restaurantPattern = /^\/restaurant\/([0-9]+)/;

      // Gestion de l'accès aux restaurants
      const restaurantMatch = urlParts.pathname.match(restaurantPattern);
      if (restaurantMatch) {
        androidLink = `intent://restaurant/${restaurantMatch[1]}#Intent;scheme=hungerstation;package=com.hungerstation.android;${fallbackTag}end;`;
      } else {
        // Fallback pour la page d'accueil de HungerStation
        androidLink = `intent://#Intent;scheme=hungerstation;package=com.hungerstation.android;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  smood: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour accéder à un restaurant spécifique (ex: /restaurant/12345)
      const restaurantPattern = /^\/restaurant\/([0-9]+)/;

      // Gestion de l'accès aux restaurants
      const restaurantMatch = urlParts.pathname.match(restaurantPattern);
      if (restaurantMatch) {
        iosLink = `smood://restaurant/${restaurantMatch[1]}`;
      } else {
        // Fallback pour la page d'accueil de Smood
        iosLink = `smood://`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour accéder à un restaurant spécifique (ex: /restaurant/12345)
      const restaurantPattern = /^\/restaurant\/([0-9]+)/;

      // Gestion de l'accès aux restaurants
      const restaurantMatch = urlParts.pathname.match(restaurantPattern);
      if (restaurantMatch) {
        androidLink = `intent://restaurant/${restaurantMatch[1]}#Intent;scheme=smood;package=ch.smood.smoodapp;${fallbackTag}end;`;
      } else {
        // Fallback pour la page d'accueil de Smood
        androidLink = `intent://#Intent;scheme=smood;package=ch.smood.smoodapp;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
  postmates: {
    ios: (urlParts: URL) => {
      let iosLink = null;

      // Pattern pour accéder à un restaurant spécifique (ex: /restaurant/12345)
      const restaurantPattern = /^\/restaurant\/([0-9]+)/;

      // Gestion de l'accès aux restaurants
      const restaurantMatch = urlParts.pathname.match(restaurantPattern);
      if (restaurantMatch) {
        iosLink = `postmates://restaurant/${restaurantMatch[1]}`;
      } else {
        // Fallback pour la page d'accueil de Postmates
        iosLink = `postmates://`;
      }

      return iosLink;
    },

    android: (urlParts: URL, fallbackTag: string) => {
      let androidLink = null;

      // Pattern pour accéder à un restaurant spécifique (ex: /restaurant/12345)
      const restaurantPattern = /^\/restaurant\/([0-9]+)/;

      // Gestion de l'accès aux restaurants
      const restaurantMatch = urlParts.pathname.match(restaurantPattern);
      if (restaurantMatch) {
        androidLink = `intent://restaurant/${restaurantMatch[1]}#Intent;scheme=postmates;package=com.postmates.android;${fallbackTag}end;`;
      } else {
        // Fallback pour la page d'accueil de Postmates
        androidLink = `intent://#Intent;scheme=postmates;package=com.postmates.android;${fallbackTag}end;`;
      }

      return androidLink;
    },
  },
};
