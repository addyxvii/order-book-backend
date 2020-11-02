import express from 'express';
// import socket from 'socket.io';

const bittrex = require('node-bittrex-api'); 
const app = express();
const PORT = 8000;
app.get('/', (req,res) => res.send('Express + TypeScript Server'));

bittrex.getorderbook( { market : 'BTC-ETH', depth : 10, type : 'both' }, function( data: any ) {

    data.result.buy.forEach(function(dataset: any) { console.log(dataset); });
    data.result.sell.forEach(function(dataset: any) { console.log(dataset); });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});