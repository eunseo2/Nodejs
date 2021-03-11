const fs = require('fs');
const path = require('path');

const db = require('./db')


// __dirname  = c:\Users\오픈놀\Desktop\test\src\database


const associate = () => { //() 매개변수 없는 경우 써야함
    const dir = path.join(__dirname, './models');
    fs.readdirSync(dir).forEach(model=>{ //동기식 파일 읽기
        const table= require(`./models/${model}`); // post,user
        if(table.associate){
              table.associate();
        }
    });
};

const sync = () => {
    associate();
    db.sync({ force: true }); // 속성값 force를 ture로 주게 되면 기존에 db가 존재하더라도 지우고 새로 만드다는 의미
  };
  
  module.exports = sync;
  
  