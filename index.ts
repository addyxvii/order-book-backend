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
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  })


socketServer.on('connect', (socket) => {

  console.log('Socket connected')

  socket.on('fetchPolinexData', () => {

    console.log('client wants polinex data')
    poloniex.connect();
    poloniex.on("open", () => poloniex.subscribe('BTC_ETH'));
    poloniex.on("message", (data: any) => {
      if(data.currencyPair){
        let poloniexData = (({type, price, size}) => ({type, price, size}))(data);
        socket.emit('recievePoloniexData', { poloniexData });
      }    
    });
  })
  // browser sends the "fetchBittrexData" message, and it is recieved here
  socket.on('fetchBittrexData', () => {

    console.log(`client wants us to fetch bittrex data`)

  //   // FETCH BITTREX DATA HERE 
    bittrex.websockets.subscribe(['BTC-ETH'], (data: any) => {
      if (data.M === 'updateExchangeState') {
          let asks
          let bids
    
        data.A[0].Buys.forEach((data_for: any) => {
          bids = (({Rate, Quantity}) => ({Rate, Quantity, type : 'bid'}))(data_for);
        });
    
        data.A[0].Sells.forEach((data_for: any) => {
          asks = (({Rate, Quantity}) => ({Rate, Quantity, type : 'ask'}))(data_for);
        });
    
          socket.emit('recieveBittrexData', { asks, bids });    
      }
    });  
  });
});

app.listen(process.env.PORT)