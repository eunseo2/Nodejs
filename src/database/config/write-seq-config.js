require('../../env');

const path = require('path');
const fs = require('fs');

const {
  DB_HOST,
  DB_DATABASE,
  DB_USER,
  DB_PW,
} = process.env;


const dbInfo = {
  username: DB_USER,
  password: DB_PW,
  database: DB_DATABASE,
  host: DB_HOST,
  dialect: 'mariadb',
};

const cliConfig = {
  development: dbInfo,
  production: dbInfo,
  test: dbInfo,
};

const configPath = path.join(__dirname, './sequelize-cli.json');


fs.writeFileSync(configPath, JSON.stringify(cliConfig, null, 2));

// sequelize init 하게 되면 이 파일을 읽어서 sequelize-cli.json을 만들게 됨! 
//sequelize init 하기 전에 구현해야함.