/**
 * @type {import('next').NextConfig}
 * @see https://nextjs.org/docs/pages/api-reference/next-config-js
 */
let nextConfig = {
  reactStrictMode: true,
  redirects: async () => [],
  rewrites: async () => [],
  swcMinify: true,
};

/** @see https://docs.sentry.io/platforms/javascript/guides/nextjs */
const { withSentryConfig } = require("@sentry/nextjs");

/**
 * @type {Partial<import('@sentry/nextjs').SentryWebpackPluginOptions>}
 * @see https://github.com/getsentry/sentry-webpack-plugin#options
 */
const sentryWebpackConfig = {
  org: "skip-protocol",
  project: "dydx-dashboard",
  silent: true,
};

/**
 * @type {import('@sentry/nextjs/types/config/types').UserSentryOptions}
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup
 */
const sentryOptions = {
  disableLogger: true,
  hideSourceMaps: false,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  widenClientFileUpload: true,
};

/** @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup */
nextConfig = withSentryConfig(nextConfig, sentryWebpackConfig, sentryOptions);

module.exports = nextConfig;
