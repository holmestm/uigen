/** @type {import('@prisma/internals').Config} */
module.exports = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    },
  },
};
