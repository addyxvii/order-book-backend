import express from 'express';
import { WebsocketClient } from "poloniex-node-api";

require('dotenv').config()
// import socket from 'socket.io';

const bittrex = require('node-bittrex-api'); 
const app = express();
const PORT = 8000;
const key = process.env.POLONIEX_API_KEY;
const secret = process.env.POLONIEX_API_SECRET;
const channels = [1002, "BTC_ETH"];
const websocket = new WebsocketClient({ key, secret, channels });

console.log(key, secret);
app.get('/', (req,res) => res.send('Express + TypeScript Server'));

websocket.connect();  
websocket.subscribe('BTC_ETH');
websocket.on("open", () => console.log("open"));
websocket.on("close", () => console.log("close"));
websocket.on("error", (error) => console.error(error));
websocket.on("message", (message) => console.info(message));

bittrex.getorderbook( { market : 'BTC-ETH', depth : 10, type : 'both' }, function( data: any ) {

    data.result.buy.forEach(function(dataset: any) { console.log(dataset); });
    data.result.sell.forEach(function(dataset: any) { console.log(dataset); });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});