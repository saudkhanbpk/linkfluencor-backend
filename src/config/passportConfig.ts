import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { googleSignIn, facebookSignIn } from '../services/authService';
import log from '../utils/logger';
import User from '../models/User';
import { config } from '../config/env';

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId!,
      clientSecret: config.googleClientSecret!,
      callbackURL: '/auth/google/callback',
    },
    async (
      _accessToken: any,
      _refreshToken: string | undefined,
      profile: any,
      done: any
    ) => {
      try {
        const { user } = await googleSignIn(profile);
        done(null, user);
      } catch (error: any) {
        log.error(`Error authenticating with Google: ${error.message}`);
        done(error, undefined);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookAppId!,
      clientSecret: config.facebookAppSecret!,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
    },
    async (_accessToken, _refreshToken: string | undefined, profile, done) => {
      try {
        const { user } = await facebookSignIn(profile);
        done(null, user);
      } catch (error: any) {
        log.error(`Error authenticating with Facebook: ${error.message}`);
        done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, (user as any).id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
