import express from 'express';
import io from 'socket.io';
import cors from 'cors'

import { WebsocketClient } from "poloniex-node-api";

require('dotenv').config()

const bittrex = require('node-bittrex-api');
const app = express();
const PORT = 8000;
const socketServer = io(PORT)
const key = process.env.POLONIEX_API_KEY;
const secret = process.env.POLONIEX_API_SECRET;
const channels = ["BTC_ETH"];
const poloniex = new WebsocketClient({ key, secret, channels });

app.get('/', (req, res) => res.send(res.status));

app.use(cors())

socketServer.origins((origin, callback) => {
  if (origin !== '*:*') {
    return callback('origin not allowed', false);
  }
  callback(null, true);
});

socketServer.on('connect', (socket) => {

  socket.on('fetchPolinexData', () => {
    poloniex.connect();
    poloniex.on("open", () => poloniex.subscribe('BTC_ETH'));
    poloniex.on("message", (data: any) => {
      if(data.currencyPair){
        let poloniexData = (({type, price, size}) => ({exchange: 'poloniex',type, price, size}))(data);
        socket.emit('recievePoloniexData',  poloniexData )
        ;
      }    
    });
  })
  
  socket.on('fetchBittrexData', () => {
    bittrex.websockets.subscribe(['BTC-ETH'], (data: any) => {
      if (data.M === 'updateExchangeState') {
          let asks
          let bids
    
        data.A[0].Buys.forEach((data: any) => {
          bids = (({Rate, Quantity}) => ({exchange: 'bittrex', Rate, Quantity, type : 'bid'}))(data);
        });
    
        data.A[0].Sells.forEach((data: any) => {
          asks = (({Rate, Quantity}) => ({exchange: 'bittrex', Rate, Quantity, type : 'ask'}))(data);
        });
          socket.emit('recieveBittrexData', { asks, bids });    
      }
    });  
  });
});

app.listen(process.env.PORT)