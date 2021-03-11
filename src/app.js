require('./env');
const express = require('express');
const getConnection = require('database/get-Connection');



const app = express(); 

const PORT = process.env.PORT;

if(!PORT){
    throw new Error('MISSING_EVVAR');
}

app.use('/ping', (req, res, next) => {
    console.log('hello server')
    res.send('pong')
})

getConnection(); // db연결됬는지 확인


app.listen(5000,()=>{
    console.log('sever is running')
})

module.exports = app;