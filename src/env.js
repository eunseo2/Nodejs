const dotenv = require('dotenv');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

dotenv.config({
  path: path.join(
    process.cwd(),
    isDev ? '.env.development' : '.env.production'
  ),
}); //isDev가 참이면 process.cwd+.env.development 경로로가라
