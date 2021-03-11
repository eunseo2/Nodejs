const db = require('./db');
// db연결됬는지 확인하려면 authoenticate()함수를 이용해라
//https://sequelize.org/master/manual/getting-started.html
const getConnection = async() =>{
    try{
        await db.authenticate();
        console.log('Connection has been established successfully. ')
    } catch(err){
        console.error('Unable to connect to the database:', err);
    }
};

module.exports = getConnection;