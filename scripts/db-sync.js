require('env');
require('database/models');
const getConnection = require('database/get-connection');
const { sync } = require('database/sync');

const isDev = process.env.NODE_ENV !== 'production';

if (!isDev) {
  throw new Error('Sync script only works in the development environment.');
}

(async () => {
  try {
    getConnection();
    sync();
    console.log('Sync successfully...');
  } catch (err) {
    console.error('Unable to sync:', err);
  }
})();
