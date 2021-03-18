const db = require('./db');

// __dirname  = c:\Users\오픈놀\Desktop\test\src\database

const { models } = db;

const associate = () => {
  //  Object.value값만 뽑아냄
  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });
};

const sync = () => {
  associate();
  db.sync({ force: true }); // 속성값 force를 ture로 주게 되면 기존에 db가 존재하더라도 지우고 새로 만드다는 의미
};

module.exports = { associate, sync };
