function getEnv() {
  return {
    FLY: process.env.FLY,
    HCAPTCHA_SITE_KEY: process.env.HCAPTCHA_SITE_KEY,
    NODE_ENV: process.env.NODE_ENV,
    PRIMARY_REGION: process.env.PRIMARY_REGION,
    SENTRY_DSN: process.env.SENTRY_DSN,
  };
}

type ENV = ReturnType<typeof getEnv>;

// App puts these on
declare global {
  // eslint-disable-next-line
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}

export { getEnv };
