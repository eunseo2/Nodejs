require('./env');
const express = require('express');
const routes = require('./routes');
const getConnection = require('database/get-Connection');

const app = express(); 


const PORT = process.env.PORT;

if(!PORT){
    throw new Error('MISSING_EVVAR');
}



getConnection(); // db연결됬는지 확인

app.use('/', routes);

app.use('/ping', (req, res, next) => {
    console.log('hello server')
    res.send('pong')
})


app.listen(PORT,()=>{
    console.log(`Server is running, port number is ${PORT}`)
})

module.exports = app;