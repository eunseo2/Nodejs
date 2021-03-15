require('./env');
const app = require('app');
const getConnection = require('database/get-connection');

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('MISSING_PORT');
}

getConnection(); //db연결됬는지 확인

// 서버 동작
const server = app.listen(PORT, () => {
  console.log(`Server is running, port number is ${PORT} `);
});

module.exports = server;
