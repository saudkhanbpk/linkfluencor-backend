module.exports = {
  apps: [
    {
      name: 'linkfluencer-api',
      script: 'dist/server.js',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
        APP_URL: 'http://localhost',
        PORT: 5005,
        MONGO_URI: 'mongodb+srv://linkfluencer:linkfluencer@cluster0.jjd6w.mongodb.net/linkfluencer',
        JWT_SECRET: 'dummysecret',
        JWT_REFRESH_SECRET: 'dummysecret',
        ALLOWED_ORIGINS: 'http://localhost:3000,http://localhost:3001,http://app.dev.linkfluencer.io/',
        LOG_LEVEL: 'debug',
        SESSION_SECRET: 'd8e824dcf1cb4aae598f459eaba5d8aade69d970d427d9ecdcfe0ba886aa5208',
        GOOGLE_CLIENT_ID: '483494499664-gtt5ebbh35fs6th86ejkdtgioem2ub6p.apps.googleusercontent.com',
        GOOGLE_CLIENT_SECRET: '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',
        FACEBOOK_APP_ID: '1090374732455295',
        FACEBOOK_APP_SECRET: '6c736dcef9595538b201db1c5a8be1e4',
        EMAIL_USER: 'yassine.kchir@gmail.com',
        EMAIL_PASS: 'xxx xxx xxx xxx',
        PLAN_FREE_PRICE: 0,
        PLAN_FREE_CLICKS_LIMIT: 10000,
        PLAN_STARTER_PRICE: 49.99,
        PLAN_STARTER_CLICKS_LIMIT: 50000,
        PLAN_GROW_PRICE: 99.99,
        PLAN_GROW_CLICKS_LIMIT: 100000,
        PLAN_SCALE_PRICE: 199.99,
        PLAN_SCALE_CLICKS_LIMIT: 250000,
        COOKIE_DOMAIN: '.vercel.app'
      }
    }
  ]
};
