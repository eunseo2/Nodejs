const Sequelize = require('sequelize');

const {
    DB_HOST,
    DB_DATABASE,
    DB_USER,
    DB_PW,
  } = process.env;
  
  const db = new Sequelize(DB_DATABASE, DB_USER, DB_PW, {
    host: DB_HOST,
    dialect: 'mariadb',
    define: {
      underscored: true,
    },
    // https://sequelize.org/master/manual/connection-pool.html 참고
    pool: {
      max: 5, //maximum size of the pool
      min: 0, //minium size of the pool
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  });
  
  module.exports = db;
  