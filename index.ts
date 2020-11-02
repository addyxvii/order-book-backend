import express from 'express';
import { WebsocketClient } from "poloniex-node-api";

require('dotenv').config()
// import socket from 'socket.io';

const bittrex = require('node-bittrex-api'); 
const app = express();
const PORT = 8000;
const key = process.env.POLONIEX_API_KEY;
const secret = process.env.POLONIEX_API_SECRET;
const channels = ["BTC_ETH"];
const poloniex = new WebsocketClient({ key, secret, channels });

app.get('/', (req,res) => res.send('Express + TypeScript Server'));

poloniex.connect();  
poloniex.on("open", () => poloniex.subscribe('BTC_ETH'));
poloniex.on("message", (message) => console.log(message));

bittrex.websockets.subscribe(['BTC-ETH'], (data: any) => {
  if (data.M === 'updateExchangeState') {
    data.A.forEach((data_for: any) => {
      console.log('Market Update for '+ data_for.MarketName, data_for);
    });
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});