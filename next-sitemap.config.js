/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.wesassociates.com',
  generateRobotsTxt: false,
  exclude: [
    '/account',
    '/cart',
    '/dashboard*',
    '/email-conformation',
    '/forgot-password',
    '/login',
    '/registration',
    '/reset-password*',
    '/tools*',
    '/unauthorized',
    '/verify*',
  ],
};
